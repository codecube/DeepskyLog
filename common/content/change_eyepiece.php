<?php // change_eyepiece.php - allows the eyepiece owner to change eyepiece details 
if(!$loggedUser)
  throw new Exception("No logged user in change_eyepiece.php, please contact the developers with this message.");
if(!($eyepieceid=$objUtil->checkGetKey('eyepiece')))
  throw new Exception("No eyepiece specified in change_eyepiece.php, please contact the developers with this message.");
if(!($objEyepiece->getEyepiecePropertyFromId($eyepieceid,'name')))
  throw new Exception("Eyepiece not found in change_eyepiece.php, please contact the developers with this message:".$eyepieceid);
$eyepiece=$objEyepiece->getEyepiecePropertiesFromId($_GET['eyepiece']);
echo "<div id=\"main\">";
echo "<h2>".stripslashes($eyepiece['name'])."</h2>";
echo "<hr>";
echo "<form action=\"".$baseURL."index.php\" method=\"post\" />";
echo "<input type=\"hidden\" name=\"indexAction\" value=\"validate_eyepiece\">";
echo "<input type=\"hidden\" name=\"id\"          value=\"".$_GET['eyepiece']."\" />";
echo "<table>";
tableFieldnameFieldExplanation(LangAddEyepieceField1,
                               "<input type=\"text\" class=\"inputfield requiredField\" maxlength=\"64\" name=\"eyepiecename\" size=\"30\" value=\"".stripslashes($eyepiece['name'])."\" />",
                               LangAddEyepieceField1Expl);
tableFieldnameFieldExplanation(LangAddEyepieceField2,
                               "<input type=\"text\" class=\"inputfield requiredField\" style=\"text-align:center\" maxlength=\"5\" name=\"focalLength\" size=\"5\" value=\"".stripslashes($eyepiece['focalLength'])."\" />",
                               LangAddEyepieceField2Expl);
tableFieldnameFieldExplanation(LangAddEyepieceField4,
                               "<input type=\"text\" class=\"inputfield\" style=\"text-align:center\" maxlength=\"5\" name=\"maxFocalLength\" size=\"5\" value=\"".((($mfl=stripslashes($eyepiece['maxFocalLength'])) < 0)?"":$mfl)."\" />",
                               LangAddEyepieceField4Expl);
tableFieldnameFieldExplanation(LangAddEyepieceField3,
                               "<input type=\"text\" class=\"inputfield requiredField\" style=\"text-align:center\" maxlength=\"5\" name=\"apparentFOV\" size=\"5\" value=\"".$eyepiece['apparentFOV']."\" />",
                               LangAddEyepieceField3Expl);
echo "</table>";
echo "<hr>";
echo "<p><input type=\"submit\" name=\"change\" value=\"".LangAddEyepieceButton2."\" /></p>";
echo "</form>";
echo "</div>";
?>
