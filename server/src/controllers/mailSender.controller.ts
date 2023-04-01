import { Request, Response } from "express";
import randomCode from "../libs/randomVerifyCode";
import sendEmail from "../libs/mailSender";
import saveOTP from "../libs/saveOTP";
import { RESET_EMAIL_SUBJECT, RESET_EMAIL_TEXT } from "../helpers/defineConsts";

export default async function mailSenderController(
  req: Request,
  res: Response
) {
  try {
    const otp = randomCode();
    await saveOTP(res, otp);

    await sendEmail(req.body.email, RESET_EMAIL_SUBJECT, RESET_EMAIL_TEXT, otp);
    res.json("mail sent");
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
}
