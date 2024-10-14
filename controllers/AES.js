import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Función para cifrar
export function encrypt(text, key) {
    // Crear un buffer para el IV
    const iv = randomBytes(16);
    // Crear un cifrador usando el algoritmo AES-256-CBC
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // Devuelve el IV junto con el texto cifrado (lo convertimos a hex para facilitar el manejo)
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Función para descifrar
function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

