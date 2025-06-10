<?php
$servername = "localhost";
$username = "root"; // Usuario por defecto en XAMPP
$password = ""; // Contraseña por defecto en XAMPP (vacía)
$dbname = "contactos_db";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Recibir datos del formulario
$nombre = $_POST['nombre'];
$empresa = $_POST['empresa'];
$email = $_POST['email'];
$telefono = $_POST['telefono'];
$mensaje = $_POST['mensaje'];

// Preparar la inserción de datos
$sql = "INSERT INTO mensajes_contacto (nombre, empresa, email, telefono, mensaje, fecha_envio) 
        VALUES ('$nombre', '$empresa', '$email', '$telefono', '$mensaje', NOW())";

if ($conn->query($sql) === TRUE) {
    echo "Mensaje guardado correctamente.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>