import bcrypt from "bcryptjs"
import db from "../models/index"

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) =>{
    return new Promise (async (resolve, reject) =>{
        try {
            let hashUserPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashUserPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                // image: data.STRING,
                roleId: data.roleId,
                // positionId: data.STRING,
            })

            resolve('create sucssed')
        } catch (e) {
            reject(e)
        }
    })
}

let hashUserPassword = (password) =>{
    return new Promise (async(resolve, reject) =>{
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllusers = () =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let users = await db.User.findAll({
                raw: true,
                //Other parameters
               })
            resolve(users)
        } catch (e) {
            reject(e)
        } 
    })
}

let getUserInfoById = (userId) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                raw: true,
                where: {id: userId}
            })

            if (user) {
                resolve(user)             
            } else {
                resolve([])
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateUserData = (data) =>{
    return new Promise (async (resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where: { id: data.id}
            })
            if(user){
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address

                await user.save()

                // let allUsers = await db.User.findAll()
                // resolve(allUsers)
                resolve()
            }else{
                resolve([])
            }
        } catch (e) {
            console.log(e);
            reject(e)
        }
    })
    // console.log('data form sevice');
    // console.log(data);
}

let deleteUserById = (userId) =>{
    new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : {id: userId}
            })

            if(user){
                await user.destroy()
            }

            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createNewUser, getAllusers, getUserInfoById, updateUserData, deleteUserById
}