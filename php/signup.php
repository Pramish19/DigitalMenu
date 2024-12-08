<?php

ini_set('display_errors', 1); //debugging garna lai sajilo hunx vane ra ho sabbai error show garna lai lekheko yo chai na lekhe ni hunx hataideu alxi laye par
error_reporting(E_ALL); 
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'staff'; // default staff rakehko yedi kunai role select gare na vane

// yo chai user ko inputs validate gareko
if (empty($username) || empty($email) || empty($password) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// email pailei register x ki xaina vanera check gareko
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists.']);
    $stmt->close();
    exit;
}

$stmt->close();

// hashed password ma use gare ko i mean enctyption
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

//sql statement prepare garekok user ko data insert garna 
$stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);

//  yo chai signup check  gareko sucess hunx ki hudaina vanera 
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Signup successful!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register user.']);
}

$stmt->close();
?>
