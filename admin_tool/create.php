<?php
require_once('config.php');

echo "<!doctype html>";
echo "<html>";
echo "<head>";
echo "<meta charset='utf-8'>";
echo "</head>";
echo "<body>";
if(isset($_POST['create'])){
    saveData();
    echo "create success. <a href='./'>Home</a>";
}else{
    echo "<form method='post' action='create.php'>";
    echo "Title:<input type='text' name='title' size='100' /><br />";
    echo "URL:<input type='text' name='url' value='https://' size='100' /><br />";
    echo "<input type='submit' value='create' />";
    echo "<input type='hidden' name='create' value='1'/>";
    echo "</form>";
}
echo "</body>";
echo "</html>";

function saveData(){
    try {
        $pdo=new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8',DB_HOST,DB_NAME), DB_USER, DB_PASS);
    } catch ( PDOException $e ) {
        exit;
    }
    
    $sql = sprintf("insert into live (title,ext,created_at) value(%s,%s,now())",$pdo->quote($_POST['title']),$pdo->quote($_POST['url']));
    
    try {
        $pdo->query($sql);
    } catch ( PDOException $e ) {

    }

    return ;
}