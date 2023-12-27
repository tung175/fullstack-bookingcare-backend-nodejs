import handbookService from '../services/handbookService'
let postCreateNewHandbook = async (req, res) => {
    try {
        let data = await handbookService.postCreateNewHandbookService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let data = await handbookService.getAllHandbookService()
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getDetailHandbookById = async (req, res) => {
    try {
        // console.log("Check req ", req.query.id);
        let data = await handbookService.getDetailHandbookByIdService(req.query.id)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let deleteAHandbook = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
              errCode: 1,
              errMessage: "Missing required parameters!",
            });
          }
          let data = await handbookService.deleteAHandbookService(req.body.id);
          return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server",
          });
    }
}

let editAHandbook = async (req, res) => {
    try {
        let data = req.body;
        let message = await handbookService.editAHandbookService(data);
        return res.status(200).json(message);
      } catch (e) {
        console.log(e);
        return res.status(200).json({
          errCode: -1,
          errMessage: "Error from the server",
        });
      }
}


module.exports = {
    postCreateNewHandbook, getAllHandbook, getDetailHandbookById, deleteAHandbook, editAHandbook
}