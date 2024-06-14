import * as mail from 'nodemailer';
import { ADMIN, MAIL_KEY } from '../config/config.js';  // Asegúrate de que ADMIN esté definido en tu config.js


export const enviar_correo = async (to, content) => {
    try {
        let transporter = mail.createTransport({
            host: 'smtp.gmail.com',
            port: 587, 
            secure: false, 
            auth: {
                user:ADMIN,
                pass: MAIL_KEY
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        let info = await transporter.sendMail({
            priority: 'high',
            from: `Coder Prueba <do-not-reply@app.prueba.com>`,
            to: to,
            ...content
        })

        console.log('Correo enviado: %s', info.messageId);
        return info;
    } catch (err) {
        return err;
    }
};
