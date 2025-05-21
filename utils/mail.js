import { config } from "dotenv";
import { text } from "express";
import nodemailer from "nodemailer";

config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "rithickroshan7878@gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rithickroshan7878@gmail.com",
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendAutoReply = async (mail, name) => {
  try {
    const mailOptions = {
      from: "rithickroshan7878@gmail.com",
      to: mail,
      subject: "Thanks for Your Message!",
      text: `Hi ${name || "Sir/Mam"},

Thanks for reaching out!

Your message has been received successfully. I’ll get back to you as soon as possible, If a response is needed.

Best regards,
Rithickroshan S
bit.ly/rithickroshan`
    };
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error);
    return;
  }
};
