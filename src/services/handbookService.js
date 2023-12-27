import db from "../models";
let postCreateNewHandbookService = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log("check data", data);
        try {
            if (!data.name || !data.imageBase64 ||  !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }   else {
                await db.Handbook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: "oke"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllHandbookService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Handbook.findAll({})
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

let getDetailHandbookByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check data: ", data);
            if (!inputId) {
               resolve({
                errCode: 1,
                errMessage: "Missing parameter"
               })
              
            } else {
                let data = await db.Handbook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name','descriptionHTML', 'descriptionMarkdown'],
                })

                // if (data) {
                //     let doctorClinic = []
                    
                //         doctorClinic = await db.Doctor_Infor.findAll({
                //             where: {clinicId: inputId},
                //             attributes: ['doctorId', "provinceId"]
                //         })
                    
                //     data.doctorClinic = doctorClinic
                // } else data = {}
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

let deleteAHandbookService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check data: ", data);
            if (!inputId) {
               resolve({
                errCode: 1,
                errMessage: "Missing parameter"
               })
              
            } else {
                let foundHandbook = await db.Handbook.findOne({
                    where: { id: inputId },
                  });
                  if (!foundHandbook) {
                    resolve({
                      errCode: 2,
                      errMessage: "The Clinic isnt exist",
                    });
                  }
                  await db.Handbook.destroy({
                    where: {
                      id: inputId,
                    },
                  });
                resolve({
                    errCode: 0,
                    errMessage: "oke",
                    
                })
            }
           
        } catch (e) {
            reject(e)
        }
    })
}

let editAHandbookService = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
      //   console.log(data);
        if (
          !data.id ||
          !data.name ||
          // !data.address ||
          !data.imageBase64 ||
          !data.descriptionHTML ||
          !data.descriptionMarkdown
        ) {
          resolve({
            errCode: 2,
            errMessage: "Missing required",
          });
        }
        let handbook = await db.Handbook.findOne({
          where: { id: data.id },
          raw: false,
        });
      //   console.log(clinic);
        if (handbook) {
          (handbook.name = data.name),
            // (handbook.address = data.address),
            (handbook.imageBase64 = data.imageBase64),
            (handbook.descriptionHTML = data.descriptionHTML),
            (handbook.descriptionMarkdown = data.descriptionMarkdown);
  
          await handbook.save();
  
          resolve({
            errCode: 0,
            message: "update the Handbook succeeds",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Handbook not found",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };
module.exports = {
    postCreateNewHandbookService, getAllHandbookService, getDetailHandbookByIdService, deleteAHandbookService, editAHandbookService
}