import nodemailer from "nodemailer";

class EmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
    await this.transporter.sendMail({
      from: `"Social App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }
}

export default new EmailService();
