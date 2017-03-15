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


function getXYpos(elem)
{
   if (!elem)
   {
      return {"x":0,"y":0};
   }
   var xy={"x":elem.offsetLeft,"y":elem.offsetTop}
   var par=getXYpos(elem.offsetParent);
   for (var key in par)
   {
      xy[key]+=par[key];
   }
   return xy;
}


// Return the current scrollbar offsets as the x and y properties of an object
function getScrollOffsets(w) {
    // Use the specified window or the current window if no argument
    w = w || window;

    // This works for all browsers except IE versions 8 and before
    if (w.pageXOffset != null)
        return {x: w.pageXOffset, y:w.pageYOffset};

    // For IE (or any browser) in Standards mode
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return {x:d.documentElement.scrollLeft, y:d.documentElement.scrollTop};

    // For browsers in Quirks mode
    return { x: d.body.scrollLeft, y: d.body.scrollTop };
}


// Return the viewport size as w and h properties of an object
function getViewportSize(w) {
    // Use the specified window or the current window if no argument
    w = w || window;

    // This works for all browsers except IE8 and before
    if (w.innerWidth != null)
        return {w: w.innerWidth, h:w.innerHeight};

    // For IE (or any browser) in Standards mode
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return { w: d.documentElement.clientWidth,
                 h: d.documentElement.clientHeight };

    // For browsers in Quirks mode
    return { w: d.body.clientWidth, h: d.body.clientWidth };
}


function calcScaledSize(image) {
    /*
        Calculates the width and height for a thumb image
        as if we had applied max-width and max-height to
        the full-size image. This allows the thumb image to
        be the same scale as the full image for lazy-loading.
    */
    var width = image.get('width');
    var height = image.get('height');
    var viewHeight = $(window).height();
    var viewWidth = $(window).width();
    var aspectRatio = width / height;
    if (width > viewWidth) {
        width = viewWidth * 0.9;
        height = width / aspectRatio;
    }
    if (height > viewHeight) {
        height = viewHeight * 0.9;
        width = height * aspectRatio;
    }
    return [width, height];
}