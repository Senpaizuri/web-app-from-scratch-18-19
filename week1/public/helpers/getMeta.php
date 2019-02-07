<?php
  $reqType = "get_beatmaps" . "?";
  $url = "https://osu.ppy.sh/api/";
  $k = "k=47f351ca4af306f467ce2c2a3aa6f75aab31b1d8&";
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
