<?php
session_start();
require 'db_routes.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo_routes->prepare("SELECT id, name, created, points FROM routes WHERE user_id = ?");
$stmt->execute([$user_id]);
$routes = $stmt->fetchAll();

foreach ($routes as &$route) {
    $route['points'] = json_encode(json_decode($route['points'])); // чистый JSON
}

echo json_encode($routes);
?>
