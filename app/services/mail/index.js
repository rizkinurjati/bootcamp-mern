const nodemailer = require('nodemailer');
const { gmail, password } = require('../../config');
const Mustache = require('mustache');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: gmail, //menggunakan gmail yang kita daftarkan di .env
    pass: password, //menggunakan password yang kita daftarkan di .env
  },
});

const otpMail = async (email, data) => {
  try {
    let template = fs.readFileSync('app/views/email/otp.html', 'utf8');//merender views

    let message = {
      from: gmail,
      to: email,
      subject: 'Otp for registration is: ',
      html: Mustache.render(template, data), //meminta data dari services/mongoose/participant
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

const invoiceMail = async (email, data) => {
  try {
    let template = fs.readFileSync('app/views/email/invoice.html', 'utf8');//merender views

    let message = {
      from: gmail,
      to: email,
      subject: 'Invoice Order: ',
      html: Mustache.render(template, data), //meminta data dari services/mongoose/participant
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = { 
  otpMail,
  invoiceMail,
 };
