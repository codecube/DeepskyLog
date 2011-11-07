var gridDimensions=new Array(
    		  new Array(180,80.00,2.000,3),                                                 // FoV, L grid distance in deg, D grid distance in deg, default limiting star magnitude level for this zoom level 
    		  new Array(150,60.00,2.000,3),
    		  new Array(120,50.00,2.000,3),
    		  new Array( 90,40.00,2.666,4),
    		  new Array( 75,30.00,2.000,4),
    		  new Array( 60,24.50,1.666,5),
    		  new Array( 45,20.00,1.333,5),
    		  new Array( 35,15.00,1.000,6),
    		  new Array( 30,12.00,0.800,6),
    		  new Array( 25,10.00,0.666,6),
    		  new Array( 20, 8.00,0.633,6),
    		  new Array( 15, 6.00,0.400,7),
    		  new Array( 10, 4.00,0.266,7),
    		  new Array(  7, 3.00,0.200,8),
    		  new Array(  5, 2.00,0.133,8),
    		  new Array(  4, 1.50,0.100,9),
    		  new Array(  3, 1.00,0.066,9),
    		  new Array(  2, 0.80,0.050,10),
    		  new Array(  1, 0.40,0.026,11),
    		  new Array(0.5, 0.20,0.012,12),
    		  new Array(0.25,0.20,0.012,14),
    		  new Array(0.2 ,0.20,0.012,16),
    		  new Array(0.15,0.20,0.012,16),
    		  new Array(0.1 ,0.20,0.012,16)
    		  );

function generateallonepass(item,msie,stepra,stepdecl)
{ if(item==0)
	{ document.getElementById('ra').value=document.getElementById('rato').value;
    document.getElementById('decl').value=document.getElementById('declto').value;
	}
  else
  { document.getElementById('ra').value=1.0*document.getElementById('ra').value-stepra;
    if((stepra<0) || (document.getElementById('ra').value<1.0*document.getElementById('rafrom').value))
    {	document.getElementById('ra').value=document.getElementById('rato').value;
      document.getElementById('decl').value=document.getElementById('decl').value-stepdecl;
      if((((document.getElementById('declfrom').value*1.0<1.0*document.getElementById('declto').value) && (document.getElementById('decl').value*1.0<1.0*document.getElementById('declfrom').value))) || 
         (((document.getElementById('declfrom').value*1.0>1.0*document.getElementById('declto').value) && (document.getElementById('decl').value*1.0>1.0*document.getElementById('declfrom').value))))     
        return;
    }
  }
  item=(item*1.0)+1.0;
  var jsonhttp;
  if(window.XMLHttpRequest)
    jsonhttp=new XMLHttpRequest();
  else if(window.activeXObject)
    jsonhttp=new ActiveXObject("Microsoft.XMLHTTP");
  else
    alert("Atlas pages are not supported on non-xmlhttp machines");
  jsonhttp.onreadystatechange=function()
  { if(jsonhttp.readyState==4)
    { //alert(jsonhttp.responseText);
      temp=eval('('+jsonhttp.responseText+')');
      tempra=Math.floor(document.getElementById('ra').value,0);
      tempramin=Math.round((document.getElementById('ra').value-tempra)*60,0);
      if(tempra<10)
      	tempra='0'+tempra;
      if(tempramin<10)
      	tempramin='0'+tempramin;
      tempdecl=Math.floor(document.getElementById('decl').value,0);
      if(tempdecl>0)
      { tempdeclmin=Math.round((document.getElementById('decl').value-tempdecl)*60,1);
        if(tempdecl<10)
      	  tempdecl='0'+tempdecl;
        if(tempdeclmin<10)
      	  tempdeclmin='0'+tempdeclmin;
      }
      else
      { tempdeclmin=Math.round((document.getElementById('decl').value-tempdecl)*60,1);
        tempdecl=-tempdecl;
        if(tempdecl<10)
    	    tempdecl='0'+tempdecl;
        if(tempdeclmin<10)
    	    tempdeclmin='0'+tempdeclmin;
        tempdecl='-'+tempdecl;
      }	
      //alert('preset zero under ten');
      if(msie)
      { var mywindow=window.open("",'mywindow'+item);
        mywindow.location='atlasPagesOnePass.pdf?item='+urlencode(item)+'&filename='+document.getElementById('decl').value+'_'+item+'_'+document.getElementById('ra').value.substr(0,5);  
      }  
      else
      	window.open('atlasPagesOnePass.pdf?item='+urlencode(item)+'&filename='+tempdecl+'d'+tempdeclmin+'m'+' '+tempra+'h'+tempramin+'m','');
      generateallonepass(temp.item,msie,((document.getElementById('ra').value-(temp.raright))*2*(1-document.getElementById('theoverlap').value)),((document.getElementById('decl').value-(temp.declbottom))*2*(1-document.getElementById('theoverlap').value)));      
    }
  };
  var url='ajaxinterface.php?instruction=atlasPages&item='+urlencode(item)+'&'+
          'ra='+document.getElementById('ra').value+'&'+
          'decl='+document.getElementById('decl').value+'&'+
          'stars='+document.getElementById('stars').value+'&'+
          'dsos='+document.getElementById('dsos').value+'&'+
          'zoom='+document.getElementById('zoom').value;
  //alert(url);
  jsonhttp.open("GET",url,true);
  jsonhttp.send(null);
}
function generateOne(i,msie)
{ if(msie)
  { document.location='objectsSet.pdf.php?theobject='+urlencode(document.getElementById('R'+i).title)+
	  '&theShowname='+urlencode(document.getElementById('R'+i).value)+
	  '&theSet='+urlencode(document.getElementById('R'+i+'Dfovs').value)+
      '&thedsos='+urlencode(document.getElementById('R'+i+'Ddsos').value)+
      '&thestars='+urlencode(document.getElementById('R'+i+'Dstars').value)+
      '&thephotos='+urlencode(document.getElementById('R'+i+'Dphotos').value)+
      '&datapage='+urlencode(document.getElementById('datapage').checked)+
      '&ephemerides='+urlencode(document.getElementById('ephemerides').checked)+
      '&yearephemerides='+urlencode(document.getElementById('yearephemerides').checked)+
      (document.getElementById('indexpage').checked==true?
      ('&reportlayoutselect='+urlencode(document.getElementById('reportlayoutselect').value)):'');
  }
  else
    window.open('objectsSet.pdf.php?theobject='+urlencode(document.getElementById('R'+i).title)+
    	'&theShowname='+urlencode(document.getElementById('R'+i).value)+
        '&theSet='+urlencode(document.getElementById('R'+i+'Dfovs').value)+
        '&thedsos='+urlencode(document.getElementById('R'+i+'Ddsos').value)+
        '&thestars='+urlencode(document.getElementById('R'+i+'Dstars').value)+
        '&thephotos='+urlencode(document.getElementById('R'+i+'Dphotos').value)+
        '&datapage='+urlencode(document.getElementById('datapage').checked)+
        '&ephemerides='+urlencode(document.getElementById('ephemerides').checked)+
        '&yearephemerides='+urlencode(document.getElementById('yearephemerides').checked)+
        (document.getElementById('indexpage').checked==true?
        ('&reportlayoutselect='+urlencode(document.getElementById('reportlayoutselect').value)):''));
  document.getElementById('thecounter').innerHTML=(LangpdfseriesGenerating+document.getElementById('R'+i).value+'.');
  document.getElementById('T'+i).setAttribute('style','background-color:#DDDDDD;');
  document.getElementById('R'+(i+1)).focus();
}