<?php
include 'db.php';

$statusFilter = isset($_GET['status']) ? $_GET['status'] : null;

$sql = "SELECT table_number, status FROM `tables`";
if ($statusFilter) {
    $sql .= " WHERE status = ?";
}

$stmt = $conn->prepare($sql);
if ($statusFilter) {
    $stmt->bind_param("s", $statusFilter);
}

$stmt->execute();
$result = $stmt->get_result();

$tables = [];
while ($row = $result->fetch_assoc()) {
    $tables[] = $row;
}

header('Content-Type: application/json');
echo json_encode($tables);

$stmt->close();
$conn->close();
?>
