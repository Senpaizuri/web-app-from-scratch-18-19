<?php
  $reqType = "get_user_best" . "?";
  $url = "https://osu.ppy.sh/api/";
  $k = "k=47f351ca4af306f467ce2c2a3aa6f75aab31b1d8&";
  $u = "u=" . $_GET['u'] . "&";
  $m = "m=" . $_GET['m'] . "&";
  $type = "type=" . "string&";
  $limit = "limit=10&";
  $req = $url . $reqType . $k . $u . $m . $type . $limit;
  $json = file_get_contents($req);
  echo $json;
 ?>
