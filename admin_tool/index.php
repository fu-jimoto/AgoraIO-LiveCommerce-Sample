<?php
require_once('config.php');

$res = getData();
doOutPut($res);

function getData(){
    try {
        $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
    } catch ( PDOException $e ) {
        exit;
    }
    
    $sql = sprintf("select id,title,ext from live");
    error_log(sprintf("%s:%s:SQL>%s",__FILE__,__LINE__,$sql));
    
    return $pdo->query($sql,PDO::FETCH_ASSOC);
}

function doOutPut($data){


    echo "<!doctype html>";
    echo "<html>";
    echo "<head>";
    echo "<meta charset='utf-8'>";
    echo "</head>";
    echo "<body>";
    echo "<a href='create.php'>NEW</a><br />";
    echo "<table border='1' cellspacing='0' bordercolor='#333333'>";
    echo "<tr>";
    echo "<th>ID</th>";
    echo "<th>Title</th>";
    echo "<th>URL</th>";
    echo "<th>Operation</th>";
    echo "</tr>";
    foreach($data as $v){
        echo "<tr>";
        echo "<td>".$v['id']."</td>";
        echo "<td>".$v['title']."</td>";
        echo "<td>".$v['ext']."</td>";
        echo "<td>";
        echo "<a href='".LIVE_DOMAIN."/host/?id=".$v['id']."' target='_blank'>Host</a> | ";
        echo "<a href='".LIVE_DOMAIN."/audience/?id=".$v['id']."' target='_blank'>Audience</a>";
        echo "</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "</body>";
    echo "</html>";
}