const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            host:config.get("smtp_host"),
            port:config.get("smtp_port"),
            secure: false,
            auth: {
                user: config.get("smtp_user"),
                pass: config.get("smtp_password"),
            },
        });
    }
    async sendMailActivationCode(toEmail, otp){
        await this.transporter.sendMail({
            from: config.get("smtp_user"),
            to: toEmail,
            subject: "E-Navbat",
            text: "is your E-Navbat authentication code",
            html:`
            <div>
                <h2>
                    ${otp}
                </h2>
             </div>
            `,
            
        });
    }
}

module.exports = new MailService
