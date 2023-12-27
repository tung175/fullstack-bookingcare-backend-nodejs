require('dotenv').config();
import nodemailer from "nodemailer"

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: "Gmail",
        port: 456,
        secure: false,
        auth: {
            // type: "login", // default
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })
    let info = await transporter.sendMail({
        from: '"BookingCare"<hankyusama@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend)
    })

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Web BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên đúng với thông tin bạn đã đặt lịch, vui lòng ấn vào liên kết phía dưới để xác nhận hoàn thành lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Ấn vào đây</a>
        </div>

        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Web BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên đúng với thông tin bạn đã đặt lịch, vui lòng ấn vào liên kết phía dưới để xác nhận hoàn thành lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Thank you so much</div>
        `
    }
    return result
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Web BookingCare</p>
        <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm. </p>

        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang Web BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh. </p>

        <div>Thank you so much</div>
        `
    }
    return result
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD
                }
            })
            let info = await transporter.sendMail({
                from: '"BookingCare"<hankyusama@gmail.com>',
                to: dataSend.email,
                subject: "Ket qua dat lich kham benh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientName}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding: 'base64'
                    }
                ]
            })

            resolve(true)
        } catch (e) {
           reject(e) 
        }
    })
}
module.exports ={
    sendSimpleEmail, sendAttachment
}
