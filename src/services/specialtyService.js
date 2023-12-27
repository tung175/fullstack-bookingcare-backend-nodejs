import db from "../models";

let postCreateNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check data: ", data);
            if (!data.name || !data.imageBase64 ||!data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter!"
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'oke'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Specialty.findAll({})
            // console.log("check data: ", data);
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
              
            }
            resolve({
                errCode: 0,
                errMessage: "oke",
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check data specialty: ", inputId, location);
            if (!inputId || !location) {
               resolve({
                errCode: 1,
                errMessage: "Missing parameter"
               })
              
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })

                if (data) {
                    let doctorSpecialty = []
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {specialtyId: inputId},
                            attributes: ['doctorId', "provinceId"]
                        })
                    } else {
                        //find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {specialtyId: inputId, provinceId: location},
                            attributes: ['doctorId', "provinceId"]
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: "oke",
                    data: data
                })
            }
           
        } catch (e) {
            reject(e)
        }
    })
}

let deleteASpecialtyService = (inputId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("check data: ", data);
        if (!inputId) {
          resolve({
            errCode: 1,
            errMessage: "Missing parameter",
          });
        } else {
          let foundSpecialty = await db.Specialty.findOne({
            where: { id: inputId },
          });
          if (!foundSpecialty) {
            resolve({
              errCode: 2,
              errMessage: "The Clinic isnt exist",
            });
          }
          await db.Specialty.destroy({
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
  
  let editASpecialtyService = (data) => {
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
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });
      //   console.log(clinic);
        if (specialty) {
          (specialty.name = data.name),
            (specialty.address = data.address),
            (specialty.imageBase64 = data.imageBase64),
            (specialty.descriptionHTML = data.descriptionHTML),
            (specialty.descriptionMarkdown = data.descriptionMarkdown);
  
          await specialty.save();
  
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
    postCreateNewSpecialtyService, getAllSpecialtyService, getDetailSpecialtyByIdService, deleteASpecialtyService, editASpecialtyService
}