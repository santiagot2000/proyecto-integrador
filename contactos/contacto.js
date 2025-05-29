function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
// contacto.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar el botón de envío, no la tabla.
    // La tabla tiene inputs, pero el evento submit debería escucharse en el formulario si lo hubiera,
    // o en el clic del botón que actúa como submit y recolectar los valores manualmente.
    // Tu HTML de contacto usa una tabla con inputs y un <input type="submit">.
    // Vamos a buscar el botón y los inputs directamente.

    const botonEnviar = document.querySelector('.botonenviar');

    if (botonEnviar) {
        botonEnviar.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevenir el envío tradicional del formulario

            // Recolectar los datos de los inputs de la tabla
            // Asumo que los inputs están en el orden que aparecen en el HTML: Nombre, Empresa, Email, Teléfono, Mensaje
            const inputs = document.querySelectorAll('.tabla input, .tabla textarea');
            const nombre = inputs[0].value;
            const empresa = inputs[1].value;
            const email = inputs[2].value;
            const telefono = inputs[3].value;
            const mensaje = inputs[4].value; // El textarea es el quinto elemento

            // Crear un objeto FormData
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('empresa', empresa); // Asumo que "Empresa" va al campo 'apellido' en la DB por ahora
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('mensaje', mensaje);

            try {
                // Enviar los datos al script PHP
                // Ajusta la ruta a 'guardar_contacto.php' según tu estructura de carpetas.
                // Si contacto.html está en 'tu_proyecto/contactos/' y guardar_contacto.php en 'tu_proyecto/php/',
                // la ruta relativa podría ser '../php/guardar_contacto.php'.
                const response = await fetch('../php/guardar_contacto.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                    // Limpiar los campos después de un envío exitoso
                    inputs.forEach(input => input.value = '');
                } else {
                    alert('Error al enviar el mensaje: ' + result.message);
                }
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                alert('Hubo un problema de conexión. Por favor, inténtalo de nuevo.');
            }
        });
    }
});

// Función para el menú hamburguesa (del HTML original)
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("show");
}