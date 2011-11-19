// gallery.js - creates links to albums based on the album slugs defined in
// wok's markdown files, grabs album previews

// retrieve slugs to determine what directory albums are in
var album_slugs = document.getElementsByClass("album-slug");

// create array of relative paths to albums
var album_urls = new Array();
for (var index in album_slugs) {
    album_urls.push("/images/gallery/" + album_slugs[index].innerHTML + "/");
}

// make request to index of album directories and add html to array
var album_htmls = new Array();
for (var index in album_urls) {
    var request = makeHttpObject();
    request.open("GET", album_urls[index], false);
    request.send(null);
    album_htmls.push(request.responseText);
}

// for each album, create an array of images within them to use as previews
var image_preview_arrays = new Array();
var image_regex = /href="(.*.(jpg|png))"/gi;
for (var index in album_htmls) {
    var images = new Array();
    while (match = image_regex.exec(album_htmls[index])) {
        images.push("<img src=" + album_urls[index] + match[1] + "/>");
    }
    image_preview_arrays.push(images);
}



