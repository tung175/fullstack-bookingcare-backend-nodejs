import express from "express"
import homeController, { getHomePage } from "../controllers/homeController"
let router = express.Router()

let initWebRoutes = (app) =>{
    router.get('/', homeController.getHomePage)
    return app.use("/", router)
}

module.exports = initWebRoutes