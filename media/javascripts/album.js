// retrieve slug to determine what directory album is in
var slug = document.getElementById('album-slug').innerHTML;
var album_url = "/images/gallery/" + slug + "/";

// make request to index of album directory
var request = makeHttpObject();
request.open("GET", album_url , false);
request.send(null);
var html = request.responseText;

// for each album, create an array of images within them to use as previews
var image_regex = /href="(.*.(jpg|png))"/gi;
var images = new Array();
while (match = image_regex.exec(html)) {
    var a = document.createElement("a");
    var img = document.createElement("img");
    img.src = album_url + match[1];

    a.appendChild(img)

    images.push(a);
}

var album = document.getElementById("album");
for (var index in images) {
    album.appendChild(images[index]);
}

