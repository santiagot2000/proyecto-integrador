
import {cerrarSesion, iniciarSesion, obtenerUsuarioActivo, registrarUsuario, cargarCuenta } from './gestorUsuarios.js';

let cuentaActiva = null;

// Referencias DOM
const seccionLogin = document.getElementById('seccionLogin');
const seccionRegistro = document.getElementById('seccionRegistro');
/* const seccionCambioPassword = document.getElementById('seccionCambioPassword'); */
const mensajeSistema = document.getElementById('mensajeSistema');

const nombreUsuarioSpan = document.getElementById('nombreUsuario');

// Función para mostrar mensaje en pantalla
function mostrarMensaje(texto, esError = false) {
    mensajeSistema.textContent = texto;
    mensajeSistema.classList.remove('oculto');
    mensajeSistema.style.color = esError ? 'red' : 'green';
    setTimeout(() => {
        mensajeSistema.classList.add('oculto');
    }, 4000);
}

// Función para mostrar una sección y ocultar las demás
function mostrarSeccion(seccion) {
    const secciones = [
        seccionLogin,
        seccionRegistro,
    ];
    secciones.forEach(sec => {
        if (!sec) return;
        if (sec === seccion) sec.classList.remove('oculto');
        else sec.classList.add('oculto');
    });
}

// Actualizar datos de usuario en menú principal
function actualizarDatosUsuario() {
    if (!cuentaActiva) return;
    if (nombreUsuarioSpan){
        nombreUsuarioSpan.textContent = cuentaActiva.usuario;
    }
    
}

// Manejar formulario login
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', e => {
        e.preventDefault();
        const usuario = document.getElementById('usuarioLogin').value.trim();
        const contraseña = document.getElementById('passwordLogin').value.trim();

        const resultado = iniciarSesion(usuario, contraseña);
        if (resultado === 'Login exitoso') {
            cuentaActiva = cargarCuenta(usuario);
            actualizarDatosUsuario();
            mostrarMensaje('Bienvenido ' + usuario);
            e.target.reset();
            if (cuentaActiva.tipoCuenta == 'cliente'){
                window.location.replace('../vistaCliente/index.html')
            } else {
                window.location.replace('../vistaAdministrador/index.html')
            }
        } else {
            mostrarMensaje(resultado, true);
        }
    });
}

// Botón para mostrar registro
const btnMostrarRegistro = document.getElementById('btnMostrarRegistro');
if (btnMostrarRegistro) {
    btnMostrarRegistro.addEventListener('click', () => {
        mostrarSeccion(seccionRegistro);
    });
}

// Botón para volver a login desde registro
const btnRegresarLogin = document.getElementById('btnRegresarLogin');
if (btnRegresarLogin) {
    btnRegresarLogin.addEventListener('click', () => {
        mostrarSeccion(seccionLogin);
    });
}

// Manejar formulario registro
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
    formRegistro.addEventListener('submit', e => {
        e.preventDefault();
        const usuario = document.getElementById('usuarioRegistro').value.trim();
        const id = document.getElementById('idRegistro').value.trim();
        const correo = document.getElementById('correoRegistro').value.trim();
        const contraseña = document.getElementById('passwordRegistro').value.trim();
        const contraseñaConfirmar = document.getElementById('passwordConfirmacion').value.trim();
        const tipoCuentaRadio = document.querySelector('input[name="tipoCuenta"]:checked');
        if (!tipoCuentaRadio) {
            mostrarMensaje('Seleccione un tipo de cuenta', true);
            return;
        }
        const tipoCuenta = tipoCuentaRadio.value;

        const resultado = registrarUsuario(usuario, id, correo, contraseña, contraseñaConfirmar, tipoCuenta);
        if (resultado === 'Usuario registrado exitosamente') {
            mostrarMensaje('Registro exitoso, ya puede iniciar sesión');
            mostrarSeccion(seccionLogin);
            e.target.reset();
        } else {
            mostrarMensaje(resultado, true);
        }
    });
}


// Botón cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    cerrarSesion();
    cuentaActiva = null;
    window.location.replace('../../vistaPublica/index.html')
});

// Formularios acciones

// Al cargar la página, si hay usuario activo, cargar su cuenta y mostrar menú principal
window.addEventListener('load', () => {
    const usuarioActivo = obtenerUsuarioActivo();
    if (usuarioActivo) {
        cuentaActiva = cargarCuenta(usuarioActivo);
        actualizarDatosUsuario();
        
    } else {
        mostrarSeccion(seccionLogin);
    }
});



