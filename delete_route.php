<?php
session_start();
require 'db_routes.php';

if (!isset($_SESSION['user_id'])) {
    echo "Не авторизованы";
    exit;
}

$id = $_POST['route_id'];
$user_id = $_SESSION['user_id'];

$stmt = $pdo_routes->prepare("DELETE FROM routes WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);

echo "Маршрут удалён";
?>
