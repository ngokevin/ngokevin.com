// gallery.js - creates links to albums based on the album slugs defined in
// wok's markdown files, grabs album previews

// intelligently shifts image viewport towards center
var imageShift = function() {
    var THUMBNAIL_SIZE = 210;
    var img_box = this.getBoundingClientRect();
    var shift_left = (img_box.width - THUMBNAIL_SIZE) / 2;
    if (shift_left > 0) {
        this.style.left = "-" + shift_left + "px";
    }
    var shift_top = (img_box.height - THUMBNAIL_SIZE) / 2;
    if (shift_top > 0) {
        this.style.top = "-" + shift_top + "px";
    }
}

// retrieve slugs to determine what directory albums are in
var album_slugs = document.getElementsByClass("album-slug");
var album_titles = document.getElementsByClass("album-title");

// create array of relative paths to albums
var album_dirs = new Array();
for (var index in album_slugs) {
    album_dirs.push("/images/gallery/" + album_slugs[index].innerHTML + "/");
}

// make request to index of album directories and add html to array
var album_htmls = new Array();
for (var index in album_dirs) {
    var request = makeHttpObject();
    request.open("GET", album_dirs[index], false);
    request.send(null);
    album_htmls.push(request.responseText);
}

// create an array of array of images within them to use as previews for
// albums, using apache index to parse out image src
var image_preview_arrays = new Array();
var image_regex = /href="(.*.(jpg|png))"/gi;
for (var index in album_htmls) {
    var images = new Array();
    while (match = image_regex.exec(album_htmls[index])) {

        var a = document.createElement("a");
        a.href = album_slugs[index].innerHTML;

        var img = new Image();
        img.onload = imageShift;
        img.src = album_dirs[index] + match[1];

        // wrap the image in an a
        a.appendChild(img);
        images.push(a);
    }
    image_preview_arrays.push(images);
}

// write images to dom
var gallery = document.getElementById("gallery");
for (var index in image_preview_arrays) {

    // make a new row every four albums
    if (index % 4 == 0) {
        var row = document.createElement("div");
        row.className = "row";
        gallery.appendChild(row);
    }

    // create a div for the album to separate it
    var div = document.createElement("div");
    div.id = "album-preview";
    div.className = "span4";
    div.appendChild(image_preview_arrays[index][0]);

    // create overlay text with album title
    h3 = document.createElement("h3");
    span = document.createElement("span");
    span.appendChild(document.createTextNode(album_titles[index].innerHTML));
    h3.appendChild(span);
    div.appendChild(h3);

    // append to row
    row.appendChild(div);
}
