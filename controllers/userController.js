const Account = require("../models/accountModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

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
//     "birthDate"
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

// exports.getAllusers = catchAsync(async (req, res, next) => {
//   const users = await Account.find();
//   res.status(201).json({
//     status: "success",
//     accountNumber: users.length,
//     users,
//   });
// });
// exports.getUserById = catchAsync(async (req, res, next) => {
//   const users = await Account.findById(req.params.id);
//   res.status(201).json({
//     status: "success",
//     accountNumber: users.length,
//     users,
//   });
// });

// exports.getUserByRole = catchAsync(async (req, res, next) => {
//   const users = await Account.findById(req.body.role);
//   res.status(201).json({
//     status: "success",
//     accountNumber: users.length,
//     users,
//   });
// });
