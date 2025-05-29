<?php
// db_connect.php

$servername = "localhost"; // La dirección de tu servidor de base de datos (siempre 'localhost' en XAMPP)
$username = "root";        // El usuario por defecto de MySQL en XAMPP
$password = "";            // La contraseña por defecto de MySQL en XAMPP (vacía)
$dbname = "fumigacion_db"; // El nombre de tu base de datos que creaste en phpMyAdmin

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    // Si hay un error, terminar el script y mostrar el error
    die("Conexión fallida: " . $conn->connect_error);
}

// Opcional pero recomendado: Establecer el juego de caracteres a utf8mb4 para evitar problemas con caracteres especiales
$conn->set_charset("utf8mb4");

// ¡No cierres la conexión aquí! La cerraremos en el script que la use.
?>