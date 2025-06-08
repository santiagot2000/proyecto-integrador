const form = document.getElementById("form-cita");
const servicioInput = document.getElementById("servicio");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const servicio = servicioInput.value;
  const fecha = fechaInput.value;
  const hora = horaInput.value;

  if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const nuevaCita = { nombre, email, telefono, servicio, fecha, hora };
  const citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

  // Validar si ya hay una cita en la misma fecha y hora
  const duplicada = citasGuardadas.some(
    (cita) => cita.fecha === fecha && cita.hora === hora
  );

  if (duplicada) {
    alert("Ya existe una cita en esa fecha y hora.");
    return;
  }

  // Guardar nueva cita
  citasGuardadas.push(nuevaCita);
  localStorage.setItem("citas", JSON.stringify(citasGuardadas));

  alert("Cita agendada con éxito.");
  form.reset();
  mostrarHorariosDisponibles(); // Actualizar horarios después de agendar
});

// Mostrar horarios disponibles cuando se elige una fecha
fechaInput.addEventListener("change", mostrarHorariosDisponibles);

function mostrarHorariosDisponibles() {
  const fechaSeleccionada = fechaInput.value;
  const [año, mes, dia] = fechaSeleccionada.split("-");
  const fecha = new Date(año, mes - 1, dia);
  const diaSemana = fecha.getDay(); // 0 = domingo, 6 = sábado

  let horaDisponible = [];

  if (diaSemana === 0) {
    // Domingo
    horaDisponible = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
  } else if (diaSemana === 6) {
    // Sábado
    horaDisponible = ["08:00","09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  } else {
    // Lunes a viernes
    horaDisponible = [
      "08:00","09:00", "10:00", "11:00",
      "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
    ];
  }

  const citas = JSON.parse(localStorage.getItem("citas")) || [];
  const ocupadas = citas
    .filter(cita => cita.fecha === fechaSeleccionada)
    .map(cita => cita.hora);

  const disponibles = horaDisponible.filter(hora => !ocupadas.includes(hora));

  // Rellenar el selector de hora
  horaInput.innerHTML = "";

  if (disponibles.length === 0) {
    const option = document.createElement("option");
    option.text = "No hay horarios disponibles";
    option.disabled = true;
    option.selected = true;
    horaInput.appendChild(option);
  } else {
    disponibles.forEach(hora => {
      const option = document.createElement("option");
      option.value = hora;
      option.text = hora;
      horaInput.appendChild(option);
    });
  }
}



function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
