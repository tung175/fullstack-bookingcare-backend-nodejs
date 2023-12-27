import db from "../models";

let postCreateNewClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });

        resolve({
          errCode: 0,
          errMessage: "oke",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      // console.log("check data: ", data);
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "oke",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailClinicByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check data: ", data);
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "name",
            "address",
            "descriptionHTML",
            "descriptionMarkdown",
          ],
        });

        if (data) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: inputId },
            attributes: ["doctorId", "provinceId"],
          });

          data.doctorClinic = doctorClinic;
        } else data = {};
        resolve({
          errCode: 0,
          errMessage: "oke",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteAClinicService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check data: ", data);
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let foundClinic = await db.Clinic.findOne({
          where: { id: inputId },
        });
        if (!foundClinic) {
          resolve({
            errCode: 2,
            errMessage: "The Clinic isnt exist",
          });
        }
        await db.Clinic.destroy({
          where: {
            id: inputId,
          },
        });
        resolve({
          errCode: 0,
          errMessage: "oke",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let editAClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
    //   console.log(data);
      if (
        !data.id ||
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing required",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });
    //   console.log(clinic);
      if (clinic) {
        (clinic.name = data.name),
          (clinic.address = data.address),
          (clinic.imageBase64 = data.imageBase64),
          (clinic.descriptionHTML = data.descriptionHTML),
          (clinic.descriptionMarkdown = data.descriptionMarkdown);

        await clinic.save();

        resolve({
          errCode: 0,
          message: "update the Clinic succeeds",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Clinic not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  postCreateNewClinicService,
  getDetailClinicByIdService,
  getAllClinicService,
  deleteAClinicService,
  editAClinicService,
};
