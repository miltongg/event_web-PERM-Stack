import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import randomId from "../../libs/randomId";
import sendEmail from "../../libs/mailSender";
import randomCode from "../../libs/randomVerifyCode";
import saveOTP from "../../libs/saveOTP";
import { StatusCodes } from "http-status-codes";

export default async function signup(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let { name, username, email, password, confirmPassword } = req.body;

    if (!name || !username || !email || !password)
      return res.status(401).json({
        message: "No pueden haber campos vacíos",
      });

    // VALIDATE EMAIL //
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!regexp.test(email)) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      message: 'Este correo no es valido'
    });

    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail)
      return res.status(401).json({
        message: "Este correo ya esta en uso",
      });

    const checkUsername = await User.findOne({ where: { username } });
    if (checkUsername)
      return res.status(401).json({
        message: "Este alias ya esta en uso",
      });

    if (password !== confirmPassword)
      return res.status(401).json({
        message: "Las contraseñas no coinciden",
      });

    password = bcrypt.hashSync(password, 10);

    const { dataValues } = await User.create({
      id: "user_" + randomId(),
      name,
      username,
      email,
      password,
    });

    const otp = randomCode();

    // await sendEmail(email, SIGNUP_EMAIL_SUBJECT, SIGNUP_EMAIL_TEXT, otp)
    await saveOTP(res, otp, dataValues.id);

    console.log(otp);
    return res.json({ data: dataValues.id });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
}
