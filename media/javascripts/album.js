// album.js
// displays thumbnails of images and full-size image onclick of thumbnails

var THUMBNAIL_PREFIX = 'THUMB_';
var PER_LOAD = 12;
var PAGE_WIDTH = 940;
var IMG_MARGIN = 3;

// function: getImages
// return array of a-img objects and corresponding array of srcs
// don't set src yet for lazy load
var getImages = function() {
    images = new Array();
    thumb_srcs = new Array();

    srcs = document.getElementsByClass('album-image');
    for(var index in srcs) {
        srcs[index] = srcs[index].innerHTML;

        // grab only thumbnails
        var image_name = srcs[index].split('/');
        if(image_name[image_name.length -1].indexOf(THUMBNAIL_PREFIX) !== 0) {
            continue;
        }

        var a = document.createElement("a");
        var img = document.createElement("img");

        img.onclick = showImage;
        img.onmouseover = expandImage;

        a.appendChild(img)
        images.push(a);
        thumb_srcs.push(srcs[index]);
    }
    return {
        'imgs': images,
        'srcs': thumb_srcs
    };
};


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
};


// event handler: restoreImage
// ONCLICK for full-size image and overlay that restores to album page
var restoreImage = function() {
   document.body.removeChild(document.getElementById("overlay"));
   document.body.removeChild(document.getElementById("overlay-img"));
   document.body.style.overflow = "visible";
};


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
};


// function: insertImages
// add images to DOM
var insertImages = function(images, srcs) {

    var insertedImages = 0;
    var album = document.getElementById("album");

    var currentRowPixels;
    var currentRowImgs;
    var currentRowDiv;

    // init row metadata
    var initializeRow = function() {
       currentRowPixels = 0;
       currentRowImgs = new Array();
       currentRowDiv = document.createElement("div");
       currentRowDiv.className = "album-row";
       album.appendChild(currentRowDiv);
    };
    initializeRow();

    // takes in a row of images that exceed page width and scale to fit
    var scale = function(rowImgs) {

        // get the width of the entire row to calc scale ratio
        rowPixels = 0;
        imgDims = new Array();
        for(var index in rowImgs) {
            imgDims.push(rowImgs[index].getBoundingClientRect());
            rowPixels += imgDims[index].width;
        }

        // factor in margins
        var marginSpace = rowImgs.length * IMG_MARGIN * 2;
        var scale = (PAGE_WIDTH - marginSpace) / rowPixels;

        // round down scale ratio so it doesn't auto-round up and overflow
        for(var index in rowImgs) {
            rowImgs[index].style.width = Math.floor(imgDims[index].width * scale) + 'px';
            rowImgs[index].style.height = Math.floor(imgDims[index].height * scale) + 'px';
        }
    }

    return insert = function() {

        // adds image to row and update row metadata
        var addImageToRow = function() {

            currentRowImgs.push(this);
            currentRowPixels += this.getBoundingClientRect().width;

            if(currentRowPixels > PAGE_WIDTH) {
                scale(currentRowImgs);
                initializeRow();
            }
        };

        // load image in background
        var loadImage = function(image) {

            image.firstChild.onload = addImageToRow;
            image.firstChild.src = srcs[index];

            currentRowDiv.appendChild(image);

        };

        // insert PER_LOAD images at a time
        for(var index = insertedImages; index < insertedImages + PER_LOAD; index++) {
            // do nothing if all images already inserted
            if(index >= images.length) {
                insertedImages = images.length;
                return;
            }
            loadImage(images[index]);

        }
        insertedImages += PER_LOAD;
    };
};


// event handler: endlessScroller
// ONSCROLL check if scrollbar is need bottom. if so, insert more images
var endlessScroller = function(imageInserter) {

    // insert images if scrollbar is around 75% down the page
    return checkScrollPos = function() {

        var pageHeight = document.documentElement.scrollHeight;
        var scrollHeight = getScrollOffsets()['y'] + getViewportSize()['h'];

        if (scrollHeight / pageHeight >= .85) {
            imageInserter();
        }

    };
};

images = getImages();

var imageInserter = insertImages(images['imgs'], images['srcs']);

window.onload = imageInserter;
window.onscroll = endlessScroller(imageInserter);

