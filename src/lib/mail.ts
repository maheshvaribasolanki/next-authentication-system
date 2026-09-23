import nodemailer from "nodemailer";

const smtpPort = Number(
  process.env.SMTP_PORT || 587
);

const transporter =
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

export async function sendOTPEmail(
  email: string,
  otp: string
) {
  await transporter.sendMail({
    from: `"Auth App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your verification code",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
        "
      >
        <h2>Email Verification</h2>

        <p>
          Thank you for creating an account.
        </p>

        <p>
          Your verification code is:
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 25px 0;
          "
        >
          ${otp}
        </div>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request this code,
          you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendResetPasswordEmail(
  email: string,
  resetUrl: string
) {
  await transporter.sendMail({
    from: `"Auth App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
        "
      >
        <h2>Password Reset</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: black;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 20px;">
          This link will expire in 15 minutes.
        </p>
      </div>
    `,
  });
}