import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  //Credenciales
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Enviar Email
  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "¿Olvidaste tu Password?",
    text: "¿Olvidaste tu Password?",
    html: `
        <p>Hola: ${nombre}, reestablece tu password en APV.</p>

        <p>Para poder reestablecer tu password, sigue el siguien enlace: 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;