import clinicService from "../services/clinicService";

let postCreateNewClinic = async (req, res) => {
  try {
    let data = await clinicService.postCreateNewClinicService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinicService();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    // console.log("Check req ", req.query.id);
    let data = await clinicService.getDetailClinicByIdService(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteAClinic = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters!",
      });
    }
    let data = await clinicService.deleteAClinicService(req.body.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let editAClinic = async (req, res) => {
  try {
    let data = req.body;
    let message = await clinicService.editAClinicService(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  postCreateNewClinic,
  getAllClinic,
  getDetailClinicById,
  deleteAClinic,
  editAClinic,
};
