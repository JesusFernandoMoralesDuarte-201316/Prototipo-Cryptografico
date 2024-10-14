const textarea = document.querySelector('#contenidoEncriptar');
const btn = document.querySelector('#btn');


btn.addEventListener('click',async()=>{
    let mensaje = textarea.value;

    if(fileContent != 'NoContenido'){
        const result = await EnviarMensaje(mensaje,fileContent);
        MostrarTextosEncryptados(result);
        

    }
});

let fileContent = ""; // Variable para almacenar el contenido del archivo

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtener el primer archivo
    if (file) {
        const reader = new FileReader(); // Crear un FileReader
        reader.onload = function(e) {
            fileContent = e.target.result; // Guardar el contenido en la variable
        };
        reader.readAsText(file); // Leer el archivo como texto
    }

    else{
        fileContent = 'NoContenido'
    }
});


async function EnviarMensaje(mensaje,key) {
    const url = '/AES'; // Cambia esto por tu URL de API

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


function MostrarTextosEncryptados(textos) {
    const {KeyEncryptada,TextoEncryptado} =  textos;

    const messageContent = document.querySelector("#messageContent");
    const KeyContnet = document.querySelector("#KeyContent");

    messageContent.textContent = TextoEncryptado;
    KeyContnet.textContent = KeyEncryptada;
}