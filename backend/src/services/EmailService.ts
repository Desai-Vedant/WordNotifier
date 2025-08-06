import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, verificationCode: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendDailyWord(to: string, japaneseWord: string, englishMeaning: string, marathiMeaning: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: 'Your Daily Japanese Word',
      html: `
        <h1>Today's Japanese Word</h1>
        <p>Japanese: <strong>${japaneseWord}</strong></p>
        <p>English: ${englishMeaning}</p>
        <p>Marathi: ${marathiMeaning}</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
