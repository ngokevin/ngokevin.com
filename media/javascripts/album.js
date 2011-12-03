// album.js
// displays thumbnails of images and full-size image onclick of thumbnails

var THUMBNAIL_PREFIX = 'THUMB_';

// function: getImages
// grab image objects from template and return array
var getImages = function() {
    images = new Array();

    srcs = document.getElementsByClass('album-image');
    srcs = [srcs[index].innerHTML for (index in srcs)];
    for(var index in srcs) {

        var a = document.createElement("a");
        var img = document.createElement("img");
        img.src = srcs[index]

        img.onclick = showImage;
        img.onmouseover = expandImage;

        a.appendChild(img)
        images.push(a);
    }
    return images;
}


// event handler: showImage
// ONCLICK for a thumbnail that displays full size image over an overlay
var showImage = function() {

    var thumb_img = this;

    // closure holds thumbnail_prefix
    return show = function() {

        // create overlay and append to page
        var overlay = document.createElement("div");
        overlay.setAttribute("id","overlay");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);

        // disable scrolling with overlay
        document.body.style.overflow = "hidden";

        // create image and append to page
        var img = document.createElement("img");
        img.setAttribute("id","overlay-img");
        img.src = thumb_img.src.replace(THUMBNAIL_PREFIX, '');
        img.setAttribute("class","overlay-img");

        // click to restore page
        img.onclick = restoreImage;
        overlay.onclick = restoreImage;

        document.body.appendChild(img);
    }();
}


// event handler: restoreImage
// ONCLICK for full-size image and overlay that restores to album page
var restoreImage = function() {
   document.body.removeChild(document.getElementById("overlay"));
   document.body.removeChild(document.getElementById("overlay-img"));
   document.body.style.overflow = "visible";
}


// event handler: expandImage
// ONMOUSEOVER to show full-res image on top of thumbnail
var expandImage = function() {

    var thumb_img = this;
    var width = thumb_img.width;
    var height = thumb_img.height;

    return expand = function() {

        // restore back on mouseout of full image
        var mouseout_flag = 0;
        thumb_img.onmouseout = function() {
            mouseout_flag = 1;
        }

        // putting in function allows easier mouseover delay
        var addFullImage = function() {
            var expand = document.createElement("div");
            expand.setAttribute("id","expand");
            expand.setAttribute("class", "expand");
            document.body.appendChild(expand);

            // add full img OVER thumb image
            position = getXYpos(thumb_img);

            // create img for full-res image
            img = new Image();
            img.style.position = 'absolute';
            img.style.left = position['x'] + 'px';
            img.style.top = position['y'] + 'px';

            // start as same size as thumb img
            img.style.width = width;
            img.style.height = height;

            img.onclick = showImage;
            img.onmouseout = function() {
                document.body.removeChild(document.getElementById("expand"));
            };

            // load new src after expand
            img.src = thumb_img.src;

            expand.appendChild(img);
        };

        setTimeout(function() {
            if(mouseout_flag == 0){
                addFullImage();
                step();
            }
        }, 700);

        var step = function() {

            // simulate expanding image from center by shifting every step
            img.style.left = (parseInt(img.style.left) - parseInt((width - parseInt(img.style.width))/2)) + 'px';
            img.style.top = (parseInt(img.style.top) - parseInt((height - parseInt(img.style.height))/2)) + 'px';
            img.style.width = width + 'px';
            img.style.height = height + 'px';

            if(parseInt(img.style.width) < parseInt(thumb_img.width * 1.4)
            || parseInt(img.style.height) < parseInt(thumb_img.height * 1.4)) {
                setTimeout(step, 1);
            }
            else {
                // load full image
                img.src = thumb_img.src.replace(THUMBNAIL_PREFIX, '');
            }

            width = parseInt(width * 1.1);
            height = parseInt(height * 1.1);
        };
    }();
}


// function: insertImages
// add images to DOM
var insertImages = function(images) {
    var album = document.getElementById("album");
    for (var index in images) {
        album.appendChild(images[index]);
    }
}


images = getImages();
insertImages(images);

