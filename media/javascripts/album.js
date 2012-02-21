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


// center an image vertically within viewport on overlay, adjust size
var centerImage = function() {

    // adjust for how far page is scrolled down
    var height = this.getBoundingClientRect()['height'];
    var viewportHeight = getViewportSize()['h'];
    var offset = parseInt(this.style.top);
    this.style.top = offset + (parseInt(viewportHeight) - parseInt(height)) / 2 + 'px';

    // center image horizontally
    var width = this.getBoundingClientRect()['width'];
    var viewportWidth = getViewportSize()['w'];
    this.style.left = parseInt(viewportWidth / 2) - parseInt(width / 2) + 'px';

    this.adjustImage;
}

// event handler: adjustImage
// onresize: if browser resized while image is shown, resize/recenter image
// to resize with it
var adjustImage = function() {

    var viewportWidth = getViewportSize()['w'];
    var viewportHeight = getViewportSize()['h'];
    this.style.maxWidth = viewportWidth;
    this.style.maxHeight = viewportHeight;

    var width = this.getBoundingClientRect()['width'];
    var viewportWidth = getViewportSize()['w'];
    this.style.left = parseInt(viewportWidth / 2) - parseInt(width / 2) + 'px';
}


// event handler: showImage
// ONCLICK for a thumbnail that displays full size image over an overlay
var showImage = function() {

    var thumb_img = this;

    // closure holds thumbnail_prefix
    return show = function() {

        var offset = getScrollOffsets()['y'] + 'px';

        // create overlay and append to page
        var overlay = document.createElement("div");
        overlay.style.top = offset;
        overlay.setAttribute("id","overlay");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);

        // create image and append to page
        var img = document.createElement("img");
        img.style.top = offset;
        img.setAttribute("id","overlay-img");
        img.src = thumb_img.src.replace(THUMBNAIL_PREFIX, '');
        img.setAttribute("class","overlay-img");

        // scale image down to viewport size
        var viewportWidth = getViewportSize()['w'];
        var viewportHeight = getViewportSize()['h'];
        img.style.maxWidth = viewportWidth;
        img.style.maxHeight = viewportHeight;

        // click to restore page
        img.onclick = restoreImage;
        overlay.onclick = restoreImage;

        img.onload = centerImage;

        // load image into page centered
        document.body.appendChild(img);

        // if browser resized while image is shown, resize/recenter image
        window.onresize = function() {
            adjustImage.call(document.getElementById('overlay-img'));
        }
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

        // get smallest height from row
        var smallestHeight;
        for(var index in rowImgs) {
            if(!smallestHeight || parseInt(rowImgs[index].style.height) < smallestHeight)
                smallestHeight = parseInt(rowImgs[index].style.height);
        }

        // scale to smallest height
        var row_pixels = 0;
        for(var index in rowImgs) {
            var height = parseInt(rowImgs[index].style.height);
            var width = parseInt(rowImgs[index].style.width);

            var scale = smallestHeight / height;
            rowImgs[index].style.height = height * scale + 'px';
            rowImgs[index].style.width = width * scale + 'px';
            row_pixels += parseInt(rowImgs[index].style.width);
        }

        // stretch to end
        var scale = (PAGE_WIDTH - marginSpace) / row_pixels;
        for(var index in rowImgs) {
            var height = parseInt(rowImgs[index].style.height);
            var width = parseInt(rowImgs[index].style.width);
            rowImgs[index].style.height = height * scale + 'px';
            rowImgs[index].style.width = Math.floor(width * scale) + 'px';
        }
    }

    return insert = function() {

        var spinner = loadSpinner();

        // adds image to row and update row metadata
        var addImageToRow = function() {

            currentRowImgs.push(this);
            currentRowPixels += this.width;

            if(last) {
                spinner.stopSpinner();
            }

            // if we have enough images collected to fill a row, add images
            if(currentRowPixels > PAGE_WIDTH) {

                for(var index in currentRowImgs) {
                    currentRowImgs[index].style.margin = '3px';
                    currentRowDiv.appendChild(currentRowImgs[index]);
                }

                scale(currentRowImgs);
                initializeRow();
            }

            // if all the images were collected, but not enough to fill
            // a row, append all images now
            else if(!(currentRowPixels > PAGE_WIDTH) && currentRowImgs.length == srcs.length){
                for(var index in currentRowImgs) {
                    currentRowImgs[index].style.margin = '3px';
                    currentRowDiv.appendChild(currentRowImgs[index]);
                }
                if(currentRowPixels > PAGE_WIDTH/1.5) {
                    scale(currentRowImgs);
                }
                initializeRow();
            }

        };

        // load image in background
        var loadImage = function(image, last) {
            image.firstChild.onload = addImageToRow;
            image.firstChild.src = srcs[index];

        };

        // insert PER_LOAD images at a time
        spinner.addSpinner();
        var last = false;
        for(var index = insertedImages; index < insertedImages + PER_LOAD; index++) {

            // stop spinner if last image loaded in current round
            if(index >= images.length - 1 || index >= insertedImages + PER_LOAD - 1) {
                last = true;
            }

            // do nothing if all images already inserted
            if(index >= images.length) {
                insertedImages = images.length;
                spinner.stopSpinner(last=true);
                return;
            }
            loadImage(images[index], last);

        }
        insertedImages += PER_LOAD;
    };
};


// event handler: endlessScroller
// ONSCROLL check if scrollbar is need bottom. if so, insert more images
var endlessScroller = function(imageInserter) {

    var album = document.getElementById('album');

    return checkScrollPos = function() {

        var htmlElement = document.documentElement;
        var bodyElement = document.body;
        var pageHeight = Math.max( htmlElement.clientHeight, htmlElement.scrollHeight, htmlElement.offsetHeight, bodyElement.scrollHeight, bodyElement.offsetHeight);

        var offset = getScrollOffsets()['y'];
        var scrollHeight = offset + getViewportSize()['h'];

        // insert images if scrollbar is around 85% down the page
        if (scrollHeight / pageHeight >= .85) {
            imageInserter();
        }

        // scroll the overlay with the page if it exists
        try {
            if(scrollHeight <= pageHeight) {
                document.getElementById('overlay').style.top = offset + 'px';
                document.getElementById('overlay-img').style.top = offset + 'px';
                centerImage.call(document.getElementById('overlay-img'));
            }
        }
        catch(err) {
        }
    };
};


// object: loadSpinner
// returns an object with function to add a spinner below
// the current album row and a function to stop it
var loadSpinner = function() {

    var target = document.getElementById('spin');
    var load_msg = document.getElementById('load_msg');

    var opts = {
      lines: 12, // The number of lines to draw
      length: 7, // The length of each line
      width: 4, // The line thickness
      radius: 10, // The radius of the inner circle
      color: '#000', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false // Whether to render a shadow
    };

    return {

        spinner: 0,

        addSpinner: function() {

            load_msg.style.display = "none";
            target.style.display = "block";

            this.spinner = new Spinner(opts).spin(target);
            this.spinner.el.style.top = '50px';
        },

        stopSpinner: function(last) {
            this.spinner.stop();

            target.style.display = "none";
            if(!last) {
                load_msg.style.display = "block";
            }
        }
    };
};


images = getImages();

var imageInserter = insertImages(images['imgs'], images['srcs']);

window.onload = imageInserter;
window.onscroll = endlessScroller(imageInserter);

