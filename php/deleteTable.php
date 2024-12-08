<?php
$file = 'tables.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if ($id) {
        $tables = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
        $updatedTables = array_filter($tables, fn($table) => $table['id'] !== $id);
        file_put_contents($file, json_encode(array_values($updatedTables)));
        echo json_encode(['success' => true, 'message' => 'Table deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid table ID.']);
    }
}
