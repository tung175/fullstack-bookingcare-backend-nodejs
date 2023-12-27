import specialtyService from '../services/specialtyService'

let postCreateNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.postCreateNewSpecialtyService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialtyService()
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        // console.log(req.query.id);
        let data = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let deleteASpecialty = async (req, res) => {
    try {
      if (!req.body.id) {
        return res.status(200).json({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }
      let data = await specialtyService.deleteASpecialtyService(req.body.id);
      return res.status(200).json(data);
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
  };
  
  let editASpecialty = async (req, res) => {
    try {
      let data = req.body;
      let message = await specialtyService.editASpecialtyService(data);
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
    postCreateNewSpecialty, getAllSpecialty, getDetailSpecialtyById, deleteASpecialty, editASpecialty
}