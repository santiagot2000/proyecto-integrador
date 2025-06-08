document.addEventListener("DOMContentLoaded", () => {
  const citas = JSON.parse(localStorage.getItem("citas")) || [];
  citas.sort((a, b) => {
    const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
    const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
    return fechaHoraA - fechaHoraB;
  });

  const lista = document.getElementById("lista-citas");

  if (citas.length === 0) {
    lista.innerHTML = "<li>No hay citas registradas.</li>";
  } else {
    const citasPorFecha = {};
    citas.forEach((cita, index) => {
      const claveFecha = cita.fecha;
      if (!citasPorFecha[claveFecha]) {
        citasPorFecha[claveFecha] = [];
      }
      citasPorFecha[claveFecha].push({ ...cita, index });
    });

    const fechasOrdenadas = Object.keys(citasPorFecha).sort();

    fechasOrdenadas.forEach(fecha => {
      const grupo = citasPorFecha[fecha];
      grupo.sort((a, b) => new Date(`1970-01-01T${a.hora}`) - new Date(`1970-01-01T${b.hora}`));

      const header = document.createElement("h3");
      header.textContent = `📅 ${fecha}`;
      lista.appendChild(header);

      grupo.forEach(cita => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${cita.nombre} - ${cita.email} - ${cita.telefono} - ${cita.servicio} - ${cita.hora}
          <button class="boton editar" data-index="${cita.index}">Editar</button>
          <button class="boton eliminar" data-index="${cita.index}">Eliminar</button>
        `;
        lista.appendChild(li);
      });
    });
  }

  // Insertar modal
  const modalHTML = `
    <div id="modal-editar" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:10000;">
      <div style="background:white; padding:20px; border-radius:10px; width:700px;">
        <h2 style="color:mediumblue;">Editar Cita</h2>
        <form id="form-editar">
          <label>Nombre:<input type="text" id="editar-nombre" required></label>
          <label>Email:<input type="email" id="editar-email" required></label>
          <label>Teléfono:<input type="text" id="editar-telefono" required></label>
          <label>
            <p>Tipo de servicio:</p>
            <select id="editar-servicio" required>
              <option value="">Selecciona un servicio</option>
              <option value="Arañas">Arañas</option>
              <option value="Chinches">Chinches</option>
              <option value="Cucarachas">Cucarachas</option>
              <option value="Garrapatas">Garrapatas</option>
              <option value="Hormigas">Hormigas</option>
              <option value="Moscas">Moscas</option>
              <option value="Mosquitos">Mosquitos</option>
              <option value="Pulgas">Pulgas</option>
              <option value="Ratones">Ratones</option>
            </select>
          </label>
          <label>Fecha:<input type="date" id="editar-fecha" required></label>
          <label>Hora:<select id="editar-hora"></select></label>
          <button type="submit" class="boton">Guardar</button>
          <button type="button" id="cerrar-modal" class="boton" style="background:red;">Cancelar</button>
        </form>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("modal-editar");
  const formEditar = document.getElementById("form-editar");
  const nombreInput = document.getElementById("editar-nombre");
  const emailInput = document.getElementById("editar-email");
  const telefonoInput = document.getElementById("editar-telefono");
  const servicioInput = document.getElementById("editar-servicio");
  const fechaInput = document.getElementById("editar-fecha");
  const horaSelect = document.getElementById("editar-hora");
  const cerrarModal = document.getElementById("cerrar-modal");

  let citaActualIndex = null;

  document.querySelectorAll(".editar").forEach(btn =>
    btn.addEventListener("click", () => {
      citaActualIndex = parseInt(btn.dataset.index);
      const cita = citas[citaActualIndex];
      nombreInput.value = cita.nombre;
      emailInput.value = cita.email;
      telefonoInput.value = cita.telefono;
      servicioInput.value = cita.servicio;
      fechaInput.value = cita.fecha;
      mostrarHorariosDisponibles(cita.fecha, cita.hora);
      modal.style.display = "flex";
    })
  );

  document.querySelectorAll(".eliminar").forEach(btn =>
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (confirm("¿Estás seguro de eliminar esta cita?")) {
        citas.splice(index, 1);
        localStorage.setItem("citas", JSON.stringify(citas));
        location.reload();
      }
    })
  );

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  fechaInput.addEventListener("change", () => {
    mostrarHorariosDisponibles(fechaInput.value);
  });

  formEditar.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const servicio = servicioInput.value;
    const fecha = fechaInput.value;
    const hora = horaSelect.value;

    if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const conflicto = citas.some((c, i) =>
      i !== citaActualIndex && c.fecha === fecha && c.hora === hora
    );

    if (conflicto) {
      alert("Ya hay una cita en esa fecha y hora.");
      return;
    }

    citas[citaActualIndex] = { nombre, email, telefono, servicio, fecha, hora };
    localStorage.setItem("citas", JSON.stringify(citas));
    modal.style.display = "none";
    location.reload();
  });

  function mostrarHorariosDisponibles(fechaSeleccionada, horaActual = "") {
    const [año, mes, dia] = fechaSeleccionada.split("-");
    const fecha = new Date(año, mes - 1, dia);
    const diaSemana = fecha.getDay(); // 0 = domingo

    let horarios = [];

    if (diaSemana === 0) {
      // Domingo
      horarios = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
    } else if (diaSemana === 6) {
      // Sábado
      horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
    } else {
      // Lunes a viernes
      horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    }


    const ocupadas = citas
      .filter((c, i) => i !== citaActualIndex && c.fecha === fechaSeleccionada)
      .map(c => c.hora);

    const disponibles = horarios.filter(h => h === horaActual || !ocupadas.includes(h));

    horaSelect.innerHTML = "";

    if (disponibles.length === 0) {
      const option = document.createElement("option");
      option.text = "No hay horarios disponibles";
      option.disabled = true;
      option.selected = true;
      horaSelect.appendChild(option);
    } else {
      disponibles.forEach(h => {
        const option = document.createElement("option");
        option.value = h;
        option.textContent = h;
        if (h === horaActual) option.selected = true;
        horaSelect.appendChild(option);
      });
    }
  }
});

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

