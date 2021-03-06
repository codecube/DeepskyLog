<?php 
// objectsSet.pdf.php
// Generate the objectsSet list

$inIndex = true;
require_once 'common/entryexit/preludes.php';

objectsSet();

function objectsSet()
{ global $filename,$filename, 
         $objPrintAtlas,$objUtil;
	$filename=str_replace(' ','_',html_entity_decode($objUtil->checkGetKey('theShowname')));
	$theSet=array();
	$theParam=$objUtil->checkGetKey('theSet');
	while($thepos=strpos($theParam,' '))
	{ $theSet[]=substr($theParam,0,$thepos);
	  $theParam=substr($theParam,$thepos+1);
	}
	$theSet[]=$theParam;
	$thedsos=array();
	$theParam=$objUtil->checkGetKey('thedsos');
	while($thepos=strpos($theParam,' '))
	{ $thedsos[]=substr($theParam,0,$thepos);
	  $theParam=substr($theParam,$thepos+1);
	}
	$thedsos[]=$theParam;
	$thestars=array();
	$theParam=$objUtil->checkGetKey('thestars');
	while($thepos=strpos($theParam,' '))
	{ $thestars[]=substr($theParam,0,$thepos);
	  $theParam=substr($theParam,$thepos+1);
	}
	$thestars[]=$theParam;
	$thephotos=array();
	$theParam=$objUtil->checkGetKey('thephotos');
	while($thepos=strpos($theParam,' '))
	{ $thephotos[]=substr($theParam,0,$thepos);
	  $theParam=substr($theParam,$thepos+1);
	}
	$thephotos[]=$theParam;
	$datapage=$objUtil->checkGetKey('datapage');
	$ephemerides=$objUtil->checkGetKey('ephemerides');
	$yearephemerides=$objUtil->checkGetKey('yearephemerides');
	$reportlayoutselect=$objUtil->checkGetKey('reportlayoutselect');
	$objPrintAtlas->pdfAtlasObjectSet($objUtil->checkGetKey('theobject'),$objUtil->checkGetKey('theShowname'),$theSet,$thedsos,$thestars,$thephotos,$datapage,$reportlayoutselect,$ephemerides,$yearephemerides,false);
}
?>
