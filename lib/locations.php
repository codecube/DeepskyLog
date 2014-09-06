<?php 
//locations.php
// The location class collects all functions needed to enter, retrieve and adapt location data from the database.

global $inIndex;
if((!isset($inIndex))||(!$inIndex)) include "../../redirect.php";

class Locations
{ public function addLocation($name, $longitude, $latitude, $region, $country, $timezone)                             // addLocation adds a new location to the database. The name, longitude, latitude, region and country should be given as parameters. 
  { global $objDatabase;
  	$objDatabase->execSQL("INSERT INTO locations (name, longitude, latitude, region, country, timezone) VALUES (\"$name\", \"$longitude\", \"$latitude\", \"$region\", \"$country\", \"$timezone\")");
    return $objDatabase->selectSingleValue("SELECT id FROM locations ORDER BY id DESC LIMIT 1",'id');
  }
  public  function getAllLocationsIds($id)                                                   // returns a list with all id's which have the same name as the name of the given id
  { global $objDatabase;
    return $objDatabase->selectSingleArray("SELECT id FROM locations WHERE name = \"".$objDatabase->selectSingleValue("SELECT name FROM locations WHERE id = \"".$id."\"",'name')."\"",'id');
  }
  public  function getCountries() // getCountries returns all possible countries
  { global $instDir;
 	  $filename=$instDir."lib/setup/locations/countries.txt";
    $fh=fopen($filename,"r") or die("Could not open countries file"+$filename);
    while(!feof($fh))
    { $data=fgets($fh);
      $vars=explode(" - ",$data);
      $a=sscanf($vars[1],"(%c%c)");
      $countries[$a[0].$a[1]]=ucfirst(strtolower($vars[0]));
    }
    fclose($fh);
    return $countries;
  }
  public function getDatabaseCountries()                                                                                 // returns all countries for which the database of the locations is available
  { global $instDir;
    $filename=$instDir."lib/setup/locations/countries.txt";
    $fh = fopen($filename,"r") or die("Could not open countries file");
    while(!feof($fh))
    { $data=fgets($fh);
      $vars=explode(" - ",$data);
      $a=sscanf($vars[1],"(%c%c)");
      $countriesConversion[$a[0].$a[1]]=ucfirst(strtolower($vars[0]));
    }
    fclose($fh);
    $maindir=$instDir."lib/setup/locations/" ;
    $mydir=opendir($maindir) ;
    $exclude=array("index.php",".","..");
    $countries=array();
    while($fn=readdir($mydir))
    { if(in_array($fn,$exclude)) 
        continue;
      $code=explode(".",$fn);
      if($code[1]=="ast")
        $countries[] = $countriesConversion[strtoupper($code[0])];
    }
    closedir($mydir);
    return $countries;
  }
  public  function getLocationId($name, $observer)                                              // returns the id for this location
  { global $objDatabase; 
    return $objDatabase->selectSingleValue("SELECT id FROM locations where name=\"".($name)."\" and observer=\"".$observer."\"",'id',-1);
  }
  public  function getLocationPropertyFromId($id,$property,$defaultValue='')
  { global $objDatabase; return $objDatabase->selectSingleValue("SELECT ".$property." FROM locations WHERE id = \"".$id."\"",$property,$defaultValue);
  }
  public  function getLocations()                                                               // returns an array with all locations
  { global $objDatabase;
    return $objDatabase->selectSingleArray("SELECT id FROM locations",'id');
  }
  public  function getLocationsFromDatabase($name, $country)                                    // returns an array with all information about the location where the name equals the given name in the given country (given the country string - e.g. Belgium).
  { global $objDatabase, $instDir;
	  $locations=array();
    $filename=$instDir."lib/setup/locations/countries.txt";
    $fh=fopen($filename,"r") or die("Could not open countries file");
    while(!feof($fh))
    { $data=fgets($fh);
      $vars=explode(" - ",$data);
      $a=sscanf($vars[1],"(%c%c)");
      $countriesConversion[ucfirst(strtolower($vars[0]))]=$a[0].$a[1];
    }
    fclose($fh);
    $filename=$instDir."lib/setup/locations/".strtolower($countriesConversion[$country]).".ast";
    $fh=fopen($filename, "r") or die("Could not read file");
    while(!feof($fh))
    { $data=fgets($fh);
      $vars=explode("\t", $data);
      if (strtolower($vars[0]) == strtolower($name))
        $locations[] = str_replace("\n","",$data);
    }
    return $locations;
  }
  public  function getLocationTimeDifference($id)
  { global $objDatabase;
		$timezone=$this->getLocationPropertyFromId($id,'timezone');
		$dateTimeZone = new DateTimeZone($timezone);
		$timedifference = $dateTimeZone->getOffset();
		$timedifference = $timedifference / 3600.0;
		$timedifferenceminutes = ($timedifference - (int) $timedifference) * 60;
  }  
  public  function getLocationUsedFromId($id)                                                   // returns the number of times the location is used in observations
  { global $objDatabase; 
    return $objDatabase->selectSingleValue("SELECT count(id) as ObsCnt FROM observations WHERE locationid=\"".$id."\"",'ObsCnt',0)
         + $objDatabase->selectSingleValue("SELECT count(id) as ObsCnt FROM cometobservations WHERE locationid=\"".$id."\"",'ObsCnt',0);
	}
  public  function getSortedLocations($sort,$observer="",$active='')                                       // returns an array with the ids of all locations, sorted by the column specified in $sort
  { global $objDatabase; 
    return $objDatabase->selectSingleArray("SELECT id, name FROM locations ".($observer?"WHERE observer LIKE \"".$observer."\" ".($active?" AND locationactive=".$active:""):" GROUP BY name")." ORDER BY ".$sort.", name",'id');  
  } 
  public  function getSortedLocationsList($sort, $observer = "",$active='')                             // returns an array with the ids of all locations, sorted by the column specified in $sort. Locations withthe same name are adapted by adding the province.
  { global $objDatabase; 
    $new_sites=array();
    $sites=$objDatabase->selectRecordsetArray("SELECT id, name FROM locations ".($observer?"WHERE observer LIKE \"".$observer."\" ".($active?" AND locationactive=".$active:""):" GROUP BY name")." ORDER BY ".$sort.",name",'id');  
    $previous = "fdgsdg";
    for($i=0;$i<count($sites);$i++)
    { $adapt[$i] = 0;
      if($sites[$i]['name'] == $previous)
      { $adapt[$i]=1;
        $adapt[$i-1]=1;
      }
      $previous=$sites[$i]['name'];
    }
    for($i= 0;$i<count($sites);$i++)
    { if($adapt[$i])
      { $new_sites[$i][0] = $sites[$i]['id'];
        $new_sites[$i][1] = $sites[$i]['name']." (".$this->getLocationPropertyFromId($sites[$i]['id'],'region').")";
      }
      else
      { $new_sites[$i][0] = $sites[$i]['id'];
        $new_sites[$i][1] = $sites[$i]['name'];
      }
    }
    return $new_sites;
  }
  public  function setLocationProperty($id,$property,$propertyValue)                            // sets the property to the specified value for the given location
  { global $objDatabase;
    return $objDatabase->execSQL("UPDATE locations SET ".$property." = \"".$propertyValue."\" WHERE id = \"".$id."\"");
  }
  public  function showLocationsObserver()
  { global $baseURL,$loggedUser,$objObserver,$objUtil,$objLocation,$objPresentations,$loggedUserName,$objContrast,$locationid,$sites;
		if($sites!=null)
		{ echo "<form action=\"".$baseURL."index.php\" method=\"post\"><div>";
		  echo "<input type=\"hidden\" name=\"indexAction\" value=\"validate_site\" />";
		  echo "<input type=\"hidden\" name=\"adaptStandardLocation\" value=\"1\" />";
		  
		  // Add the button to select which columns to show
		  $objUtil->addTableColumSelector();
		  
		  echo "<table id=\"sort-table\" class=\"table table-condensed table-striped table-hover tablesorter custom-popup\">";
		  echo "<thead><tr>";
		  echo "<th class=\"filter-false columnSelector-disable\" data-sorter=\"false\">".LangViewActive."</td>";
		  
		  echo "<th>".LangViewLocationLocation."</th>";
		  echo "<th>".LangViewLocationProvince."</th>";
		  echo "<th>".LangViewLocationCountry."</th>";
		  echo "<th class=\"sorter-digit\">".LangViewLocationLongitude."</th>";
		  echo "<th class=\"sorter-digit\">".LangViewLocationLatitude."</th>";
		  echo "<th>".LangAddSiteField6."</th>";
		  echo "<th>".LangViewLocationLimMag."</th>";
		  echo "<th>".LangViewLocationSB."</th>";
		  echo "<th class=\"filter-false columnSelector-disable\" data-sorter=\"false\">".LangViewLocationStd."</th>";
		  echo "<th>".LangTopObserversHeader3."</th>";
		  echo "</tr></thead>";
		  while(list($key,$value)=each($sites))
		  { $sitename=stripslashes($objLocation->getLocationPropertyFromId($value,'name'));
		    $region=stripslashes($objLocation->getLocationPropertyFromId($value,'region'));
		    $country=$objLocation->getLocationPropertyFromId($value,'country');
		    if($objLocation->getLocationPropertyFromId($value,'longitude')>0)
		      $longitude = "&nbsp;" . $objPresentations->decToString($objLocation->getLocationPropertyFromId($value,'longitude'));
		    else
		      $longitude = $objPresentations->decToString($objLocation->getLocationPropertyFromId($value,'longitude'));
		    if($objLocation->getLocationPropertyFromId($value,'latitude')>0)
		      $latitude = "&nbsp;" . $objPresentations->decToString($objLocation->getLocationPropertyFromId($value,'latitude'));
		    else
		      $latitude = $objPresentations->decToString($objLocation->getLocationPropertyFromId($value,'latitude'));
		    $timezone = $objLocation->getLocationPropertyFromId($value,'timezone');
		    $observer = $objLocation->getLocationPropertyFromId($value,'observer');
		    $limmag = $objLocation->getLocationPropertyFromId($value,'limitingMagnitude');
		    $sb = $objLocation->getLocationPropertyFromId($value,'skyBackground');
		    if(($limmag<-900)&&($sb>0))
		      $limmag = sprintf("%.1f", $objContrast->calculateLimitingMagnitudeFromSkyBackground($sb));
		    elseif(($limmag<-900)&&($sb<-900)) 
		    { $limmag="&nbsp;";
		      $sb="&nbsp;";
		    } 
		    else
		      $sb=sprintf("%.1f", $objContrast->calculateSkyBackgroundFromLimitingMagnitude($limmag));
		    if($value!="1")
		    { echo "<tr>";
          echo "<td>".
            "<input id=\"locationactive".$value."\" type=\"checkbox\" ".($objLocation->getLocationPropertyFromId($value,'locationactive')?" checked=\"checked\" ":"").
                    " onclick=\"setactivation('location',".$value.");\" />".
            "</td>";
		      echo "<td><a href=\"".$baseURL."index.php?indexAction=adapt_site&amp;location=".urlencode($value)."\">".$sitename."</a></td>";
		      echo "<td>".$region."</td>";
		      echo "<td>".$country."</td>";
		      echo "<td>".$longitude."</td>";
		      echo "<td>".$latitude."</td>";
		      echo "<td>".$timezone."</td>";
		      echo "<td>".$limmag."</td>";
		      echo "<td>".$sb."</td>";
		      echo "<td><input type=\"radio\" name=\"stdlocation\" value=\"". $value ."\"".(($value==$objObserver->getObserverProperty($loggedUser,'stdlocation'))?" checked=\"checked\" ":"")." onclick=\"submit();\" />&nbsp;<br /></td>";
					echo "<td>";
		      if(!($obsCnt=$objLocation->getLocationUsedFromId($value))) {
		        echo "<a href=\"".$baseURL."index.php?indexAction=validate_delete_location&amp;locationid=".urlencode($value)."\">".LangRemove."</a>";
		      } else {
		        echo "<a href=\"".$baseURL."index.php?indexAction=result_selected_observations&amp;observer=".$loggedUser."&amp;site=".$value."&amp;exactinstrumentlocation=true\">";
		        if ($obsCnt > 1) {
		          echo $obsCnt.' '.LangGeneralObservations."</a>";
		        } else {
		      	  echo $obsCnt.' '.LangGeneralObservation."</a>";
		        }
		      }
		      echo "</td>";
			  echo "</tr>";
		    }
		  }
		  echo "</table>";
		  echo $objUtil->addTablePager();
		  
		  echo $objUtil->addTableJavascript();
		  
		  echo "</div></form>";
		  echo "<hr />";
		}  	
  }
  public  function validateDeleteLocation()
  { global $loggedUser, $objUtil, $objDatabase, $objObserver;
    if(($locationid=$objUtil->checkGetKey('locationid'))
    && ($objUtil->checkAdminOrUserID($this->getLocationPropertyFromId($locationid,'observer')))
    && (!($this->getLocationUsedFromId($locationid))))
    { if($loggedUser && $objObserver->getObserverProperty($loggedUser,'stdlocation')==$locationid)
        $objObserver->setObserverProperty($loggedUser,'stdlocation',0);
      $objDatabase->execSQL("DELETE FROM locations WHERE id=\"".$locationid."\"");
      return LangValidateLocationMessage3;
    }
  }
  public  function validateSaveLocation()
	{ global $objPresentations, $objUtil, $objDatabase, $objObserver,$loggedUser;  
	  if(($objUtil->checkPostKey('adaptStandardLocation')==1)
    &&  $objUtil->checkUserID($this->getLocationPropertyFromId($objUtil->checkPostKey('stdlocation'),'observer')))
    { $objObserver->setObserverProperty($loggedUser,'stdlocation', $_POST['stdlocation']);
    } 
    elseif($objUtil->checkPostKey('sitename')
    && $objUtil->checkPostKey('country'))
    { $latitude  = $objUtil->checkPostKey('latitude',0)  + $objUtil->checkPostKey('latitudemin',0) / 60.0;
      $longitude = $objUtil->checkPostKey('longitude',0) + $objUtil->checkPostKey('longitudemin',0) / 60.0;
      // Get the timezone
      $xmlfile2 = "http://ws.geonames.org/timezone?lat=" . $latitude . "&lng=" . $longitude;
      $timezones = simplexml_load_file($xmlfile2);
        
      $timezone = $timezones->timezone->timezoneId;
      if (strlen($timezone) < 2) {
        $timezone = "UTC";
      }

      if($objUtil->checkPostKey('add'))
      { 
        if ($objUtil->checkPostKey('region')) {
          $region = $_POST['region'];
        } else {
          $region = "";
        }
        
        $id = $this->addLocation($_POST['sitename'], $longitude, $latitude, $region, $_POST['country'], $timezone);
        if (array_key_exists('lm', $_POST) && $_POST['lm'])
        { $this->setLocationProperty($id, 'limitingMagnitude', $_POST['lm']);
          $this->setLocationProperty($id, 'skyBackground', -999);
        } 
        elseif(array_key_exists('sb', $_POST) && $_POST['sb'])
        { $this->setLocationProperty($id, 'skyBackground', $_POST['sb']);
          $this->setLocationProperty($id, 'limitingMagnitude', -999);
        } 
        else
        { $this->setLocationProperty($id, 'skyBackground', -999);
          $this->setLocationProperty($id, 'limitingMagnitude', -999);
    		}
    		$this->setLocationProperty($id, 'observer', $loggedUser);
    		
        return LangValidateSiteMessage2;
      }
      if($objUtil->checkPostKey('change')
      && $objUtil->checkAdminOrUserID($this->getLocationPropertyFromId($objUtil->checkPostKey('id'),'observer')))
      { $this->setLocationProperty($_POST['id'], 'name',      $_POST['sitename']);
        if ($objUtil->checkPostKey('region')) {
          $region = $_POST['region'];
        } else {
          $region = "";
        }
        $this->setLocationProperty($_POST['id'], 'region',    $region);
        $this->setLocationProperty($_POST['id'], 'country',   $_POST['country']);
        $this->setLocationProperty($_POST['id'], 'longitude', $longitude);
        $this->setLocationProperty($_POST['id'], 'latitude',  $latitude);
        $this->setLocationProperty($_POST['id'], 'timezone',  $timezone);
        //$this->setLocationProperty($_POST['id'], 'observer',  $loggedUser);
        if($objUtil->checkPostKey('lm'))
        { $this->setLocationProperty($_POST['id'], 'limitingMagnitude', $_POST['lm']);
          $this->setLocationProperty($_POST['id'], 'skyBackground', -999);
        } 
        elseif($objUtil->checkPostKey('sb'))
        { $this->setLocationProperty($_POST['id'], 'skyBackground', $_POST['sb']);
          $this->setLocationProperty($_POST['id'], 'limitingMagnitude', -999);
        } 
        else
        { $this->setLocationProperty($_POST['id'], 'skyBackground', -999);
          $this->setLocationProperty($_POST['id'], 'limitingMagnitude', -999);
    		}
        return LangValidateSiteMessage5;
      }
    }
    else
      return LangValidateMessage1;
  }	
}
?>
