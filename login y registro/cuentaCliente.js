import { Cuenta } from "./cuenta.js";

export class cuentaCliente extends Cuenta{
    constructor(usuario, id, correo, contraseña) {
        super(usuario, id, correo, contraseña, 'cliente');
    }
}