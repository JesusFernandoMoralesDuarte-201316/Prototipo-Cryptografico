import { generateKeyPairSync, publicEncrypt, privateDecrypt, constants } from 'crypto';

// Generación de claves RSA
export function generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048, // Longitud de la clave en bits
        publicKeyEncoding: {
            type: 'spki', // Estándar de codificación de claves públicas
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8', // Estándar de codificación de claves privadas
            format: 'pem'
        }
    });

    return { publicKey, privateKey };
}

// Función para cifrar con la clave pública
export function encryptWithPublicKey(publicKey, data) {
    const encryptedData = publicEncrypt(
        {
            key: publicKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(data)
    );
    return encryptedData.toString('base64');
}

// Función para descifrar con la clave privada
export function decryptWithPrivateKey(privateKey, encryptedData) {
    const decryptedData = privateDecrypt(
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(encryptedData, 'base64')
    );
    return decryptedData.toString();
}

