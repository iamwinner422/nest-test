import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
    private async transporter() {
        const testAccount = await nodemailer.createTestAccount();
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        return transport;
    }
    async sendSignupConfirmation(userMail: string) {
        ((await this.transporter()).sendMail({
            from: "hello@poulou.lou",
            to: userMail,
            subject: "Inscription",
            html: "<h3>Confirmation of inscription</h3>"
        }))
    } 
}
