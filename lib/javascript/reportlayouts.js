
var ajaxanswer=new Array();
//var newlayoutname='test';

function showSelectOptions(reportName)
{ var jsonhttp;
  if(window.XMLHttpRequest)
    jsonhttp=new XMLHttpRequest();
  else if(window.activeXObject)
    jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
  else
    alert("Not supported on non-xmlhttp machines");
  jsonhttp.onreadystatechange=function()
  { if(jsonhttp.readyState==4)
    { //alert(jsonhttp.responseText);
      layouts=eval("("+jsonhttp.responseText+")");
      for(i=document.getElementById('reportlayoutselect').options.length-1;i>=0;i--)
        document.getElementById('reportlayoutselect').remove(i);
      for(i=0,j=0;i<layouts.length;i++)
      { if(layouts[i]["observerid"]=="Deepskylog default")
        { optn = document.createElement("option");
          optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
          optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
          document.getElementById('reportlayoutselect').options.add(optn);
          j++;
        }
      }
      optn = document.createElement("option");
      optn.text = "-----";
      optn.value = "";
      document.getElementById('reportlayoutselect').options.add(optn);
      k=j;
      j++;
      for(i=0;i<layouts.length;i++)
      { if(layouts[i]["observerid"]==document.getElementById("tempobserver").value)
        { optn = document.createElement("option");
          optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
          optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
          document.getElementById('reportlayoutselect').options.add(optn);
        }
      }
      if(document.getElementById("showallcheckbox").checked)
      { optn = document.createElement("option");
        optn.text = "-----";
        optn.value = "";
        document.getElementById('reportlayoutselect').options.add(optn);
        for(i=0;i<layouts.length;i++)
        { if((layouts[i]["observerid"]!="Deepskylog default")&&(layouts[i]["observerid"]!=document.getElementById("tempobserver").value))
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
          }
        }
      }
      document.getElementById('reportlayoutselect').selectedIndex=k;
      ajaxAnswer = new Array();
      document.getElementById('reportlayout').innerHTML="";
    }
  };
  var url="ajaxinterface.php"            +"?"+
          "instruction=getReportLayouts" +"&"+
          "reportname="+reportName;
  jsonhttp.open("GET",url,true);
  jsonhttp.send(null);
}

function deleteLayoutPage(reportName)
{ if(document.getElementById('reportlayoutselect').options[document.getElementById('reportlayoutselect').selectedIndex].value)
  { var jsonhttp;
    if(window.XMLHttpRequest)
      jsonhttp=new XMLHttpRequest();
    else if(window.activeXObject)
      jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
    else
      alert("Not supported on non-xmlhttp machines");
    jsonhttp.onreadystatechange=function()
    { if(jsonhttp.readyState==4)
      { //alert(jsonhttp.responseText);
        k=0;
        layouts=eval("("+jsonhttp.responseText+")");
        for(i=document.getElementById('reportlayoutselect').options.length-1;i>=0;i--)
         document.getElementById('reportlayoutselect').remove(i);
        for(i=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]=="Deepskylog default")
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
            k++;
          }
        }
        optn = document.createElement("option");
        optn.text = "-----";
        optn.value = "";
        document.getElementById('reportlayoutselect').options.add(optn);
        for(i=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]==document.getElementById("tempobserver").value)
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
          }
        }
        if(document.getElementById("showallcheckbox").checked=="true")
        { optn = document.createElement("option");
          optn.text = "-----";
          optn.value = "";
          document.getElementById('reportlayoutselect').options.add(optn);
          for(i=0;i<layouts.length;i++)
          { if((layouts[i]["observerid"]!="Deepskylog default")&&(layouts[i]["observerid"]!=document.getElementById("tempobserver").value))
            { optn = document.createElement("option");
              optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              document.getElementById('reportlayoutselect').options.add(optn);
            }
          }
        }
        document.getElementById("deletelayout").setAttribute('class','hidden');  
        document.getElementById('reportlayoutselect').selectedIndex=k;
      } 
    };
    var url="ajaxinterface.php";
    var theReportLayout=document.getElementById('reportlayoutselect').value;
    theReportLayout=theReportLayout.substring(theReportLayout.indexOf(": ")+2,999);
    var params="instruction=deleteReportLayout&"+
               "reportname="+reportName+"&"+
               "reportlayout="+theReportLayout;
    //alert(params);
    jsonhttp.open("POST",url,true);
    jsonhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    jsonhttp.setRequestHeader("Content-length", params.length);
    jsonhttp.setRequestHeader("Connection", "close");
    jsonhttp.send(params);
    document.getElementById('reportlayout').innerHTML="";
  }
}
function setLayoutPage(loggedusername)
{ if(document.getElementById('reportlayoutselect').options[document.getElementById('reportlayoutselect').selectedIndex].value)
  { var jsonhttp;
    if(window.XMLHttpRequest)
      jsonhttp=new XMLHttpRequest();
    else if(window.activeXObject)
      jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
    else
      alert("Not supported on non-xmlhttp machines");
    jsonhttp.onreadystatechange=function()
    { if(jsonhttp.readyState==4)
      { //alert(jsonhttp.responseText);
        ajaxanswer=eval("("+jsonhttp.responseText+")");
        setLayoutPageCallback();
      }
    };
    var reportname=document.getElementById('reportlayoutselect').value;
    var reportuser=reportname.substring(0,reportname.indexOf(": "));
    reportname=reportname.substring(reportname.indexOf(": ")+2,999);
    var url="ajaxinterface.php?instruction=getReportLayout&reportname="+thereport;
    url+='&reportlayout='+reportname+'&reportuser='+reportuser;
    //alert(url);
    jsonhttp.open("GET",url,true);
    jsonhttp.send(null);
    if(reportuser==loggedusername)
      document.getElementById("deletelayout").setAttribute('class','visible btn btn-primary');
    else
      document.getElementById("deletelayout").setAttribute('class','hidden');   
  }
  else
  { document.getElementById('reportlayout').innerHTML="";
  }
}
function json_encode_dee(thearray)
{ returnvalue="";
  if(thearray)
  for(k=0;k<thearray.length;k++)
  { returnvalue+=k+" => array(";
    returnvalue+="\"reportlayoutpk\" => \""+thearray[k]["reportlayoutpk"]+"\",";
	returnvalue+="\"observerid\" => \""+thearray[k]["observerid"]+"\",";
	returnvalue+="\"reportname\" => \""+thearray[k]["reportname"]+"\",";
	returnvalue+="\"reportlayout\" => \""+thearray[k]["reportlayout"]+"\",";
	returnvalue+="\"fieldname\" => \""+thearray[k]["fieldname"]+"\",";
	returnvalue+="\"fieldline\" => \""+thearray[k]["fieldline"]+"\",";
	returnvalue+="\"fieldposition\" => \""+thearray[k]["fieldposition"]+"\",";
	returnvalue+="\"fieldwidth\" => \""+thearray[k]["fieldwidth"]+"\",";
	returnvalue+="\"fieldheight\" => \""+thearray[k]["fieldheight"]+"\",";
	returnvalue+="\"fieldstyle\" => \""+thearray[k]["fieldstyle"]+"\",";
	returnvalue+="\"fieldbefore\" => \""+thearray[k]["fieldbefore"]+"\",";
  	returnvalue+="\"fieldafter\" => \""+thearray[k]["fieldafter"]+"\",";
  	returnvalue+="\"fieldlegend\" => \""+thearray[k]["fieldlegend"]+"\"";
  	returnvalue+="),";
  }
  return "array("+returnvalue.substring(0,returnvalue.length-1)+")";
}

function saveAndGeneratePdf(theurl,reportName,pdfTitle,SID,thesort)
{ if(document.getElementById('reportlayoutselect').options[document.getElementById('reportlayoutselect').selectedIndex].value)
  { var jsonhttp;
    if(window.XMLHttpRequest)
      jsonhttp=new XMLHttpRequest();
    else if(window.activeXObject)
      jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
    else
      alert("Not supported on non-xmlhttp machines");
    jsonhttp.onreadystatechange=function()
    { if(jsonhttp.readyState==4)
      { //alert(jsonhttp.responseText);
        theReportLayout=document.getElementById('reportlayoutselect').value;
        theReportLayout=theReportLayout.substring(theReportLayout.indexOf(": ")+2,999);
        var reporttitle=prompt('Give the report title:','Deepskylog objects');
        location=(theurl+"?reportname="+reportName+"&"+
                "pdfTitle="+pdfTitle+"&"+
                "SID="+SID+"&"+
                "sort="+thesort+"&"+
                "pdfTitle="+reporttitle+"&"+
                "reportlayout="+theReportLayout);
        layouts=eval("("+jsonhttp.responseText+")");
        for(i=document.getElementById('reportlayoutselect').options.length-1;i>=0;i--)
          document.getElementById('reportlayoutselect').remove(i);
        for(i=0,j=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]=="Deepskylog default")
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
            j++;
          }
        }
        optn = document.createElement("option");
        optn.text = "-----";
        optn.value = "";
        document.getElementById('reportlayoutselect').options.add(optn);
        j++;
        for(i=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]==document.getElementById("tempobserver").value)
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
            if(layouts[i]["reportlayout"]==theReportLayout)
              k=j;
            j++;
          }
        }
        if(document.getElementById("showallcheckbox").checked=="true")
        { optn = document.createElement("option");
          optn.text = "-----";
          optn.value = "";
          document.getElementById('reportlayoutselect').options.add(optn);
          for(i=0;i<layouts.length;i++)
          { if((layouts[i]["observerid"]!="Deepskylog default")&&(layouts[i]["observerid"]!=document.getElementById("tempobserver").value))
            { optn = document.createElement("option");
              optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              document.getElementById('reportlayoutselect').options.add(optn);
            }
          }
        }
        document.getElementById('reportlayoutselect').selectedIndex=k;
        document.getElementById("deletelayout").setAttribute('class','visible');
      }
    };
    theReportLayout=document.getElementById('reportlayoutselect').value;
    theReportLayout=theReportLayout.substring(theReportLayout.indexOf(": ")+2,999);
    var url="ajaxinterface.php";
    var params="instruction=saveReportLayout" +"&"+
               "reportname="+reportName       +"&"+
               "reportlayout="+theReportLayout+"&"+
               "thedata="+json_encode_dee(ajaxanswer);
    //alert(params);
    jsonhttp.open("POST",url,true);
    jsonhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    jsonhttp.setRequestHeader("Content-length", params.length);
    jsonhttp.setRequestHeader("Connection", "close");
    jsonhttp.send(params);
  }
  else
  { document.getElementById('reportlayout').innerHTML="";
  }
}
function saveAsLayoutPage(reportName)
{ if(document.getElementById('reportlayoutselect').options[document.getElementById('reportlayoutselect').selectedIndex].value)
  { var jsonhttp;
    if(window.XMLHttpRequest)
      jsonhttp=new XMLHttpRequest();
    else if(window.activeXObject)
      jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
    else
      alert("Not supported on non-xmlhttp machines");
    jsonhttp.onreadystatechange=function()
    { if(jsonhttp.readyState==4)
      { //alert(jsonhttp.responseText);
        layouts=eval("("+jsonhttp.responseText+")");
        for(i=document.getElementById('reportlayoutselect').options.length-1;i>=0;i--)
          document.getElementById('reportlayoutselect').remove(i);
        for(i=0,j=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]=="Deepskylog default")
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
            j++;
          }
        }
        optn = document.createElement("option");
        optn.text = "-----";
        optn.value = "";
        document.getElementById('reportlayoutselect').options.add(optn);
        j++;
        for(i=0;i<layouts.length;i++)
        { if(layouts[i]["observerid"]==document.getElementById("tempobserver").value)
          { optn = document.createElement("option");
            optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
            document.getElementById('reportlayoutselect').options.add(optn);
            if(layouts[i]["reportlayout"]==document.getElementById("tempname").value)
              k=j;
            j++;
          }
        }
        if(document.getElementById("showallcheckbox").checked=="true")
        { optn = document.createElement("option");
          optn.text = "-----";
          optn.value = "";
          document.getElementById('reportlayoutselect').options.add(optn);
          for(i=0;i<layouts.length;i++)
          { if((layouts[i]["observerid"]!="Deepskylog default")&&(layouts[i]["observerid"]!=document.getElementById("tempobserver").value))
            { optn = document.createElement("option");
              optn.text = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              optn.value = layouts[i]["observerid"]+': '+layouts[i]["reportlayout"];
              document.getElementById('reportlayoutselect').options.add(optn);
            }
          }
        }
        document.getElementById('reportlayoutselect').selectedIndex=k;
        document.getElementById("deletelayout").setAttribute('class','visible');       
      }
    };
    var url="ajaxinterface.php";
    document.getElementById("tempname").value=prompt('Layout name:','My layout name');
    var params="instruction=saveReportLayout&"+
               "reportname="+reportName+"&"+
               "reportlayout="+document.getElementById("tempname").value+"&"+
               "thedata="+json_encode_dee(ajaxanswer);
    //alert(params);
    jsonhttp.open("POST",url,true);
    jsonhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    jsonhttp.setRequestHeader("Content-length", params.length);
    jsonhttp.setRequestHeader("Connection", "close");
    jsonhttp.send(params);
  }
  else
  { document.getElementById('reportlayout').innerHTML="";
  }
}
function newvalue(thefield)
{ for(i=0;(i<this.ajaxanswer.length)&&(this.ajaxanswer[i]["fieldname"]!=thefield);i++)
    ;
  this.ajaxanswer[i]["fieldposition"]=prompt('Give a new value for '+thefield,this.ajaxanswer[i]["fieldposition"]);
  setLayoutPageCallback();
}
function newnamevalue(thefield,thevalue,thename)
{ for(i=0;(i<this.ajaxanswer.length)&&(this.ajaxanswer[i]["fieldname"]!=thefield);i++)
    ;
  this.ajaxanswer[i][thevalue]=prompt('Give a new value for '+thename+' of '+thefield,this.ajaxanswer[i][thevalue]);
  setLayoutPageCallback();
}
function newnamevaluetext(thefield,thevalue,theelement)
{ for(i=0;(i<this.ajaxanswer.length)&&(this.ajaxanswer[i]["fieldname"]!=thefield);i++)
    ;
  this.ajaxanswer[i][thevalue]=document.getElementById(theelement).value;
}
function setreset(thefield)
{ for(i=0;(i<this.ajaxanswer.length)&&(this.ajaxanswer[i]["fieldname"]!=thefield);i++)
    ;
  if(this.ajaxanswer[i]["fieldwidth"]=="0")
    this.ajaxanswer[i]["fieldwidth"]="20";
  else
    this.ajaxanswer[i]["fieldwidth"]="0"; 
  setLayoutPageCallback();
}
function setLayoutPageCallback()
{ echostring='<hr />';
  echostring+="<table class=\"table table-striped table-responsive table-condensed\">";
  for(i=0,j=1;i<this.ajaxanswer.length;i++)
  { if(this.ajaxanswer[i]["fieldstyle"]=="LAYOUTMETADATA")
    { if(!(i%3))
      { echostring+="<tr>";  
      }
      //echostring+="<td class=\"right\">"+this.ajaxanswer[i]["fieldname"]+"</td>";
      echostring+="<td>"+this.titles[this.ajaxanswer[i]["fieldname"]]+"</td>";
      echostring+="<td>"+"<input id=\""+this.ajaxanswer[i]["fieldname"]+"\" class=\"form-control tableinputtext centered blike\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldposition"]+"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldposition','"+this.ajaxanswer[i]["fieldname"] +"');\"/>"+"</td>";
      if(!((i+1)%3))
      { echostring+="</tr>";  
      }
    }
  }
  if((i%3))
  { echostring+="</tr>";  
  }
  echostring+="</table>";
  echostring+="<hr />";
  echostring+="<table class=\"table table-striped table-responsive table-condensed\">";
  echostring+="<tr>";
  echostring+="<th>"+titles['ReportFieldname']+"</th>";
  echostring+="<th>"+"&nbsp;"+"</th>";
  echostring+="<th>"+titles['ReportFieldlineposition']+"</th>";
  echostring+="<th>"+titles['ReportFieldxposition']+"</th>";
  echostring+="<th>"+titles['ReportFieldwidth']+"</th>";
  echostring+="<th>"+titles['ReportFieldStyle']+"</th>";
  echostring+="<th>"+titles['ReportFieldTextBefore']+"</th>";
  echostring+="<th>"+titles['ReportFieldTextAfter']+"</th>";
  echostring+="<th>"+titles['ReportFieldLegend']+"</th>";
  echostring+="</tr>";  
  for(i=0,j=0;i<this.ajaxanswer.length;i++)
  { if(this.ajaxanswer[i]["fieldstyle"]!="LAYOUTMETADATA")
    { greyed=((this.ajaxanswer[i]["fieldwidth"]=="0")?"greyed":"");
      echostring+="<tr class=\"type"+(j%2)+"\">";  
      echostring+="<td class=\"right width300px\">"+this.titles[this.ajaxanswer[i]["fieldname"]]+"</td>";
      echostring+="<td class=\"centered\" onclick=\"setreset('"+this.ajaxanswer[i]["fieldname"]+"');\">"+"<input id=\"checkbox"+j+"\" type=\"checkbox\" "+(this.ajaxanswer[i]["fieldwidth"]!="0"?"checked=\"checked\"":'')+" />"+"</td>";
      echostring+="<td class=\"centered\">"+"<input id=\"fieldline"    +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldline"]     +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldline','fieldline"        +j+"');\"/>"+"</td>";
      echostring+="<td class=\"centered\">"+"<input id=\"fieldposition"+j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldposition"] +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldposition','fieldposition"+j+"');\"/>"+"</td>";
      echostring+="<td class=\"centered\">"+"<input id=\"fieldwidth"   +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldwidth"]    +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldwidth','fieldwidth"      +j+"');\"/>"+"</td>";
      echostring+="<td class=\"centered\">"+"<input id=\"fieldstyle"   +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldstyle"]    +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldstyle','fieldstyle"      +j+"');\"/>"+"</td>";
      echostring+="<td                   >"+"<input id=\"fieldbefore"  +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldbefore"]   +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldbefore','fieldbefore"    +j+"');\"/>"+"</td>";
      echostring+="<td                   >"+"<input id=\"fieldafter"   +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldafter"]    +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldafter','fieldafter"      +j+"');\"/>"+"</td>";
      echostring+="<td                   >"+"<input id=\"fieldlegend"  +j+"\"class=\"form-control blike"+greyed+"\" type=\"text\" value=\""+this.ajaxanswer[i]["fieldlegend"]   +"\"  onchange=\"newnamevaluetext('"+this.ajaxanswer[i]["fieldname"] +"','fieldlegend','fieldlegend"     +j+"');\"/>"+"</td>";
      echostring+="</tr>";
      j++;
    }
  }
  echostring+="</table>";
  echostring+="<hr />";	  
  document.getElementById('reportlayout').innerHTML=echostring;
}
function savereportlayout()
{ thename=prompt('Save report as...',document.getElementById('reportlayoutselect').toString());
}