import express, {Application} from "express";
const fileUpload = require('express-fileupload');
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express()

import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import sendMailRoute from "./routes/sendMail.route";
import uploadRoute from "./routes/upload.route";
import eventRoute from "./routes/event.route";

// SETTINGS
app.set('port', process.env.PORT || 4000);

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(fileUpload());


app.use(express.static('public'));

// ROUTES
app.use('/api/', authRoute);
app.use('/api/', userRoute);
app.use('/api/', sendMailRoute);
app.use('/api/', uploadRoute);
app.use('/api/', eventRoute);

export default app;