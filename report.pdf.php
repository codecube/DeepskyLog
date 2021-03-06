<?php
// report.pdf.php
// generates a pdf file containing a personalised report

$inIndex = true;
require_once 'common/entryexit/preludes.php';

report();

function report()
{ global $loggedUser,$filename,$objUtil,$loggedUserName;
  $filename=str_replace(' ','_',html_entity_decode($objUtil->checkRequestKey('pdfTitle','Deepskylog_Objects_Details')));
  if(array_key_exists('SID', $_GET)&&$_GET['SID']&&array_key_exists($_GET['SID'],$_SESSION)&&$_SESSION[$_GET['SID']])
    $objUtil->pdfReportPersonalised($loggedUserName,
                                    $objUtil->checkRequestKey('reportname'),
                                    $objUtil->checkRequestKey('reportlayout'),
                                    $_SESSION[$_GET['SID']], 
                                    $objUtil->checkGetKey('sort',''));
}
?>
