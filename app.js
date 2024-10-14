import express from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { generateKeyPair, encryptWithPublicKey } from './controllers/RSA.js';
import { encrypt } from './controllers/AES.js';
import { randomBytes } from 'crypto';

const app = express();
const PORT = 3001;

// Obtener la ruta del directorio actual (necesario para trabajar con ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get('/keys',(req,res)=>{
    const { publicKey, privateKey } = generateKeyPair();

    // Ruta donde se guardarán los archivos temporalmente
    const publicKeyPath = path.join(process.cwd(), 'publicKey.txt');
    const privateKeyPath = path.join(process.cwd(), 'privateKey.txt');

    // Guardar las claves en archivos
    fs.writeFile(publicKeyPath, publicKey, (err) => {
        if (err) {
            return res.status(500).send('Error al guardar la clave pública.');
        }

        fs.writeFile(privateKeyPath, privateKey, (err) => {
            if (err) {
                return res.status(500).send('Error al guardar la clave privada.');
            }

            // Crear un archivo zip
            res.attachment('keys.zip');
            const archive = archiver('zip');

            // Pipe archive data to the response
            archive.pipe(res);

            // Agregar los archivos al archivo zip
            archive.file(publicKeyPath, { name: 'publicKey.txt' });
            archive.file(privateKeyPath, { name: 'privateKey.txt' });

            // Finalizar el archivo zip
            archive.finalize();

            // Eliminar archivos después de haber sido enviados
            archive.on('finish', () => {
                fs.unlink(publicKeyPath, () => {});
                fs.unlink(privateKeyPath, () => {});
            });
        });
    });
});

app.get('/encriptar',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'encriptar.html')); 
})


app.post('/AES',(req, res) => {
    const keyL = randomBytes(32);
    const {mensaje,key} =  req.body; // Aquí deberías poder acceder al cuerpo de la solicitud
    
    let contenidoEncriptado = encrypt(mensaje,keyL); // Esto debería mostrar el objeto enviado
    console.log(contenidoEncriptado);
    
    
    let keyEncrypt = encryptWithPublicKey(key,keyL);
    console.log(keyEncrypt)
    res.status(200).send({ TextoEncryptado: contenidoEncriptado, KeyEncryptada: keyEncrypt });
});

app.post('/Encrypt2',(req,res)=>{
    const {mensaje,key} = res.body
     // Ruta donde se guardarán los archivos temporalmente
     const mensajePath = path.join(process.cwd(), 'publicKey.txt');
     const KeyPath = path.join(process.cwd(), 'privateKey.txt');
 
     // Guardar las claves en archivos
     fs.writeFile(mensajePath, mensaje, (err) => {
         if (err) {
             return res.status(500).send('Error al guardar el mensaje.');
         }
 
         fs.writeFile(privateKeyPath, privateKey, (err) => {
             if (err) {
                 return res.status(500).send('Error al guardar la clave privada.');
             }
 
             // Crear un archivo zip
             res.attachment('keys.zip');
             const archive = archiver('zip');
 
             // Pipe archive data to the response
             archive.pipe(res);
 
             // Agregar los archivos al archivo zip
             archive.file(publicKeyPath, { name: 'publicKey.txt' });
             archive.file(privateKeyPath, { name: 'privateKey.txt' });
 
             // Finalizar el archivo zip
             archive.finalize();
 
             // Eliminar archivos después de haber sido enviados
             archive.on('finish', () => {
                 fs.unlink(publicKeyPath, () => {});
                 fs.unlink(privateKeyPath, () => {});
             });
         });
     });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});