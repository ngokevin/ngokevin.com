// retrieve slug to determine what directory album is in
var slug = $('#album-slug').text();
var album_url = "/images/gallery/" + slug + "/";

// make request to index of album directory
var request = makeHttpObject();
request.open("GET", album_url , false);
request.send(null);
var html = request.responseText;

// parse out image names and push complete url to array
var image_regex = /href="(.*.(jpg|png))"/gi;
var images = new Array();
while (match = image_regex.exec(html)) {
    images.push("<img src=" + album_url + match[1] + "/>");
}

for (image in images) {
    document.write(images[image]);
}
