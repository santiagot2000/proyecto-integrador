    import {
    cerrarSesion,
    registrarUsuario,
    cargarCuenta
    } from '../controladores/gestorUsuarios.js';

    import { obtenerUsuarioActivo } from '../controladores/gestorUsuarios.js';

    let cuentaActiva = null;

    // DOM
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const formCrearUsuario = document.getElementById('formCrearUsuario');
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const mensajeSistema = document.getElementById('mensajeSistema');

    // Mensajes
    function mostrarMensaje(msg, esError = false) {
    mensajeSistema.textContent = msg;
    mensajeSistema.classList.remove('oculto');
    mensajeSistema.style.color = esError ? 'red' : 'green';
    setTimeout(() => mensajeSistema.classList.add('oculto'), 4000);
    }

    // Mostrar usuarios desde localStorage
    function mostrarUsuarios() {
    tablaUsuarios.innerHTML = '';
    for (let clave in localStorage) {
        if (clave.startsWith('cuenta_')) {
        const obj = JSON.parse(localStorage.getItem(clave));
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${obj.usuario}</td>
            <td>${obj.id}</td>
            <td>${obj.correo}</td>
            <td>${obj.tipoCuenta}</td>
            <td>
            <button class="btn-editar" data-user="${obj.usuario}">✏️</button>
            <button class="btn-eliminar" data-user="${obj.usuario}">🗑️</button>
            </td>
        `;
        tablaUsuarios.appendChild(fila);
        }
    }
    }

    // Crear nuevo usuario
    formCrearUsuario.addEventListener('submit', e => {
    e.preventDefault();
    const usuario = document.getElementById('usuarioNuevo').value.trim();
    const id = document.getElementById('idNuevo').value.trim();
    const correo = document.getElementById('correoNuevo').value.trim();
    const contraseña = document.getElementById('passwordNuevo').value.trim();
    const tipoCuenta = document.getElementById('tipoCuentaNuevo').value;

    const resultado = registrarUsuario(usuario, id, correo, contraseña, contraseña, tipoCuenta);
    if (resultado === 'Usuario registrado exitosamente') {
        mostrarMensaje('Usuario creado correctamente');
        formCrearUsuario.reset();
        mostrarUsuarios();
    } else {
        mostrarMensaje(resultado, true);
    }
    });

    // Eliminar usuario
    tablaUsuarios.addEventListener('click', e => {
    if (e.target.classList.contains('btn-eliminar')) {
        const usuario = e.target.dataset.user;
        if (confirm(`¿Eliminar al usuario ${usuario}?`)) {
        localStorage.removeItem(`cuenta_${usuario}`);
        mostrarUsuarios();
        mostrarMensaje('Usuario eliminado');
        }
    }
    });

    // (Opcional) Editar usuario
    tablaUsuarios.addEventListener('click', e => {
    if (e.target.classList.contains('btn-editar')) {
        const usuario = e.target.dataset.user;
        alert(`Funcionalidad de edición aún no implementada para: ${usuario}`);
        // Aquí podrías abrir un modal con los datos del usuario para editar
    }
    });

    // Cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    cerrarSesion();
    window.location.replace('../vistaPublica/index.html');
    });

    // Inicialización
    window.addEventListener('load', () => {
    const activo = obtenerUsuarioActivo();
    if (activo) {
        cuentaActiva = cargarCuenta(activo);
        nombreUsuarioSpan.textContent = cuentaActiva.usuario;
        mostrarUsuarios();
    } else {
        window.location.replace('../vistaPublica/index.html');
    }
    });
