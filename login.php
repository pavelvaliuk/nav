<?php
session_start();
require 'db_users.php';

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $pdo_users->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    echo "Вы успешно вошли!";
} else {
    echo "Неверный логин или пароль";
}
?>
