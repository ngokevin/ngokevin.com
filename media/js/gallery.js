/*
    Fading album previews with info dumped into template from gallery hook.
*/

// TODO: Feed these in through config.py.
var NUM_PREVIEW_IMGS = 3;
var THUMBNAIL_SIZE = 210;
var EXPAND_SIZE = 1.1;
var GALLERY_PATH = '/gallery/';


// function: getAlbum
// Grab album metadata (slugs, titles, dirs, srcs).
var getAlbums = function() {

    var album_infos = $('.album-info');
    dirs = new Array();
    slugs = document.getElementsByClass("album-slug");
    for (var index in slugs) {
        slugs[index] = slugs[index].innerHTML;
        dirs[index] = "/img/gallery/" + slugs[index] + "/";
    }

    titles = document.getElementsByClass("album-title");
    for(var index in titles) {
        titles[index] = titles[index].innerHTML;
    }

    srcs = new Array();
    // Skip empty text nodes.
    var grab_srcs = function(album_srcs) {
        actual_srcs = new Array();
        for (index in album_srcs) {
            if (album_srcs[index].innerHTML != undefined) {
                actual_srcs.push(album_srcs[index].innerHTML);
            }
        }
        srcs.push(actual_srcs);
    };
    album_srcs = document.getElementsByClass("album-images");
    for(var index in album_srcs) {
        album_srcs[index] = grab_srcs(album_srcs[index].childNodes);
    }

    return {
        'slugs': slugs,
        'titles': titles,
        'dirs': dirs,
        'srcs': srcs,
    };
};


// function: loadAlbums
// Use src metadata to load albums with a/img html objects.
var loadAlbums = function(albums) {

    albums['images'] = new Array();

    // Create list of a/img objects for each album and push to albums.
    for (var index in albums['slugs']) {
        var images = new Array();

        for(var index_src in albums['srcs'][index]){

            var a = document.createElement("a");
            a.href = GALLERY_PATH + albums['slugs'][index];

            var img = new Image();
            // Don't display until shifted.
            img.style.visibility= "hidden";
            img.onload = imageShift();
            img.src = albums['srcs'][index][index_src]

            a.appendChild(img);
            images.push(a);
        }
        albums['images'].push(images);
    }

    // Add mouseover event handlers after albums have been loaded.
    for (var album_index in albums['images']) {

        var images = albums['images'][album_index];
        for (var image_index in images){
            var img = images[image_index].firstChild;

            // Assign handler.
            img.orig_src = img.src;
            img.onmouseover = imageSwapFade(image_index, images, img);
        }
    }
};


// function: insertAlbums
// Insert albums to dom into gallery div.
var insertAlbums = function() {

    var gallery = document.getElementById("gallery");

    for (var index in albums['images']) {
        // Covering my bases.
        if(albums['images'][index].length == 0){
            continue;
        }

        // Make a new row every four albums.
        if (index % 4 == 0) {
            var row = document.createElement("div");
            gallery.appendChild(row);
        }

        // Create a div for the album to separate it.
        var div = document.createElement("div");
        div.id = "album-preview" + index;
        div.className = "album-preview";
        div.appendChild(albums['images'][index][0]);

        // Create overlay text with album title.
        h3 = document.createElement("h3");
        span = document.createElement("span");
        span.appendChild(document.createTextNode(albums['titles'][index]));
        h3.appendChild(span);
        div.appendChild(h3);

        // Append to row.
        row.appendChild(div);
    }
};


// event handler: imageShift
// ONLOAD that shifts image viewport towards center.
var imageShift = function() {

    // Closure holds thumbnail_size constant.
    return shift = function() {
        var img_box = this.getBoundingClientRect();

        // Because we're swapping in-place, need to reset the style.
        this.style.left = "0"
        this.style.top= "0"

        // Shift by closing in image towards center.
        var shift_left = (img_box.width - THUMBNAIL_SIZE) / 2;
        if (shift_left > 0) {
            this.style.left = "-" + shift_left + "px";
        }
        var shift_top = (img_box.height - THUMBNAIL_SIZE) / 2;
        if (shift_top > 0) {
            this.style.top = "-" + shift_top + "px";
        }

        // Show image after shifting.
        this.style.visibility= "visible";
    }
};


// event handler: imageSwapFade
// ONMOUSEOVER that fades and swaps thumbnail image on hovers
var imageSwapFade = function(img_index, thumbnail_array, img) {

    var index = img_index;
    var opacity = .75;
    var mouseout_flag = 0;
    var thumbnail = img;

    // Closure that holds the current index, thumbnail array, and img object.
    return fade = function() {
        var mouseout_flag = 0;
        thumbnail.style.opacity = .75;

        // If the mouse moves out before timer calls step, don't fade.
        thumbnail.onmouseout = function() {
            mouseout_flag = 1;
            thumbnail.style.opacity = 1;
        };

        // Decreases opacity of img by a bit up until clear.
        var step = function() {
            thumbnail.style.opacity = opacity;

            if (opacity > 0) {
                setTimeout(step, 10);
            } else {
                // Swap to next image once opacity is low enough.
                if (parseInt(index) != thumbnail_array.length - 1) {
                    index++;
                } else {
                    index = 0;
                }
                thumbnail.src = thumbnail_array[index].firstChild.orig_src;

                // Increases the opacity of img by a bit until opaque.
                var fadeIn = function () {
                    thumbnail.style.opacity = opacity;
                    if (opacity < 1) {
                        setTimeout(fadeIn, 10);
                    } else if (mouseout_flag != 1) {
                        // Swap img again if still hovering.
                        if (mouseout_flag == 0) {
                            step();
                        }
                    }
                    opacity = opacity + .01;
                };
                setTimeout(fadeIn, 0);
            }
            opacity = opacity - .01;
        };

        setTimeout(function() {
            if (mouseout_flag == 0) {
                step();
            }
        }, 200);
    };
};


var albums = getAlbums();
loadAlbums(albums);
insertAlbums(albums);
