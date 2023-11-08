import db from "../models/index"
require('dotenv').config()
import emailService from "./emailService"
import {v4 as uuidv4} from "uuid"

let buildUrlEmail = () => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId${doctorId}`
    return result
}
let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter!"
                })
            } else {

                let token = uuidv4()
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                //update patient
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                })

                // console.log("check user patient servicer: ", user[0]);

                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save infor patient success"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointmentService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter!"
                })
            } else {
                let user = await db.Booking.findOne({
                    where: {email: data.email, token: data.token, statusId: 'S1'},
                    raw: false
                })

                // console.log("check user patient servicer: ", user[0]);
                //create a booking record
                if (appointment) {
                    appointment.statusId = "S2"
                    await appointment.save()

                    resolve({
                        errCode: 0,
                        errMessage: "Save infor patient success"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exits"
                    })
                }     
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports ={
    postBookAppointmentService, postVerifyBookAppointmentService 

}