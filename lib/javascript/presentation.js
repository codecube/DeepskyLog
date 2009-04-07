function findVerticalPosition(theElement)
{ var obj=document.getElementById(theElement);
  var top=obj.offsetTop;
   while(obj=obj.offsetParent)
   { top+=obj.offsetTop;
   } 
  return top;
 }
function resizeElements(theElement,delta) 
{ var height=document.getElementById('dslbody').clientHeight;
  height-=findVerticalPosition(theElement);
	height-=delta;
	if(height<100) 
	{ height=100;
	}  
	document.getElementById(theElement).style.height=height+'px';
}