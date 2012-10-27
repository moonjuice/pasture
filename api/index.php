<?php
	require 'Slim/Slim.php';
	$app = new Slim();
$app->get('/cows', 'getcows');
$app->post('/cows', 'addcow');
$app->get('/cows/:taxID',	'getcow');
$app->get('/cows/search/:query', 'findByTaxID');
$app->put('/cows/:taxID', 'updatecow');
$app->delete('/cows/:taxID',	'deletecow');
$app->get('/records', 'getrecords');
$app->post('/records', 'addrecord');
$app->get('/records/:rid',	'getrecord');
$app->put('/records/:rid', 'updaterecord');
$app->delete('/records/:rid',	'deleterecord');
	$app->run();
	//get List
	function getcows(){
		$sql = "select * FROM cow";
		try {
			$db = getConnection();
			$stmt = $db->query($sql);  
			$cows = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			echo json_encode($cows);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//add
	function addcow(){
		error_log('addcow\n', 3, '/var/tmp/php.log');
		$request = Slim::getInstance()->request();
		$cow = json_decode($request->getBody());
		$sql = "INSERT INTO cow ( taxID, earTag, fatherID, motherID, birthDay, esDay, esStatus, remark) VALUES ( :taxID, :earTag, :fatherID, :motherID, :birthDay, :esDay, :esStatus, :remark)";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("taxID", $cow->taxID);
			$stmt->bindParam("earTag", $cow->earTag);
			$stmt->bindParam("fatherID", $cow->fatherID);
			$stmt->bindParam("motherID", $cow->motherID);
			$stmt->bindParam("birthDay", $cow->birthDay);
			$stmt->bindParam("esDay", $cow->esDay);
			$stmt->bindParam("esStatus", $cow->esStatus);
			$stmt->bindParam("remark", $cow->remark);
			$stmt->execute();
			$db = null;
			echo json_encode($cow); 
		} catch(PDOException $e) {
			error_log($e->getMessage(), 3, '/var/tmp/php.log');
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//get single
	function getcow( $taxID){
		$sql = "SELECT * FROM cow WHERE  taxID=:taxID";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("taxID", $taxID);
			$stmt->execute();
			$cow = $stmt->fetchObject();  
			$db = null;
			echo json_encode($cow); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//put
	function updatecow( $taxID){
		$request = Slim::getInstance()->request();
		$body = $request->getBody();
		$cow = json_decode($body);
		$sql = "UPDATE cow SET  taxID=:taxID, earTag=:earTag, fatherID=:fatherID, motherID=:motherID, birthDay=:birthDay, esDay=:esDay, esStatus=:esStatus, remark=:remark WHERE  taxID=:taxID ";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("taxID", $cow->taxID);
			$stmt->bindParam("earTag", $cow->earTag);
			$stmt->bindParam("fatherID", $cow->fatherID);
			$stmt->bindParam("motherID", $cow->motherID);
			$stmt->bindParam("birthDay", $cow->birthDay);
			$stmt->bindParam("esDay", $cow->esDay);
			$stmt->bindParam("esStatus", $cow->esStatus);
			$stmt->bindParam("remark", $cow->remark);
			$stmt->execute();
			$db = null;
			echo json_encode($cow); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//delete
	function deletecow( $taxID) {
		$sql = "DELETE FROM cow WHERE  taxID=:taxID ";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("taxID", $taxID);
			$stmt->execute();
			$db = null;
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
    function findByTaxID($query) {
	    $sql = "SELECT * FROM cow WHERE taxID LIKE :query ORDER BY taxID";
	    try {
		    $db = getConnection();
		    $stmt = $db->prepare($sql);
		    $query = $query."%";  
		    $stmt->bindParam("query", $query);
		    $stmt->execute();
		    $wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		    $db = null;
		    echo json_encode($wines);
	    } catch(PDOException $e) {
		    echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	    }
    }
	//get List
	function getrecords(){
		$sql = "select * FROM record";
		try {
			$db = getConnection();
			$stmt = $db->query($sql);  
			$records = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			echo json_encode($records);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//add
	function addrecord(){
		error_log('addrecord\n', 3, '/var/tmp/php.log');
		$request = Slim::getInstance()->request();
		$record = json_decode($request->getBody());
		$sql = "INSERT INTO record ( rid, cid, content, createdate) VALUES ( :rid, :cid, :content, :createdate)";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("rid", $record->rid);
			$stmt->bindParam("cid", $record->cid);
			$stmt->bindParam("content", $record->content);
			$stmt->bindParam("createdate", $record->createdate);
			$stmt->execute();
			$db = null;
			echo json_encode($record); 
		} catch(PDOException $e) {
			error_log($e->getMessage(), 3, '/var/tmp/php.log');
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//get single
	function getrecord( $rid){
		$sql = "SELECT * FROM record WHERE  rid=:rid";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("rid", $rid);
			$stmt->execute();
			$record = $stmt->fetchObject();  
			$db = null;
			echo json_encode($record); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//put
	function updaterecord( $rid){
		$request = Slim::getInstance()->request();
		$body = $request->getBody();
		$record = json_decode($body);
		$sql = "UPDATE record SET  rid=:rid, cid=:cid, content=:content, createdate=:createdate WHERE  rid=:rid ";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("rid", $record->rid);
			$stmt->bindParam("cid", $record->cid);
			$stmt->bindParam("content", $record->content);
			$stmt->bindParam("createdate", $record->createdate);
			$stmt->execute();
			$db = null;
			echo json_encode($record); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	//delete
	function deleterecord( $rid) {
		$sql = "DELETE FROM record WHERE  rid=:rid ";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("rid", $rid);
			$stmt->execute();
			$db = null;
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
	function getConnection() {
		$dbhost="localhost";
		$dbuser="root";
		$dbpass="b0910789798";
		$dbname="pasture";
		$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $dbh;
	}
?>
