import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env file

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP server is ready to take messages");

    // Send simple test email
    const info = await transporter.sendMail({
      from: `"Test Mail" <${process.env.MAIL_FROM_EMAIL || "no-reply@yopmail.com"}>`,
      to: "adam@yopmail.com", // this email will appear inside MAIL inbox
      subject: "Hello from Node.js",
      text: "This is a plain text test email",
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending test email:", err);
  }
}

sendTestEmail();
