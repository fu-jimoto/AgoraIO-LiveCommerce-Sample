<?php
require_once('config.php');

if(!$_GET['live_id'] || !$_GET['type']){
    exit;
}

try {
    $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
} catch ( PDOException $e ) {
    exit;
}

switch($_GET['type']){
    case '1':
        $sql = sprintf("update live set view_count=view_count+1 where id=%s",$pdo->quote($_GET['live_id']));
        $pdo->query($sql);
        break;
    case '2':
        $sql = sprintf("update live set heart_count=heart_count+1 where id=%s",$pdo->quote($_GET['live_id']));
        $pdo->query($sql);
        break;
    case '3':
        $channelName = BASE_CHANNEL_NAME . $_GET['live_id'];
        $url = sprintf("%s/%s/%s/%s/%s",REST_API_URL,"channel","user",APP_ID,$channelName);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, REST_API_USER . ":" . REST_API_PASS);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $json = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($json, true);
        $count = 0;
        if($data['success'] && isset($data['data']['audience_total'])){
            $count = $data['data']['audience_total'];
        }

        $sql = sprintf("insert into session (live_id,count,created_at) value(%s,%s,now())",$pdo->quote($_GET['live_id']),$pdo->quote($count));
        $pdo->query($sql);
  
        break;
}

