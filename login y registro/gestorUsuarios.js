import { Cuenta } from "./cuenta.js";
import { cuentaCliente } from "./cuentaCliente.js";
import { cuentaAdministrador } from "./cuentaAdministrador.js";

export function cargarCuenta(usuario){
    const clave = `cuenta_${usuario}`;
        const datos = localStorage.getItem(clave);
        if (!datos) return null;

        const obj = JSON.parse(datos);
        
        let cuenta;
        if (obj.tipoCuenta === 'cliente'){
            cuenta = new cuentaCliente(obj.usuario, obj.id, obj.correo, obj.contraseña);
        } else if (obj.tipoCuenta === 'administrador'){
            cuenta = new cuentaAdministrador(obj.usuario, obj.id, obj.correo, obj.contraseña);
        }else{
            cuenta = new Cuenta(obj.usuario, obj.id, obj.correo, obj.contraseña, obj.tipoCuenta)
        }

        return cuenta;
}

// Registro
export function registrarUsuario(usuario, id, correo, contraseña,contraseñaConfirmar, tipoCuenta) {
    if (cargarCuenta(usuario)) {
        return 'Usuario ya existe';
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
        return "Correo electrónico inválido.";
    }
    if (!/^\d{4}$/.test(contraseña)) {
        return "La contraseña debe ser numérica y tener 4 dígitos.";
    }
    if (contraseña !== contraseñaConfirmar) {
        return "Las contraseñas no coinciden.";
    }
    
    let nuevaCuenta;
    if (tipoCuenta === 'cliente'){
        nuevaCuenta = new cuentaCliente(usuario, id, correo, contraseña);
    } else if (tipoCuenta === 'administrador'){
        nuevaCuenta = new cuentaAdministrador(usuario, id, correo, contraseña);
    } else {
        return 'tipo de cuenta no valido';
    }

    nuevaCuenta.guardarCuenta();
    return 'Usuario registrado exitosamente';
}

// Inicio de sesión
export function iniciarSesion(usuario, contraseña) {
    const cuenta = cargarCuenta(usuario);
    if (!cuenta) return 'Usuario no encontrado';
    if (cuenta.contraseña !== contraseña) return 'Contraseña incorrecta';

    sessionStorage.setItem('usuarioActivo', usuario);
    return 'Login exitoso';
}

// Cerrar sesión
export function cerrarSesion() {
    sessionStorage.removeItem('usuarioActivo');
    // Opcional: redirigir o actualizar interfaz
}

// Función para obtener usuario logueado
export function obtenerUsuarioActivo() {
    return sessionStorage.getItem('usuarioActivo');
}