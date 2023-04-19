import {Response} from "express";
import OTP from "../models/OTP";

const saveOTP = async (res: Response, otp: string, id?: string, email?: string) => {
  
  try {
    
    return OTP.create({
      userId: id,
      email,
      otp
    })
    
  } catch ({message}) {
    console.log(message);
    res.status(505).json({
      message
    })
  }
}
export default saveOTP;