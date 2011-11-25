// gallery.js - creates links to albums based on the album slugs defined in
// wok's markdown files, grabs album previews

var NUM_PREVIEW_IMGS = 3;


// function: getAlbum
// get title, slug, directory, and apache index html of each album
var getAlbums = function() {

    var album_slugs = document.getElementsByClass("album-slug");
    var album_titles = document.getElementsByClass("album-title");

    // create array of relative paths to albums
    var album_dirs = new Array();
    for (var index in album_slugs) {
        album_dirs.push("/images/gallery/" + album_slugs[index].innerHTML + "/");
    }

    var removed_indexes = new Array();
    var album_htmls = new Array();
    for (var index in album_dirs) {
        var request = makeHttpObject();
        request.open("GET", album_dirs[index], false);
        request.send(null);

        // if file was found
        var file_not_found_regex = /Error response/gi;
        if(!file_not_found_regex.exec(request.responseText)) {
            album_htmls.push(request.responseText);
        }
        else {
            removed_indexes.push(index);
        }
    }
    // remove albums where they weren't found
    for (var index in removed_indexes) {
        album_dirs.splice(removed_indexes[index], 1);
        album_slugs.splice(removed_indexes[index], 1);
        album_titles.splice(removed_indexes[index], 1);
    }

    return {
        'htmls': album_htmls,
        'dirs': album_dirs,
        'slugs': album_slugs,
        'titles': album_titles
    };
};


// function: imageShift
// onload event handler that shifts image viewport towards center
var imageShift = function() {

    var THUMBNAIL_SIZE = 210;
    var img_box = this.getBoundingClientRect();

    // because we're swapping in-place, need to reset the style
    this.style.left = "0"
    this.style.top= "0"

    // shift by closing in image towards center
    var shift_left = (img_box.width - THUMBNAIL_SIZE) / 2;
    if (shift_left > 0) {
        this.style.left = "-" + shift_left + "px";
    }
    var shift_top = (img_box.height - THUMBNAIL_SIZE) / 2;
    if (shift_top > 0) {
        this.style.top = "-" + shift_top + "px";
    }

    // show image after shifting
    this.style.visibility= "visible";

}


// function: imageChange
// onmouseover even handler that fades and swaps thumbnail image on hovers
var imageChange = function(img_index, thumbnail_array, img) {

    var index = img_index;
    var opacity = .75;
    var mouseout_flag = 0;
    var thumbnail = img;

    // function: fade
    // closure that holds the curren index, thumbnail array, and img object
    return fade = function() {
        var mouseout_flag = 0;
        thumbnail.style.opacity = .75;

        // if the mouse moves out before timer calls step, don't fade
        thumbnail.onmouseout = function() {
            mouseout_flag = 1;
            thumbnail.style.opacity = 1;
        };

        setTimeout(function() {
            if(mouseout_flag == 0) {
                step();
            }
        }, 600);


        // function: step
        // decreases opacity of img by a bit up until clear
        var step = function() {
            thumbnail.style.opacity = opacity;

            if (opacity > 0) {
                setTimeout(step, 10);
            }
            else { // swap to next image once opacity is low enough
                if (parseInt(index) != thumbnail_array.length - 1) {
                    index++;
                }
                else {
                    index = 0;
                }
                thumbnail.src = thumbnail_array[index].firstChild.orig_src;


                // function: fadeIn
                // increases the opacity of img by a bit until opaque
                var fadeIn = function () {
                    thumbnail.style.opacity = opacity;
                    if (opacity < 1) {
                        setTimeout(fadeIn, 10);
                    }
                    else { // swap img again if still hovering
                        if (mouseout_flag != 1) {
                            setTimeout(function() {
                                if(mouseout_flag == 0) {
                                    step();
                                }
                            }, 300);
                        }
                    }
                    opacity = opacity + .01;
                }
                setTimeout(fadeIn, 0);

            }
            opacity = opacity - .01;
        };

    };
}

var albums = getAlbums();

// CREATE ARRAY OF ARRAY IMAGE OBJECTS
var image_preview_arrays = new Array();
var image_regex = /href="(THUMB_.*.(jpg|png|JPG))"/gi;
for (var index in albums['htmls']) {
    var images = new Array();
    while (match = image_regex.exec(albums['htmls'][index])) {

        // only load a certain amount of images
        if (images.length > NUM_PREVIEW_IMGS) {
            break;
        }

        // link to actual album
        var a = document.createElement("a");
        a.href = albums['slugs'][index].innerHTML;

        var img = new Image();
        img.style.visibility= "hidden"; // don't display until shifted
        img.onload = imageShift;
        img.src = albums['dirs'][index] + match[1];

        // wrap the image in an a
        a.appendChild(img);
        images.push(a);
    }
    image_preview_arrays.push(images);
}

// ADD MOUSEOVER EVENT HANDLER
for (var album_index in image_preview_arrays) {

    var thumbnails = image_preview_arrays[album_index];
    for (var image_index in thumbnails){

        var img = thumbnails[image_index].firstChild;

        // assign handler
        img.orig_src = img.src;
        img.onmouseover = imageChange(image_index, thumbnails, img);
    }
}

// WRITE IMAGES TO DOM
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
    div.id = "album-preview" + index;
    div.className = "span4";
    div.appendChild(image_preview_arrays[index][0]);

    // create overlay text with album title
    h3 = document.createElement("h3");
    span = document.createElement("span");
    span.appendChild(document.createTextNode(albums['titles'][index].innerHTML));
    h3.appendChild(span);
    div.appendChild(h3);

    // append to row
    row.appendChild(div);
}
