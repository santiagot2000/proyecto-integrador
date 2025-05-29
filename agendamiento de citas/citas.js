// citas.js

// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const formCita = document.getElementById("form-cita");
    const fechaInput = document.getElementById("fecha");
    const horaInput = document.getElementById("hora");

    // Llenar las horas disponibles al cargar la página y cuando cambia la fecha
    // No llamamos directamente a 'mostrarHorariosDisponibles()' aquí.
    // En su lugar, cuando se elige una fecha, se dispara el 'change' event listener.
    // También la llamaremos al inicio si ya hay una fecha preseleccionada.
    if (fechaInput.value) {
        mostrarHorariosDisponibles();
    } else {
        // Establecer la fecha mínima de hoy
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        fechaInput.min = `${year}-${month}-${day}`;
    }


    // Manejar el envío del formulario
    formCita.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir el envío tradicional del formulario

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const fecha = fechaInput.value;
        const hora = horaInput.value; // Ya tiene el formato HH:MM o HH:MM:SS

        // Validar campos obligatorios
        if (!nombre || !email || !telefono || !fecha || !hora || hora === "No hay horarios disponibles") {
            alert("Todos los campos son obligatorios y debes seleccionar una hora válida.");
            return;
        }

        // Crear un objeto FormData para enviar los datos al script PHP
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('email', email);
        formData.append('telefono', telefono);
        formData.append('fecha', fecha);
        formData.append('hora', hora);

        try {
            // **IMPORTANTE**: Ajusta esta ruta a tu script PHP `agendar_cita.php`
            // Si tu estructura es `tu_proyecto/agendamiento de citas/citas.js` y `tu_proyecto/php/agendar_cita.php`
            // la ruta relativa sería `../php/agendar_cita.php`
            const response =await fetch('agendar_citas.php', { method: 'POST', body: formData });

            const result = await response.json(); // Esperar la respuesta JSON del servidor

            if (result.success) {
                alert('Cita agendada con éxito: ' + result.message);
                formCita.reset(); // Limpiar el formulario
                // Después de agendar, volver a cargar los horarios disponibles para la fecha actual
                mostrarHorariosDisponibles();
            } else {
                alert('Error al agendar la cita: ' + result.message);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Hubo un problema de conexión. Por favor, inténtalo de nuevo.');
        }
    });

    // Mostrar horarios disponibles cuando se elige una fecha
    fechaInput.addEventListener("change", mostrarHorariosDisponibles);

    // Esta función ahora hará una solicitud al servidor para obtener las citas existentes
    async function mostrarHorariosDisponibles() {
        const fechaSeleccionada = fechaInput.value;

        if (!fechaSeleccionada) {
            horaInput.innerHTML = '<option value="">Selecciona una fecha</option>';
            return;
        }

        const [año, mes, dia] = fechaSeleccionada.split("-");
        const fechaObj = new Date(año, mes - 1, dia); // Mes es 0-indexado
        const diaSemana = fechaObj.getDay(); // 0 = domingo, 6 = sábado

        let horasDisponiblesBase = [];

        if (diaSemana === 0) { // Domingo
            horasDisponiblesBase = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
        } else if (diaSemana === 6) { // Sábado
            horasDisponiblesBase = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
        } else { // Lunes a viernes
            horasDisponiblesBase = [
                "08:00", "09:00", "10:00", "11:00",
                "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
            ];
        }

        try {
            // **IMPORTANTE**: Ajusta esta ruta a tu nuevo script PHP `get_citas_por_fecha.php`
            // que crearemos a continuación.
            const response = await fetch(`get_citas_por_fecha.php?fecha=${fechaSeleccionada}`);
            const citasOcupadas = await response.json(); // Esperar la lista de horas ocupadas

            if (!citasOcupadas.success) {
                console.error("Error al obtener citas ocupadas:", citasOcupadas.message);
                // Si hay un error, mostrar todas las horas base y alertar al usuario.
                alert("No se pudieron cargar los horarios ocupados. Intentando con horarios generales.");
                renderHoras(horasDisponiblesBase);
                return;
            }

            // Filtrar las horas base para quitar las que ya están ocupadas
            const disponibles = horasDisponiblesBase.filter(horaBase => {
                // Comparamos solo la parte de la hora (HH:MM)
                return !citasOcupadas.data.some(cita => cita.hora.substring(0, 5) === horaBase);
            });

            renderHoras(disponibles);

        } catch (error) {
            console.error('Error al obtener horarios desde el servidor:', error);
            alert('Hubo un problema al cargar los horarios disponibles. Por favor, inténtalo de nuevo.');
            renderHoras(horasDisponiblesBase); // Mostrar horas base si hay un error de red
        }
    }

    // Función auxiliar para renderizar las opciones de hora en el select
    function renderHoras(horasParaMostrar) {
        horaInput.innerHTML = ""; // Limpiar opciones anteriores

        if (horasParaMostrar.length === 0) {
            const option = document.createElement("option");
            option.text = "No hay horarios disponibles";
            option.value = ""; // Valor vacío para que no sea una opción seleccionable para envío
            option.disabled = true;
            option.selected = true;
            horaInput.appendChild(option);
        } else {
             // Opción por defecto para seleccionar
            const defaultOption = document.createElement("option");
            defaultOption.text = "Selecciona una hora";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            horaInput.appendChild(defaultOption);

            horasParaMostrar.forEach(hora => {
                const option = document.createElement("option");
                option.value = hora + ':00'; // Añadir segundos para el formato DATETIME de MySQL (HH:MM:SS)
                option.text = hora;
                horaInput.appendChild(option);
            });
        }
    }

    // Función para el menú hamburguesa (del HTML original)
    function toggleMenu() {
        const menu = document.getElementById("menu");
        // Tu código original usaba style.display, pero tus clases CSS para dropdown
        // sugieren que podrías estar usando classList.toggle("show").
        // Asegúrate de que este toggle corresponda a tu CSS.
        menu.classList.toggle("show");
    }
    // Asegúrate de que esta función esté disponible globalmente si se llama desde el HTML
    window.toggleMenu = toggleMenu;
});
