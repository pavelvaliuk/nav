<?php
require 'db_users.php';

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

if (empty($username) || empty($email) || empty($password)) {
    die('Заполните все поля');
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo_users->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    die('Пользователь с таким именем или email уже существует');
}

$stmt = $pdo_users->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$username, $email, $hash]);

echo "Регистрация успешна!";
?>

