<?php
  $reqType = "get_beatmaps" . "?";
  $url = "https://osu.ppy.sh/api/";
  $k = "k=b3e262fc4097ea390621f9b0dfc49a054b1bd08d&";
  $b = $_GET['b'];
  $m = "m=" .  $_GET['m'] . "&";
  $arr = explode(",",$b);
  $data = [];

  for ($i=0; $i < count($arr); $i++) {
    $req = $url . $reqType . $k . "b=" .$arr[$i];
    $json = file_get_contents($req);
    array_push($data, json_decode($json));
  }
  echo json_encode($data);
 ?>
