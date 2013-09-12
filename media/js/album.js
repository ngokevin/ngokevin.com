/*
    Displays thumbnails of images.
    Displays full-size images on click and hover.
*/
(function($) {

var THUMB_PREFIX = 'THUMB_';
var PAGE_WIDTH = 940;
var MARGIN = 3;


var Image = Backbone.Model.extend({
    defaults: {
        'id': 0,

        'thumbSrc': '',
        'thumbWidth': 0,
        'thumbHeight': 0,

        'src': '',
        'width': 0,
        'height': 0,

        'viewed': false,
    }
});


var Images = Backbone.Collection.extend({

    model: Image,

    // Get inserted Images
    viewed: function() {
        var self = this;
        return self.filter(function(image) {
            return image.get('viewed');
        });
    },

    // Get uninserted Images
    unviewed: function() {
        var self = this;
        return self.reject(function(image) {
            return image.get('viewed');
        });
    },

    // Get model by src.
    getBySrc: function(src) {
        var self = this;
        return self.filter(function(image) {
            return [image.get('src'), image.get('thumbSrc')].indexOf(src) !== -1;
        });
    },

    // Iterator for uninserted images, get next unviewed, set as viewed.
    next: function() {
        var image = this.unviewed()[0];
        if (typeof image == "undefined") {
            return null;
        }
        this.get(image['id']).set('viewed', true);
        return image;
    }
});


window.AlbumView = Backbone.View.extend({

    el: $('#album'),

    // Parse image metadata from JSON inserted by Python hooks.
    // Insert initial rows, set up endless scrolling.
    initialize: function() {
        this.images = new Images();
        this.imageList = jQuery.parseJSON($('#images').text());

        this.createImages();

        var self = this;
        self.imageList = this.imageList;
        $(window).scroll( function() {
          self.endlessScroller();
        });
        $(window).resize( function() {
          self.centerShownImage();
        });

        this.spinner = this.createSpinner();

        this.insertRow();
        this.insertRow();
        this.insertRow();
    },

    // From image metadata, initialize Image models and add to Collection.
    createImages: function() {
        var self = this;

        $(this.imageList).each(function(index, img) {
            var image = new Image({
                'id': index,

                'thumbSrc': img.thumb_src,
                'thumbWidth': img.thumb_width,
                'thumbHeight': img.thumb_height,

                'src': img.src,
                'width': img.width,
                'height': img.height,

                'viewed': false,
            });
            self.images.add(image);
        });
    },

    // Given src, create img element.
    createImg: function(src) {
        var img = $('<img />');
        img.attr('src', src);
        img.addClass('thumb-img');
        img.mouseenter({'view': this}, this.expandImg);
        return img;
    },

    // Insert row of even-height thumbnails fitting width of page.
    insertRow: function() {
        var self = this;

        var models = [];  // Backbone model representation.
        var row = [];  // DOM representation.
        var currentRowWidth = 0;

        // Fill row with enough images to at least fill the page width.
        while (currentRowWidth < PAGE_WIDTH || self.images.unviewed().length <= 2) {
            var image = self.images.next();

            if (image === null && currentRowWidth == 0) {
                return;
            }
            else if (image == null) {
                break;
            }

            models.push(image);
            row.push(self.createImg(image.get('thumbSrc')));
            currentRowWidth += image.get('thumbWidth');
        }

        this.spinner.addSpinner();

        // Scale images to equal height, based on smallest height.
        var smallestHeight = models[0].get('thumbHeight');
        $(models).each(function(index, image) {
            var height = image.get('thumbHeight');
            if (height < smallestHeight) {
                smallestHeight = height;
            }
        });
        var currentRowWidth = 0;
        $(row).each(function(index, img) {
            var width = models[index].get('thumbWidth');
            var height = models[index].get('thumbHeight');

            var scale = smallestHeight / height;
            var width = Math.floor(width * scale);
            img.width(width);
            img.height(Math.floor(height * scale));

            currentRowWidth += width;
        });

        // Factor in margins of images when calculate scale.
        var marginsWidth = models.length * MARGIN * 2;

        // Fit row to page width.
        var scale = (PAGE_WIDTH - marginsWidth) / currentRowWidth;
        $(row).each(function(index, img) {
            var width = img.width();
            var height = img.height();

            img.width(Math.floor(width * scale));
            img.height(Math.floor(height * scale));
        });

        // Wrap img in anchor and insert into page.
        var self = this;
        $(row).each(function(index, img) {
            var a = $('<a/>').append(img);
            self.$el.append(a);
        });

        if (self.images.unviewed().length == 0) {
            self.spinner.stopSpinner(last=true);
        }
        else {
            self.spinner.stopSpinner(last=false);
        }
    },

    // Insert row of images if scroll near bottom of page.
    endlessScroller: function() {
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();

        // Adjust overlay if exist.
        if (scrollTop + windowHeight <= documentHeight) {
            $('.overlay').css('top', scrollTop);
            var overlayImg = $('.overlay-img');
            overlayImg.css('top', scrollTop);
            this.centerShownImage();
        }

        // Don't do anything if all images inserted.
        if (this.images.unviewed().length == 0) {
            return;
        }

        var scrollBot = scrollTop + windowHeight;

        if (scrollBot / documentHeight >= .85 || scrollTop == documentHeight) {
            this.insertRow();
            this.insertRow();
        }
    },

    // Create img on top of mouseovered thumb and expand size.
    expandImg: function(event) {
        var position = $(this).offset();

        var img = $('<img />');
        img.attr('src', this.src);
        img.attr('class', 'expand');

        // Create new img on directly top of hovered image.
        img.width(this.width);
        img.height(this.height);
        img.css('position', 'absolute');
        img.css(position);

        img.mouseleave(function() {
            $('.expand').remove();
        });

        img.click({'view': event.data.view}, event.data.view.showImage);

        event.data.view.$el.append(img);

        setTimeout(function(){
            // Add image border, adjust image position for border width.
            var position = img.offset();
            img.addClass('expanded');
            img.css('left', position.left - 7);
            img.css('top', position.top - 7);

            // Expand created img with center as expand point, show full-size image.
            var scaleFactor = 1.4;
            if (event.data.view.images.length === 1) {
                scaleFactor = 1.2;
            }
            img.animate({
                left: parseInt(img.css('left')) - (.125 * scaleFactor * img.width()),
                top: parseInt(img.css('top')) - (.125 * scaleFactor * img.height()),
                width: scaleFactor * img.width(),
                height: scaleFactor * img.height(),
            }, 60, function(){
                var src = img.attr('src');
                img.attr('src', src);
                self.src = this.src;
            });
        }, 500);
    },

    // Overlay full size image when clicked.
    showImage: function(event) {
        var removeOverlay = function() {
            $('.overlay').remove();
            $('.overlay-img').remove();
        }

        var scrollTop = $(window).scrollTop();

        // Create overlay background.
        var overlay = $('<div />');
        overlay.addClass('overlay');
        overlay.css('top', scrollTop);
        overlay.click(removeOverlay);
        $(document.body).append(overlay);

        // Create full size image.
        var imgThumb = $('<img />');
        var imgLarge = $('<img />');
        var imgGroup = imgThumb.add(imgLarge);
        imgGroup.css('top', scrollTop);

        // Find the image that has this thumb.
        var clickedSrc = $(this).attr('src');

        var viewHeight = $(window).height();
        var viewWidth = $(window).width();

        // Scale down to viewport size if necessary.
        var image = event.data.view.images.getBySrc(clickedSrc)[0];
        imgThumb.attr('src', image.get('thumb_src'));
        imgLarge.attr('src', image.get('src'));
        imgGroup.addClass('overlay-img');

        // Center image based on its width/height and viewport size once loaded.
        imgLarge.on('load', function() {
            imgThumb.remove();
            event.data.view.centerShownImage();
            $(this).show();
        });
        imgThumb.on('load', function() {
            event.data.view.centerShownImage();
            $(this).show();
        });
        imgGroup.click(removeOverlay);
        $(document.body).append(imgGroup);

        // Return the corresponding model of the image.
        return image;
    },

    centerShownImage: function() {
        var images = $('.overlay-img');
        var viewHeight = $(window).height();
        var viewWidth = $(window).width();

        images.css('max-width', viewWidth * .9);
        images.css('max-height', viewHeight * .9);

        // Adjust for how far page is scrolled down.
        var height = images.height();
        var scrollTop = $(window).scrollTop();
        images.css('top', scrollTop + (viewHeight - height) / 2);

        // Center image horizontally.
        var width = images.width();
        images.css('left', (viewWidth / 2) - (width / 2) + 'px');
    },

    // Spinner generator, start/stop functions.
    createSpinner: function() {

        var indicator = $('#indicator');
        var target = $('#rowSpinner');

        var opts = {
          lines: 12,
          length: 7,
          width: 4,
          radius: 10,
          color: '#000',
          speed: 1,
          trail: 60,
          shadow: false
        };

        return {
            spinner: 0,
            addSpinner: function() {
                indicator.hide();
                target.show();

                this.spinner = new Spinner(opts).spin(target[0]);
                $(this.spinner.el).css('top', 50);
            },
            stopSpinner: function(last) {
                this.spinner.stop();
                target.hide();
                if (last != true) {
                    indicator.show();
                }
            }
        };
    },

});
var albumView = new AlbumView();
})(jQuery);
