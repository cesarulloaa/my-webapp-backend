require('dotenv').config({path: './data.env'});
const express = require('express')
const cors = require('cors')
const fs = require('fs');
const nodemailer = require('nodemailer');
const { request } = require('http');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.CORREO,
        pass: process.env.PASS
    }
});





app.post('/api/contact', (req, res) => {
    // Logic to send email goes here
    const filePath = './contactos.csv';
    console.log(req.body)
    const dataToAppend = `${req.body.firstName},${req.body.lastName},${req.body.phone},${req.body.message}\n`;

    fs.appendFile(filePath, dataToAppend, async (err) => {
        if (err) {
            // Algo salió mal al guardar
            console.error('Error appending to file', err);
            return res.status(500).send('Error al guardar el mensaje');
        }
        console.log('Data appended to file successfully');
        try {
            await transporter.sendMail({
                from: process.env.CORREO,
                to: 'cesarsocorro20@gmail.com',
                text: `
                    Nombre: ${req.body.firstName} ${req.body.lastName}
                    Teléfono: ${req.body.phone}
                    subject: Nuevo mensaje de ${req.body.firstName} ${req.body.lastName},
                    Mensaje: ${req.body.message}
                `
                
            });
            return res.send('Mensaje guardado correctamente');
        } catch (emailErr) {
            // Todo salió bien
            console.error('Error enviando el correo:', emailErr);
            return res.status(500).send('El mensaje se guardó, pero ocurrió un error enviando el correo.');




        }
    });
})




app.listen(port, () => {
    console.log(`CORS-enabled web server listening on port ${port}`)
});
