<?php
// redirect.php
// redirects to the main entry page when one tries to enter via another way than foreseen

echo "<html>";
echo "<head>";
echo "<meta http-equiv=\"refresh\" content=\"2; url=/index.php\" />"; 
echo "</head>";
echo "<body>";
echo "</body>";
echo "</html>";
die('You tried to enter the site in an impropriate way. You will be taken to the main entrance page.');
?>