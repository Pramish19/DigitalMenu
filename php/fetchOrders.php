<?php
include "db.php";

// json file bata order load garx
$ordersFile = 'orders.json';
if (file_exists($ordersFile)) {
    $fileContents = file_get_contents($ordersFile);
    $orders = json_decode($fileContents, true);

    if (!$orders) {
        echo json_encode(['error' => 'Failed to decode orders.json']);
        exit;
    }

    // table aggregrate gareko
    $aggregatedOrders = [];
    foreach ($orders as $order) {
        // order structure validate gareko
        if (!isset($order['table'], $order['order'], $order['total'])) {
            continue; //invalid entries skip gareko
        }

        $table = $order['table'];
        if (!isset($aggregatedOrders[$table])) {
            $aggregatedOrders[$table] = [
                'table' => $table,
                'orders' => [],
                'total' => 0
            ];
        }
        $aggregatedOrders[$table]['orders'][] = $order['order'];
        $aggregatedOrders[$table]['total'] += $order['total'];
    }

    //json encoding gareko for array reindex
    echo json_encode(array_values($aggregatedOrders));
} else {
    error_log("Orders file not found: $ordersFile");
    echo json_encode([]);
}
?>
