import db from "../models/index";
require("dotenv").config();
import _, { assignWith } from "lodash";
import emailService from "../services/emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredFields = (inputData) => {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];

  let isValid = true;
  let element = "";
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let getAllDoctorsService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveDetailInforDoctorService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("check input data", inputData);
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      } else {
        //upsert to markdown
        if (inputData.action === "ADD") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            (doctorMarkdown.contentHTML = inputData.contentHTML),
              (doctorMarkdown.contentMarkdown = inputData.contentMarkdown),
              (doctorMarkdown.description = inputData.description),
              // (doctorMarkdown.doctorId = inputData.doctorId);
              (doctorMarkdown.updateAt = new Date());

            await doctorMarkdown.save();
          }
        }

        //upsert to doctor_infor table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    // console.log("check inputId from server:", inputId );
    try {
      if (!inputId) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("check data: ", data);
      if (!data.arrSchedule || !data.doctorId || !data.formateDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required param !",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //get existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formateDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        //convert date
        // if (existing && existing.length > 0) {
        //   existing = existing.map(item => {
        //     item.date = new Date(item.date).getTime()
        //     return item
        //   })
        // }

        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {}
  });
};

let getScheduleByDateService = (doctorId, date) => {
  // console.log("check data to server:" , doctorId, date);
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required param !",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) {
          dataSchedule = [];
        }
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInforDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    // console.log("check inputId from server:", inputId );
    try {
      if (!inputId) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    // console.log("check inputId from server:", inputId );
    try {
      if (!inputId) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let sendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64
      ) {
        // console.log("Check data form server", data);
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        //update status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        await emailService.sendAttachment(data);

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

let getListPatientForDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "missing parameters",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        // console.log(data);

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
module.exports = {
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveDetailInforDoctorService,
  getDoctorByIdService,
  bulkCreateScheduleService,
  getScheduleByDateService,
  getExtraInforDoctorByIdService,
  getProfileDoctorByIdService,
  getListPatientForDoctorService,
  sendRemedyService,
};
