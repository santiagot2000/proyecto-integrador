<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "contactos_db"; // ¡Asegúrate que este nombre sea CORRECTO!

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'] ?? '';
    $empresa = $_POST['empresa'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';
    
    // Validar los campos (opcional, pero recomendado)
    $sql = "INSERT INTO mensajes_contacto (nombre, empresa, email, telefono, mensaje) 
            VALUES (?, ?, ?, ?, ?)"; // También se eliminó 'NOW()' de los valores

    $stmt = $conn->prepare($sql);   

    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }

    // Unir los parámetros (solo los 5 que vas a insertar)
    $stmt->bind_param("sssss", $nombre, $empresa, $email, $telefono, $mensaje);

    if ($stmt->execute()) {
        echo "¡Gracias! Tu mensaje ha sido enviado exitosamente.";
    } else {
        echo "Lo sentimos, hubo un error al enviar tu mensaje: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Método de solicitud no permitido.";
}

$conn->close();
?>