<?php
// get_citas_por_fecha.php

// Incluir el archivo de conexión a la base de datos
require_once 'db_connect.php';

// Establecer el tipo de contenido de la respuesta como JSON
header('Content-Type: application/json');

// Verificar que la fecha se haya enviado
if (isset($_GET['fecha'])) {
    $fecha_solicitada = $_GET['fecha'];

    // Validar formato de fecha (simple)
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $fecha_solicitada)) {
        echo json_encode(['success' => false, 'message' => 'Formato de fecha inválido.']);
        $conn->close();
        exit;
    }

    // Preparar la consulta para obtener las citas para la fecha específica
    // Seleccionamos solo la parte de la hora (HH:MM:SS) de fecha_hora_cita
    $stmt = $conn->prepare("SELECT TIME(fecha_hora_cita) AS hora FROM Citas WHERE DATE(fecha_hora_cita) = ? AND estado != 'Cancelada'");
    $stmt->bind_param("s", $fecha_solicitada);
    $stmt->execute();
    $result = $stmt->get_result();

    $horas_ocupadas = [];
    while ($row = $result->fetch_assoc()) {
        $horas_ocupadas[] = $row; // Cada elemento será un array como ['hora' => 'HH:MM:SS']
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'data' => $horas_ocupadas]);

} else {
    echo json_encode(['success' => false, 'message' => 'Fecha no proporcionada.']);
}
?>