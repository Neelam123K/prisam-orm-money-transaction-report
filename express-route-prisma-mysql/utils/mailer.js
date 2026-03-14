const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendResetEmail = async (to, resetLink) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL, 
      to,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    });

    console.log("Reset email sent");
  } catch (error) {
    console.error(" Resend email error:", error);
    throw error;
  }
};
