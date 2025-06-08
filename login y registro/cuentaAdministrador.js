import { Cuenta } from "./cuenta.js";

export class cuentaAdministrador extends Cuenta {
    constructor(usuario, id, correo, contraseña) {
        super(usuario, id, correo, contraseña, 'administrador');
    }
}