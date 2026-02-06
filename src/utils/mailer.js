import nodemailer from "nodemailer";
import twilio from "twilio";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@miapp.com";
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

// Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_FROM = process.env.TWILIO_PHONE_FROM;

function createTransporter() {
  let transporterConfig = null;

  if (SENDGRID_API_KEY) {
    // Usar SendGrid vía SMTP (user=apikey, pass=SENDGRID_API_KEY)
    transporterConfig = {
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY
      }
    };
  } else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporterConfig = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    };
  } else {
    throw new Error("No SMTP configuration found. Set SMTP_HOST/SMTP_USER/SMTP_PASS or SENDGRID_API_KEY in .env");
  }

  return nodemailer.createTransport(transporterConfig);
}

export async function sendResetEmail(toEmail, token) {
  const transporter = createTransporter();

  const resetUrl = `${BASE_URL}/api/sessions/reset-password?token=${token}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <p>Has solicitado restablecer tu contraseña. Haz click en el botón para continuar. El enlace expira en 1 hora.</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:4px">Restablecer contraseña</a></p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  `;

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Restablecer contraseña",
    html
  });

  return info;
}


// Envía SMS con Twilio con el enlace de restablecimiento
export async function sendResetSMS(toPhoneNumber, token) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_FROM) {
    throw new Error("Twilio no está configurado. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_FROM in .env");
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  const resetUrl = `${BASE_URL}/api/sessions/reset-password?token=${token}`;

  const message = await client.messages.create({
    body: `Restablecer contraseña: ${resetUrl}. El enlace expira en 1 hora.`,
    from: TWILIO_PHONE_FROM,
    to: toPhoneNumber
  });

  return message;
}


export default { sendResetEmail, sendResetSMS };

