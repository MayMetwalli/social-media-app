

import nodemailer from "nodemailer"
import { IEmailArgument } from "../../Common"
import { userModel } from "../../DB/Models";

export const sendEmail = async ({
    to,
    cc,
    subject,
    content,
    attachments=[]

}:IEmailArgument
)=>{
    const transporter = nodemailer.createTransport({
        host:"smtp.mail.com",
        port:465,
        secure: true,
        service: "gmail",
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
        }
    })

    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to,
        cc,
        html:content,
        subject,
        attachments
    });

    console.log('info',info)
    return info 
};



import {EventEmitter} from "node:events";
export const localEmitter = new EventEmitter()

localEmitter.on('sendEmail', (args:IEmailArgument)=>{
    console.log(`The email sending event started`)
    console.log(args)

    sendEmail(args)
});

localEmitter.on(
  "mentionUsers",
  async ({
    content,
    senderName,
  }: {
    content: string;
    senderName: string;
  }) => {
    try {
      console.log("Mention event started");

      const mentions = content.match(/@(\w+)/g);
      if (!mentions) return console.log("No mentions found");

      const usernames = mentions.map((m) => m.replace("@", ""));
    const mentionedUsers = await userModel.find({
    firstName: { $in: usernames },
        });


      if (!mentionedUsers.length) return console.log("No users found for mentions");

      for (const user of mentionedUsers) {
        await sendEmail({
          to: user.email,
          subject: `${senderName} mentioned you`,
          content: `${senderName} mentioned you in a post.`,
        });
      }

      console.log(
        `Mention emails sent to: ${mentionedUsers
          .map((u) => u.firstName)
          .join(", ")}`
      );
    } catch (error: any) {
      console.error("Error processing mentions:", error.message);
    }
  }
);