import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHomeService(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctorsService()
    return res.status(200).json(doctors)
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctorService(req.body)
    // console.log("check req", req.body);
    return res.status(200).json(response)
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let getDetailDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getDoctorByIdService(req.query.id)
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

let postBulkCreateSchedule = async (req, res) => {
  try {
    let data = await doctorService.bulkCreateScheduleService(req.body)
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

let getScheduleByDate = async (req, res) => {
  try {
    let data = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date)
    // console.log("check data controller: ", req.query);
    return res.status(200).json(
      data
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let getExtraInforDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId)
    // console.log("check data controller: ", req.query);
    return res.status(200).json(
      data
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let getProfileDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getProfileDoctorByIdService(req.query.doctorId)
    // console.log("check data controller: ", req.query);
    return res.status(200).json(
      data
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let getListPatientForDoctor = async (req, res) => {
  try {
    let data = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.date)
    // console.log("check data controller: ", req.query);
    return res.status(200).json(
      data
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

let sendRemedy = async (req, res) => {
  try {
    let data = await doctorService.sendRemedyService(req.body)
    // console.log("check data controller: ", req.query);
    return res.status(200).json(
      data
    )
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

module.exports = {
  getTopDoctorHome, getAllDoctors, postInforDoctor, getDetailDoctorById, postBulkCreateSchedule, getScheduleByDate, getExtraInforDoctorById, getProfileDoctorById, getListPatientForDoctor, sendRemedy
};
