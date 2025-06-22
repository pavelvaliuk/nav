<?php
session_start();
require 'db_routes.php';

if (!isset($_SESSION['user_id'])) {
    echo 'Ошибка: Вы не авторизованы.';
    exit;
}

$user_id = $_SESSION['user_id'];
$name = $_POST['name'];
$points = $_POST['points'];
$created = date('Y-m-d H:i:s');

$stmt = $pdo_routes->prepare("INSERT INTO routes (user_id, name, points, created) VALUES (?, ?, ?, ?)");
$stmt->execute([$user_id, $name, $points, $created]);

echo 'Маршрут успешно сохранён!';
?>
