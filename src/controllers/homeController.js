import db from "../models/index"
import CRUDService from "../services/CRUDService"
let getHomePage = async (req, res) =>{
    try {
        let data = await db.User.findAll()
        // console.log('-----------');
        // console.log(data);
        // console.log('----------');
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e);
    }
}

let getCRUD = (req, res) =>{
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) =>{
    let message = await CRUDService.createNewUser(req.body)
    console.log(message);
    return res.redirect("/get-crud")
}

let displayGetCRUD = async (req, res) =>{
    let data = await CRUDService.getAllusers()
    // console.log('-----------');
    // console.log(data);
    // console.log('----------');
    return res.render("displaycrud.ejs", {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) =>{
    let userId = await req.query.id
    // console.log(userId);
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId)
        // console.log('-----------');
        // console.log(userData);
        // console.log('----------');
        return res.render('editcrud.ejs', {
            user: userData
        })
        
    } else {
        return res.send('not found')
        
    }
    // console.log(req.params.id);
}

let putCRUD = async (req, res) => {
    let data = req.body
    let allUsers = await CRUDService.updateUserData(data)
    return res.redirect("/get-crud")
    // return res.send('Update sucsess')
}

let deleteCRUD = async (req, res) =>{
    let id = req.query.id
    if (id) {
        await CRUDService.deleteUserById(id)
        return res.redirect("/get-crud")
    } else {
        return res.send('delete not succsess')
    }
    
    
}
module.exports = {
    getHomePage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD
}