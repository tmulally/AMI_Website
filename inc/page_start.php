<?php
  // Initialize everything I'll need for the page

  define( "PATH", "/" );
  define( "PATH_INC", PATH . "inc/" );

  define( "URL", "http://104.131.98.149/kickstarter-new/public_html/" );
  define( "URL_CSS", URL . "css/" );
  define( "URL_JS", URL . "js/" );

  define( "SITE_TITLE", "Krythera Studios" );

  // Include any PHP function libraries or classes
  include PATH . "db_conn.inc.php";
  if($db){
    //$link = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    //link for krythera site
    //$link = mysqli_connect("krytheracom.domaincommysql.com", "krytheracom", "Clank32!", "krythera");
    //link for ka05th30ry site
    $link = mysqli_connect("localhost", "root", "Kink03oz", "kickstarter");
    if(!$link){
        echo "connection error: " . mysqli_connect_error();
        die();
    }
  }
?>
