<?php
$order = json_decode($_POST['order'] ?? '[]', true);
$total = $_POST['total'] ?? 0;

header('Content-Type: application/json');
echo json_encode(['order' => $order, 'total' => $total]);
?>
