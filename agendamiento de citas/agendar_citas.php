<?php
// agendar_cita.php

// Incluir el archivo de conexión a la base de datos
require_once 'db_connect.php';

// Establecer el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Obtener y sanear los datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $fecha = $_POST['fecha'] ?? '';
    $hora = $_POST['hora'] ?? '';

    // Combinar fecha y hora para el formato DATETIME de MySQL
    $fecha_hora_cita = $fecha . ' ' . $hora;

    // 2. Validación básica de los datos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($fecha) || empty($hora)) {
        echo json_encode(['success' => false, 'message' => 'Por favor, completa todos los campos requeridos.']);
        $conn->close();
        exit;
    }

    // Validación de formato de email simple
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'El formato del email no es válido.']);
        $conn->close();
        exit;
    }

    // 3. Insertar o encontrar el contacto
    // Primero, intenta encontrar si el contacto ya existe por email
    $stmt = $conn->prepare("SELECT id_contacto FROM Contactos WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $contacto = $result->fetch_assoc();
    $stmt->close();

    $id_contacto = null;

    if ($contacto) {
        // Si el contacto existe, usa su ID
        $id_contacto = $contacto['id_contacto'];
        // Opcional: Actualizar nombre y teléfono si han cambiado
        $stmt_update = $conn->prepare("UPDATE Contactos SET nombre = ?, telefono = ? WHERE id_contacto = ?");
        $stmt_update->bind_param("ssi", $nombre, $telefono, $id_contacto);
        $stmt_update->execute();
        $stmt_update->close();
    } else {
        // Si el contacto no existe, inserta uno nuevo
        $stmt = $conn->prepare("INSERT INTO Contactos (nombre, email, telefono) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $email, $telefono);

        if ($stmt->execute()) {
            $id_contacto = $conn->insert_id; // Obtener el ID del contacto recién insertado
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar el contacto: ' . $stmt->error]);
            $stmt->close();
            $conn->close();
            exit;
        }
        $stmt->close();
    }

    // 4. Insertar la cita
    if ($id_contacto) {
        // Definir un tipo de cita por defecto, puedes ajustarlo si tu formulario lo permite
        $tipo_cita = "Servicio programado"; // O puedes agregar un campo en el formulario para esto
        $direccion_cita = "A acordar"; // Podrías añadir un campo de dirección en el formulario de citas si es necesario

        $stmt = $conn->prepare("INSERT INTO Citas (id_contacto, fecha_hora_cita, tipo_cita, direccion_cita, estado) VALUES (?, ?, ?, ?, ?)");
        // El estado inicial de la cita es 'Programada'
        $estado_cita = 'Programada';
        $stmt->bind_param("issss", $id_contacto, $fecha_hora_cita, $tipo_cita, $direccion_cita, $estado_cita);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Cita agendada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agendar la cita: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo obtener el ID del contacto para agendar la cita.']);
    }

    // 5. Cerrar la conexión a la base de datos
    $conn->close();

} else {
    // Si no es una solicitud POST
    echo json_encode(['success' => false, 'message' => 'Método de solicitud no permitido.']);
}
?>