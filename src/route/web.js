import express from "express"
import homeController, { getHomePage } from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from '../controllers/doctorController'
import patientController from '../controllers/patientController'
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'
import handbookController from '../controllers/handbookController'

let router = express.Router()

let initWebRoutes = (app) =>{

    //CRUD Tutorial
    router.get('/', homeController.getHomePage)
    router.get('/CRUD', homeController.getCRUD)

    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)

    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    //APIs ReactJS
    //CRUD Redux
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)

    router.get('/api/allcode', userController.getAllCode)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.put('/api/edit-user', userController.handleEditUser)

    //Doctor
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.postBulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)

    //patient
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)

    //specialty
    router.post('/api/create-new-specialty', specialtyController.postCreateNewSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.delete('/api/delete-specialty', specialtyController.deleteASpecialty)
    router.put('/api/edit-specialty', specialtyController.editASpecialty)

    //clinic
    router.post('/api/create-new-clinic', clinicController.postCreateNewClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    router.delete('/api/delete-clinic', clinicController.deleteAClinic)
    router.put('/api/edit-clinic', clinicController.editAClinic)

    //handbook
    router.post('/api/create-new-handbook', handbookController.postCreateNewHandbook)
    router.get('/api/get-handbook', handbookController.getAllHandbook )
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById)
    router.delete('/api/delete-handbook', handbookController.deleteAHandbook)
    router.put('/api/edit-handbook', handbookController.editAHandbook)

    return app.use("/", router)
}

module.exports = initWebRoutes