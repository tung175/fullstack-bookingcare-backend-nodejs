import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookAppointmentService(req.body)
        return res.status(200).json(
            data
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}
let postVerifyBookAppointment = async () => {
    try {
        let data = await patientService.postBookAppointmentService(req.body)
        return res.status(200).json(
            data
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}
module.exports = {
    postBookAppointment, postVerifyBookAppointment
};
