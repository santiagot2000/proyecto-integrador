<?php
// guardar_contacto.php

// Incluir el archivo de conexión a la base de datos
require_once 'db_connect.php';

// Establecer el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Obtener y sanear los datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $empresa = $_POST['empresa'] ?? ''; // Asumo que el campo "Empresa" del formulario es el "apellido" o un campo adicional en Contactos
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // 2. Validación básica de los datos
    // Requiere al menos nombre y email
    if (empty($nombre) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Por favor, completa al menos el nombre y el email.']);
        $conn->close();
        exit;
    }

    // Validación de formato de email simple
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'El formato del email no es válido.']);
        $conn->close();
        exit;
    }

    // 3. Insertar el contacto en la base de datos
    // Usamos INSERT ... ON DUPLICATE KEY UPDATE para evitar duplicados por email
    // Si el email ya existe, actualiza el nombre, telefono y mensaje. Si no existe, lo inserta.
    $stmt = $conn->prepare("INSERT INTO Contactos (nombre, apellido, email, telefono, mensaje) VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), apellido = VALUES(apellido), telefono = VALUES(telefono), mensaje = VALUES(mensaje)");
    // Puedes decidir si "Empresa" debe ir en "apellido" o crear una columna aparte en la tabla Contactos.
    // Para este ejemplo, estoy asumiendo que "Empresa" se guardaría en el campo 'apellido'.
    // Si prefieres una columna 'empresa' en la tabla Contactos, deberás modificar la tabla y el SQL.
    $stmt->bind_param("sssss", $nombre, $empresa, $email, $telefono, $mensaje);


    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Tu mensaje ha sido enviado y tus datos guardados con éxito.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar el contacto: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} else {
    // Si no es una solicitud POST
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no permitido.']);
}
?>