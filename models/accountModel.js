const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const accountSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your frist name !"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name !"],
  },
  role: {
    type: String,
    enum: ["LISTENER", "ARTIST"],
    default: "LISTENER",
  },
  email: {
    type: String,
    required: [true, "Please provide your email !"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide your password !"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password !"],
    // this only work on save and create :
    validate: function (el) {
      return this.password === el;
    },
    message: "Please confirm your password ",
  },
  modifypasswordAt: {
    type: Date,
    select: true,
  },
  passwordResetToken: { type: String, select: true },
  passwordResetExpires: { type: Date, select: true },
  failedLogin: {
    type: Number,
    default: 0,
    select: true,
  },
  loginAfter: {
    type: Date,
    default: null,
    select: true,
  },
  accountStatus: {
    type: Boolean,
    default: true,
  },
  activeAccountToken: { type: String, select: true },
  activeAccountTokenExpires: { type: Date, select: true },
  active: Boolean,
});
//----- MIDDLEWERE -----------------------
// accountSchema.pre(/^find/, async function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });
accountSchema.pre("save", async function (next) {
  setTimeout(async () => {
    const user = await Account.findById(this._id);
    console.log("Function triggered after 60 second");
    console.log(user.firstName);
  }, [180000]);

  console.log("Going to the next middleware !");

  next();
});

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.modifypasswordAt = Date.now() - 1000;
});

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

//----------- METHODS -----------
// 1 ) correctPassword
accountSchema.methods.correctPassword = async function (
  userpassword,
  password
) {
  return await bcrypt.compare(userpassword, password);
};
// 2 ) changePasswordAfter

// accountSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
//   if (this.changedTimepassword) {
//     const changedTimepassword = parseInt(
//       this.modifypassword.getTime() / 1000,
//       10
//     );
//     return JWTTimeStamp < changedTimepassword;
//   }
//   //False means no change
//   return false;
// };
// 3 ) createPasswordResetToken

accountSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// 4 ) Active Account Token :
accountSchema.methods.createActiveAccountToken = function () {
  const Token = crypto.randomBytes(32).toString("hex");
  activeAccountToken = crypto.createHash("sha256").update(Token).digest("hex");
  return activeAccountToken;
};

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
