<?php

require_once('config.php');

if(!$_GET['live_id']){
    exit;
}

$res = getData();
doOutPut($res);

function getData(){
    try {
        $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
    } catch ( PDOException $e ) {
        exit;
    }
    
    $sql = sprintf("select title,status,view_count,heart_count,ext from live where id=%s",$pdo->quote($_GET['live_id']));
    
    return $pdo->query($sql,PDO::FETCH_ASSOC)->fetch();
}

function doOutPut($res){
    echo json_encode($res);
}