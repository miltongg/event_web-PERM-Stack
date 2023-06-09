import express, { Application } from "express";

const fileUpload = require("express-fileupload");
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// IMPORT ROUTES //
import authRoute from "./routes/auth.route";
import commentRoute from "./routes/comment.route";
import eventRoute from "./routes/event.route";
import newsRoute from "./routes/news.route";
import ratingRoute from "./routes/rating.route";
import replyRoute from "./routes/reply.route";
import sendMailRoute from "./routes/sendMail.route";
import uploadRoute from "./routes/upload.route";
import userRoute from "./routes/user.route";
import gameRoute from "./routes/game.route";

// SETTINGS
app.set("port", process.env.PORT || 4000);

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use(express.static("public"));

// ROUTES
app.use("/api/", authRoute);
app.use("/api/", commentRoute);
app.use("/api/", eventRoute);
app.use("/api/", gameRoute);
app.use("/api/", newsRoute);
app.use("/api/", ratingRoute);
app.use("/api/", replyRoute);
app.use("/api/", sendMailRoute);
app.use("/api/", uploadRoute);
app.use("/api/", userRoute);

export default app
