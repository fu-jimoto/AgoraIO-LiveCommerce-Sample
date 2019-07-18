<?php
require_once('config.php');

if(!$_POST['live_id'] || !$_POST['name'] || !$_POST['comment'] || !isset($_POST['is_audience'])){
    exit;
}

try {
    $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
} catch ( PDOException $e ) {
    exit;
}

$sql = sprintf("insert into chat (live_id,name,comment,is_audience,created_at) value(%s,%s,%s,%s,now())",
               $pdo->quote($_POST['live_id']),$pdo->quote($_POST['name']), $pdo->quote($_POST['comment']),$pdo->quote($_POST['is_audience']));
$pdo->query($sql);