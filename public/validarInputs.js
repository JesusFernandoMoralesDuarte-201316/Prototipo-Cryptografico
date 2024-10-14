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
KeyContent.addEventListener('input', validateParagraphs);
messageContent.addEventListener('input', validateParagraphs);


// Agregar eventos para la validación
fileInput.addEventListener('change', validateInputs);
textArea.addEventListener('input', validateInputs);


getMensaje.addEventListener('click',()=>{
    EnviarMensajeEncrypt(KeyContent,messageContent)
})

async function EnviarMensajeEncrypt(key,mensaje) {
    const url = '/Encrypt2'; // Cambia esto por tu URL de API

    try {
        const response = await fetch(url, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json' // Indica que estás enviando JSON
            },
            body: JSON.stringify({ mensaje , key }) // Asegúrate de que estás enviando como un objeto
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const result = await response.json(); // Procesa la respuesta JSON
        return result;
    } catch (error) {
        console.error('Error al enviar datos:', error);
    }
}