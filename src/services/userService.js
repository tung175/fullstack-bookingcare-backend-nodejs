import { where } from "sequelize";
import db from "../models/index";
import bcrypt, { hash } from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExist = await checkUserEmail(email);
      let userData = {};
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "password", "roleId", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `your's Email isn't exist in your sustem. pleses try other Email`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let compareUserPassword = () => {
  return new Promise((resolve, reject) => {
    try {
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e)
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exit
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used, plz try another email !",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(
          data.password
        );
        console.log(data);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar
        });
        resolve({
          errCode: 0,
          message: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: {id: userId}
    })
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: 'The user isnt exist'
      })
    } 
    await db.User.destroy({
      where: {
        id: userId
      }
    })

    resolve({
      errCode: 0,
      errMessage: 'the user is delete'
    })
  })
}

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: "Missing required",
        });
      } 
      let user = await db.User.findOne({
        where: {id: data.id},
        raw: false
      })
      if (user) {
          user.firstName = data.firstName,
          user.lastName = data.lastName,
          user.address = data.address,
          user.roleId = data.roleId,
          user.gender = data.gender,
          user.positionId = data.positionId,
          user.phoneNumber = data.phonenumber

          if (data.avatar) {
            user.image = data.avatar
          }

          await user.save()

          resolve({
            errCode: 0,
            message: 'update the user succeeds'

          })
      } else {
        resolve({
          errCode: 1,
          errMessage: 'user not found'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}
module.exports = {
  handleUserLogin,
  getAllUsers,
  getAllCodeService,
  createNewUser,
  deleteUser,
  updateUserData
};
