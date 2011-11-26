// album.js
// displays thumbnails of images and full-size image onclick of thumbnails

var THUMBNAIL_PREFIX = 'THUMB_';

// function: getImages
// grab image objects from template and return array
var getImages = function() {

    // retrieve slug to determine what directory album is in
    var slug = document.getElementById('album-slug').innerHTML;
    var album_url = "/images/gallery/" + slug + "/";

    // make request to index of album directory
    var request = makeHttpObject();
    request.open("GET", album_url , false);
    request.send(null);
    var html = request.responseText;

    // query apache index to get image srcs and push to array
    var image_regex = new RegExp('href="(' + THUMBNAIL_PREFIX + '.*.(jpg|png|JPG))"', 'gi');
    var images = new Array();
    while (match = image_regex.exec(html)) {

        var a = document.createElement("a");
        var img = document.createElement("img");
        img.src = album_url + match[1];

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
            img.style.left = parseInt(position['x'] - (thumb_img.width * .4)/2) + 'px';
            img.style.top = parseInt(position['y'] - (thumb_img.height * .4)/2) + 'px';

            // start as same size as thumb img
            img.style.width = width;
            img.style.height = height;

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

