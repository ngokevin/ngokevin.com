// album.js
// displays thumbnails of images and full-size image onclick of thumbnails

var THUMBNAIL_PREFIX = 'THUMB_';

// event handler: expandPhoto
// ONCLICK for a thumbnail that displays full size image over an overlay
var expandPhoto = function() {

    var thumb_img = this;

    // closure holds thumbnail_prefix
    return expand = function() {

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


// retrieve slug to determine what directory album is in
var slug = document.getElementById('album-slug').innerHTML;
var album_url = "/images/gallery/" + slug + "/";

// make request to index of album directory
var request = makeHttpObject();
request.open("GET", album_url , false);
request.send(null);
var html = request.responseText;

// query apache index to get image srcs and push to array
var image_regex = /href="(THUMB_.*.(jpg|png))"/gi;
var images = new Array();
while (match = image_regex.exec(html)) {

    var a = document.createElement("a");
    var img = document.createElement("img");
    img.src = album_url + match[1];
    img.onclick = expandPhoto;

    // wrap image in a
    a.appendChild(img)
    images.push(a);
}

// add images to dom
var album = document.getElementById("album");
for (var index in images) {
    album.appendChild(images[index]);
}

