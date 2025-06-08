
export class Cuenta {
    constructor (usuario, id, correo, contraseña, tipoCuenta){
        this.usuario = usuario;
        this.id = id;
        this.correo = correo;
        this.contraseña = contraseña;
        this.tipoCuenta = tipoCuenta;
    }

    //Guardar en la cuenta
    guardarCuenta(){
        const clave = `cuenta_${this.usuario}`;
        localStorage.setItem(clave, JSON.stringify(this));
    }


}