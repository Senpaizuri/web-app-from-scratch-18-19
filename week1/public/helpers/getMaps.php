<?php
  $reqType = "get_user_best" . "?";
  $url = "https://osu.ppy.sh/api/";
  $k = "k=b3e262fc4097ea390621f9b0dfc49a054b1bd08d&";
  $u = "u=" . $_GET['u'] . "&";
  $m = "m=" . $_GET['m'] . "&";
  $type = "type=" . "string&";
  $limit = "limit=10&";
  $req = $url . $reqType . $k . $u . $m . $type . $limit;
  $json = file_get_contents($req);
  echo $json;
 ?>
