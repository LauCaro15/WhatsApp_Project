require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmailConfirmationHTML(customerName, orderNro) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div class="contanier section">
      <label>Paisaje</label>
      <div>
        <img src="https://asset1.zankyou.com/images/mag-post/816/336b/685//-/co/wp-content/uploads/2017/05/Ca%C3%B1o-Cristales-Kirill-Trubitsyn.jpg" width="400px">
      </div>
    </div>
  </body>
  </html>`;
}

function getMessage(emailParams) {
  return {
    to: emailParams.toEmail,
    from: 'laurac.candamilc@autonoma.edu.co',
    subject: 'Envio de Correo Practica SendGrid',
    text: `Hola ${emailParams.customerName}, te enviamos las imagenes de los productos comprados y la factura con el número ${emailParams.orderNro}. Gracias por tu compra`,
    html: sendEmailConfirmationHTML(
      emailParams.customerName,
      emailParams.orderNro
    ),
  };
}

async function sendOrder(emailParams) {
  try {
    await sgMail.send(getMessage(emailParams));
    return { message: 'Confirmación de compra enviada' };
  } catch (err) {
    const message = 'No se pudo enviar la orden de compra. Valide los errores';
    console.error(message);
    console.error(err);
    if (err.response) console.error(err.response.body);
    return { message };
  }
}

module.exports = {
  sendOrder,
};