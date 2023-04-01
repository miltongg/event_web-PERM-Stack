import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "miltongonzalezgaliano@gmail.com",
    pass: "rzaupeecmapseyuj"
  }
});

const sendEmail = async (email: string, subject: string, text: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: "miltongonzalezgaliano@gmail.com",
    to: email,
    subject: subject,
    html: `
      <div style="width: 100%; font-size: 25px; text-align: center;">
        ${text}: <br/><br/>
        <b>${otp}</b>
      </div>
      
    `
  })
}

export default sendEmail;