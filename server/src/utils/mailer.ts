import dotenv from 'dotenv'
import { transporter } from '~/config/mailTransporter'

dotenv.config

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: 'Reset Password',
    html: `
      <p>Hello ><!</p>

      <p>You are trying to verify your email address. Verfify token is: <strong>${token}</strong>.</p>
      
      <p>Please complete confirmation within 90 seconds.</p>

      <p>Thanks,</p>
    `
  }

  await transporter.sendMail(mailOptions)
}
