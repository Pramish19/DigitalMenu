<?php
session_start();
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// input validations lai
if ($email && $password) {
    //sql statement lai prepare gareko data fecth garna email bata
    $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $hashedPassword, $role);
        $stmt->fetch();

        // password verify gareko
        if (password_verify($password, $hashedPassword)) {
            // session start gareko user ko data store garna lai
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $role;

            //user ko role anusar redirect gareko yo chai
            if ($role === 'admin') {
                echo json_encode(['success' => true, 'redirect' => 'admin.html']);
            } else {
                echo json_encode(['success' => true, 'redirect' => 'index.html']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No user found with that email.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
}
?>
