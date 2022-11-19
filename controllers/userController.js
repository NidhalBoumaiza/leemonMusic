const Account = require("../models/accountModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const { findById, findByIdAndUpdate } = require("../models/accountModel");

const filtredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
///*************************************** */

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   try {
//     await Account.findByIdAndUpdate(req.user.id, { active: false });
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch {
//     res.status(204).json({
//       status: "Error",
//       message: "Something wrong happened during Deleting your account ",
//     });
//   }
// });
// //*************************************** */
// exports.updateMe = catchAsync(async (req, res, next) => {
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "for updating the password use this URL : /updateUserPassword ! ",
//         400
//       )
//     );
//   }
//   const filtredBody = filtredObj(
//     req.body,
//     "name",
//     "email",
//     "photo",
//     "firstName",
//     "lastName",
//     "nickName"
//   );
//   // console.log(filtredBody);
//   const updatedUser = await Account.findByIdAndUpdate(
//     req.user.id,
//     filtredBody,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).json({
//     status: "Update",
//     user: updatedUser,
//   });
// });

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await Account.find();
  res.status(201).json({
    status: "success",
    accountNumber: users.length,
    users,
  });
});
exports.getUserByNickname = catchAsync(async (req, res, next) => {
  const user = await Account.find({ nickName: req.body.nickName });
  res.status(201).json({
    status: "success",
    user,
  });
});

exports.getUserByRole = catchAsync(async (req, res, next) => {
  const users = await Account.find({ role: req.body.role });
  res.status(201).json({
    status: "success",
    accountNumber: users.length,
    users,
  });
});

//*********************************************************************** */ */
//----------------------------disable my account ----------------------------------
exports.disableMyAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findByIdAndUpdate(req.user._id, {
    accountStatus: false,
  });
  res.status(201).json({
    status: "Success",
    message: "votre compte est maintenant désactiver",
    account,
  });
});
//-------------------- disable account By Admin ------------------------------------

exports.disableAccountByAdmin = catchAsync(async (req, res, next) => {
  const account = await Account.findByIdAndUpdate(req.params.id, {
    accountStatus: false,
    disabledByAdmin: true,
  });
  res.status(201).json({
    status: "Success",
    message: "Le compte est maintenant désactiver",
    account,
  });
});
//********************************************************************************* */
