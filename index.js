require('dotenv').config();
/* Configurar listening del puerto para ver el proyecto en un navegador */
const express = require('express');
const port = 3000 || process.env.PORT;
/* Librerías de SendGrid para envio de correos electrónicos */
const email = require('./src/email');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/* Librerias de Twilio para envio de mensajes de texto */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
/* Para realizar pruebas con Postman */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* Creación de la Ruta del Proyecto */
/* Endpoint: http://localhost:3000 */
app.get('/', (req, res) => {
  res.json({ message: 'Success' });
});
/* Para poder ver la ruta en el navegador, se activa el listen() */
app.listen(port, () => {
  console.log(`Accede al sitio web dando click aquí: http://localhost:${port}`);
});

app.post('/api/email/confirmation', async (req, res, next) => {
  /* Llamamos función que estara en la clase email.js y que requiere de unos parametros que ingresan por Postman */
  try {
    res.json(await email.sendOrder(req.body));
  } catch (err) {
    next(err);
  }
});
/* Validar el código que nos devuelve la ejecución del código, en caso de error mostrar todo el contenido del error */
app.use((err, req, res, next) => {
  /* 100 => Informativo */
  /* 200 => No es un error, es un status success */
  /* 300 => No está disponible el recurso */
  /* 400 => No se encuentra el URI */
  /* 500 => Error del servidor */
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: error.message });
  return;
});
function getMessage() {
  const body = 'Mensaje enviado el 09/04/2022 05:00:00 p.m';
  return {
    to: 'lccandamil@gmail.com',
    from: 'laurac.candamilc@autonoma.edu.co',
    subject: 'Prueba SendGrid Ingeniería de Software',
    text: body,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div class="contanier section">
        <label><strong>Paisaje</strong></label>
        <img src="https://asset1.zankyou.com/images/mag-post/816/336b/685//-/co/wp-content/uploads/2017/05/Ca%C3%B1o-Cristales-Kirill-Trubitsyn.jpg" width="400px">
      </div>
    </body>
    </html>`,
  };
}
async function sendEmail() {
  try {
    await sgMail.send(getMessage());
    console.log('Correo ha sido enviado');
  } catch (err) {
    console.error('No se pudo enviar el mensaje');
    console.error(err);
    if (err.response) console.error(err.response.body);
  }
}
async () => {
  console.log('Enviando correo electronico');
  await sendEmail();
};
/* #################### TWILIO #################### */
/* #################### Mensaje por SMS #################### */
client.messages
  .create({
    body: 'Prueba de Twilio por SMS. Grupo Ing de Software miercoles en la mañana',
    from: '+15706309821',
    to: '+573105958276',
  })
  .then((message) => console.log(`Mensaje Enviado por SMS ${message.sid}`));

/* #################### Mensaje por WhatsApp #################### */
client.messages
  .create({
    body: 'Prueba de Twilio por WhatsApp. Grupo Ing de Software miercoles en la mañana',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+573105958276',
  })
  .then((message) =>
    console.log(`Mensaje Enviado por WhatsApp ${message.sid}`)
  );