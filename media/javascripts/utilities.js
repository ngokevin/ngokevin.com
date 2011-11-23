document.getElementsByClass = function(class_name) {
    var itemsfound = new Array;
    var elements = document.getElementsByTagName('*');
    for(var i=0;i<elements.length;i++){
        if(elements[i].className == class_name){
            itemsfound.push(elements[i]);
        }
    }
    return itemsfound;
}

function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}
