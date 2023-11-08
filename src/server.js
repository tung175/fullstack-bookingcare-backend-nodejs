import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

let app = express();
app.use(cors({ origin: true }));
// const corsOpts = {
//   origin: process.env.PORT.URL_REACT,

//   methods: [
//     'GET',
//     'POST',
//     'PUT',
//     'DELETE'
//   ],

//   allowedHeaders: [
//     'Content-Type',
//   ],
// };

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', process.env.PORT.URL_REACT);
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

// app.use(cors(corsOpts))
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("Back end nodejs is runing on the port http://localhost:" + port);
});
