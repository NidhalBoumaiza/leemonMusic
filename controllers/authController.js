const { promisify } = require("util");
const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
require("dotenv").config();
//-----------------------------------------
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
//---------------------------------------------
createSendToken = (user, statuscode, res) => {
  const token = signToken(user._id);
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
  res.status(statuscode).json({
    status: "success",
    token,
    data: { user },
  });
};
//--------------------------------------
exports.signUp = catchAsync(async (req, res, next) => {
  let newAccount = null;
  if (req.body.role === "ARTIST") {
    if (!req.body.cin || !req.body.nickName) {
      return next(
        new AppError(
          "Vous devez ajouter votre cin et votre pseudo pour compléter votre inscription !",
          500
        )
      );
    } else {
      newAccount = await Account.create({
        profilePicture: req.body.profilePicture,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        cin: req.body.cin,
        firstName: req.body.firstName,
        nickName: req.body.nickName,
        lastName: req.body.lastName,
        role: "ARTIST",
        validated: false,
      });
    }
  } else {
    profilePicture: req.body.profilePicture,
      (newAccount = await Account.create({
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }));
  }

  const activeToken = newAccount.createActiveAccountToken();
  newAccount.activeAccountToken = activeToken;
  newAccount.activeAccountTokenExpires = Date.now() + 1000 * 60 * 60 * 1000;
  newAccount.save({ validateBeforeSave: false });

  const activeURL = `http://localhost:3000/activate/${activeToken}`;
  const message = `Bonjour,\n
  Merci de créer un compte a notre platform.\n
  Pour activer votre compte accéder le lien suivant:\n ${activeURL}`;
  try {
    await sendEmail({
      email: newAccount.email,
      subject: "Activation de compte",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Votre e-mail d'activation a été envoyé avec succès ",
    });
  } catch (err) {
    console.log(err);
    // newAccount.activeAccountToken = undefined;
    // newAccount.activeAccountTokenExpires = undefined;
    // newAccount.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "Une erreur s'est produite lors de l'envoi de l'e-mail ! Merci d'essayer plus tard .",
        500
      )
    );
  }
});
//---------------------------------------------
exports.activeAccount = catchAsync(async (req, res, next) => {
  token = req.params.token;
  account = await Account.findOne({
    activeAccountToken: token,
  });
  if (!account) {
    return next(new AppError("Le jeton n'est pas valide !"));
  }
  if (Date.now() > account.activeAccountTokenExpires) {
    await Account.findOneAndDelete({ activeAccountToken: token });
    return next(
      new AppError(
        "Votre jeton d'activation n'est plus valide, veuillez vous réinscrire !"
      )
    );
  }
  account.accountStatus = true;
  account.activeAccountToken = undefined;
  account.activeAccountTokenExpires = undefined;
  await account.save({ validateBeforeSave: false });
  createSendToken(account, 201, res);
});
//-------------------------------------------------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if the user write down his email or not
  if (!email || !password) {
    return next(
      new AppError("Veuillez saisir votre email et votre mot de passe", 400)
    );
  }

  const account = await Account.findOne({ email }).select("+password");
  if (!account) {
    return next(new AppError("E-mail ou mot de passe incorrect", 401));
  }

  if (account && !(await account.correctPassword(password, account.password))) {
    if (Date.now() < account.loginAfter) {
      return next(
        new AppError(
          `Vous avez essayé plusieurs fois de vous connecter, veuillez réessayer après ${account.loginAfter} minutes`,
          400
        )
      );
    }
    account.failedLogin = account.failedLogin + 1;
    account.save({ validateBeforeSave: false });
    if (account.failedLogin > 5) {
      account.loginAfter = Date.now() + 5 * 60 * 1000;
      account.failedLogin = 0;
      account.save({ validateBeforeSave: false });
      return next(
        new AppError(
          `Vous avez essayé plusieurs fois de vous connecter, veuillez réessayer après ${account.loginAfter} minutes`,
          400
        )
      );
    }
    return next(new AppError("E-mail ou mot de passe incorrect", 401));
  }

  if (account.accountStatus === false && account.disabledByAdmin === true) {
    return next(
      new AppError(
        "Votre compte a été désactivé par l'administrateur en raison d'une action que vous avez commise, veuillez contacter l'administrateur .",
        401
      )
    );
  }

  if (account.accountStatus === false) {
    const activeToken = account.createActiveAccountToken();
    account.activeAccountToken = activeToken;
    account.activeAccountTokenExpires = Date.now() + 1000 * 60 * 60 * 1000;
    account.save({ validateBeforeSave: false });

    const activeURL = `http://localhost:3000/activate/${activeToken}`;
    const message = `Bonjour,\n
    Vous avez désactiver votre compte.\n
    Pour activer votre compte une autre fois.\n Accéder le lien suivant:   ${activeURL}`;

    try {
      await sendEmail({
        email: account.email,
        subject: "Activation du compte après désactivation",
        message,
      });

      return res.status(200).json({
        status: "success",
        message: "Votre e-mail d'activation a été envoyé avec succès ",
      });
    } catch {
      // newAccount.activeAccountToken = undefined;
      // newAccount.activeAccountTokenExpires = undefined;
      // newAccount.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "Une erreur s'est produite lors de l'envoi de l'e-mail ! Merci d'essayer plus tard:)",
          500
        )
      );
    }
  }

  account.failedLogin = 0;
  account.loginAfter = undefined;
  account.save({ validateBeforeSave: false });
  createSendToken(account.role, 200, res);
});

//-----------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
  // 1) verify if the user is loged in :
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(
      new AppError(
        "Vous n'êtes pas connecté ! Veuillez vous connecter pour accéder à cet page .",
        401
      )
    );
  }
  // 2) verify if the token is valid or not :
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) verify if the user still exist in database or no :
  const currentUser = await Account.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("L'utilisateur n'existe plus !"));
  }
  // verify if the password has been changed after login or no
  // if (!currentUser.changePasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('Your password has been modified please login again ! ')
  //   );
  // }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  // AUTHORIZATION
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Vous n'avez pas la permission de faire cette action !! "),
        403
      );
    }
    next();
  };
};
//---------------------------  Forgot Password -----------------------------
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 - get the email from the client and verify if it exist or not
  const email = req.body.email;
  const account = await Account.findOne({ email });
  if (!account) {
    return next(
      new AppError("Il n'y a pas d'utilisateur avec cette adresse e-mail", 404)
    );
  }
  // 2 - generate a token with which the password is gonna reset :
  const resetToken = account.createPasswordResetToken();
  account.save({ validateBeforeSave: false });
  // 3 - send the token to the client to use it and reset his password :
  const resetURL = `http://localhost:3000/reset/password/${resetToken}`;
  const message = `Bonjour,\n
  Vous avez oublié votre mot de passe ?\n
  Voici un lien pour le réinitialiser.\n ${resetURL}
  Si vous n'avez pas oublié votre mot de passe, veuillez ignorer cet e-mail  `;
  try {
    await sendEmail({
      email: account.email,
      subject: "URL de réinitialisation de mot de passe (Valable 10 minutes) ",
      message,
    });
    res.status(200).json({
      status: "success",
      message:
        "Votre mot de passe de réinitialisation de l'e-mail a été envoyé avec succès ",
    });
  } catch (err) {
    account.passwordResetExpires = undefined;
    account.passwordResetToken = undefined;
    account.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "Une erreur s'est produite lors de l'envoi de l'e-mail ! Merci d'essayer plus tard .",
        500
      )
    );
  }
});
//------------------------------------
exports.resetPassword = catchAsync(async (req, res, next) => {
  //verify if the token passed in the URL is valid and correct or no :
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!account) {
    return next(new AppError("Le jeton est invalide ou a expiré !! "), 404);
  }
  // -- If the token has not expires and the account exist :
  //   if (req.body.password != req.body.password) {
  //     return next(new AppError("You have to confirm your password"), 404);
  //   }
  if (account.correctPassword(req.body.password, account.password)) {
    return next(
      new AppError(
        "Saisir une autre mot de passe differnt de votre ancien mot de passe ! "
      ),
      400
    );
  }

  account.password = req.body.password;
  account.passwordConfirm = req.body.passwordConfirm;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();
  // -- Modify the passwordModifyAt propertie
  // loged the user In :
  createSendToken(account, 200, res);
});
//------------------------------------
exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.user.id,
  }).select("+password");
  // console.log(user);
  if (
    !(await account.correctPassword(req.body.oldPassword, account.password))
  ) {
    return next(
      new AppError(
        "vous devez entrer votre ancien mot de passe correctement !! ",
        404
      )
    );
  }

  if (account.correctPassword(req.body.newPassword, account.password)) {
    return next(
      new AppError(
        "Saisir une autre mot de passe differnt de votre ancien mot de passe ! "
      ),
      400
    );
  }

  account.password = req.body.newPassword;
  account.passwordConfirm = req.body.newpasswordConfirm;
  await account.save();
  try {
    await sendEmail({
      email: account.email,
      subject: "mot de passe modifié",
      message: "Votre mot de passe est modifié ",
    });

    createSendToken(account, 200, res);
  } catch (err) {
    console.log(err.message);
  }
});
