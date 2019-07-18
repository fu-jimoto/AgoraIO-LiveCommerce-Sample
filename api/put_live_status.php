<?php
require_once('config.php');

if(!$_GET['live_id'] || !$_GET['status']){
    exit;
}

try {
    $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
} catch ( PDOException $e ) {
    exit;
}

$sql = sprintf("update live set status=%s where id=%s",$pdo->quote($_GET['status']),$pdo->quote($_GET['live_id']));
$pdo->query($sql);
