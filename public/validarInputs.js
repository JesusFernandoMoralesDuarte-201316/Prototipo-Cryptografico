// Obtener referencias a los elementos
const fileInput = document.getElementById('fileInput');
const textArea = document.getElementById('contenidoEncriptar');
const submitButton = document.getElementById('btn');
const getMensaje = document.getElementById('getMensaje');
const KeyContent = document.getElementById('KeyContent');
const messageContent = document.getElementById('messageContent');

// Función para validar los inputs
function validateInputs() {
    const fileExists = fileInput.files.length > 0; // Verifica si hay un archivo
    const textExists = textArea.value.trim() !== ''; // Verifica si hay texto

    // Habilita o deshabilita el botón según la validación
    submitButton.disabled = !(fileExists && textExists);
}

function validateParagraphs() {
    const textExists1 = KeyContent.textContent.trim() !== ''; // Verifica si hay texto en el primer párrafo
    const textExists2 = messageContent.textContent.trim() !== ''; // Verifica si hay texto en el segundo párrafo

    // Habilita o deshabilita el botón según la validación
    getMensaje.disabled = !(textExists1 && textExists2);
}



// Agregar eventos para la validación
fileInput.addEventListener('change', validateInputs);
textArea.addEventListener('input', validateInputs);


getMensaje.addEventListener('click',()=>{
    EnviarMensajeEncrypt(KeyContent.textContent,messageContent.textContent)


})

async function EnviarMensajeEncrypt(key, mensaje) {
    const url = '/Encrypt2'; // Cambia esto por tu URL de API
    const parseMensaje = mensaje.toString();
    const parseKey = key.toString();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ parseMensaje, parseKey }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Procesa la respuesta como un blob para manejar el archivo ZIP
        const blob = await response.blob();

        // Crear un enlace para descargar el archivo
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = 'mensaje.zip'; // Nombre del archivo a descargar
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Liberar el objeto URL creado
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.error('Error al enviar datos:', error);
    }
}
