<?php
session_start();

header('Content-Type: application/json');

require "../includes/database_connect.php";

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false,
        "is_logged_in" => false,
        "message" => "Please login first."
    ));
    exit();
}

$user_id = $_SESSION['user_id'];

// Check property ID
if (!isset($_GET['property_id']) || !is_numeric($_GET['property_id'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid Property ID"
    ));
    exit();
}

$property_id = intval($_GET['property_id']);

// Check if already interested
$sql = "SELECT id FROM interested_users_properties WHERE user_id = ? AND property_id = ?";
$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => mysqli_error($conn)
    ));
    exit();
}

mysqli_stmt_bind_param($stmt, "ii", $user_id, $property_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {

    // Remove interest
    $delete_sql = "DELETE FROM interested_users_properties WHERE user_id = ? AND property_id = ?";
    $delete_stmt = mysqli_prepare($conn, $delete_sql);

    mysqli_stmt_bind_param($delete_stmt, "ii", $user_id, $property_id);

    if (mysqli_stmt_execute($delete_stmt)) {

        echo json_encode(array(
            "success" => true,
            "is_interested" => false,
            "property_id" => $property_id
        ));

    } else {

        echo json_encode(array(
            "success" => false,
            "message" => mysqli_error($conn)
        ));
    }

} else {

    // Add interest
    $insert_sql = "INSERT INTO interested_users_properties(user_id, property_id) VALUES(?, ?)";
    $insert_stmt = mysqli_prepare($conn, $insert_sql);

    mysqli_stmt_bind_param($insert_stmt, "ii", $user_id, $property_id);

    if (mysqli_stmt_execute($insert_stmt)) {

        echo json_encode(array(
            "success" => true,
            "is_interested" => true,
            "property_id" => $property_id
        ));

    } else {

        echo json_encode(array(
            "success" => false,
            "message" => mysqli_error($conn)
        ));
    }
}

mysqli_close($conn);
exit();