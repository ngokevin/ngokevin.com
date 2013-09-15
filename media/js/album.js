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
    nextUnviewed: function() {
        var image = this.unviewed()[0];
        if (typeof image == "undefined") {
            return null;
        }
        this.get(image['id']).set('viewed', true);
        return image;
    },

    // Get previous image in collection.
    prev: function(image) {
        if (image.get('id') === 0) {
            return this.models[this.length - 1];
        }
        return this.models[image.get('id') - 1];
    },

    // Get next image in collection.
    next: function(image) {
        if (image.get('id') === this.length - 1) {
            return this.models[0];
        }
        return this.models[image.get('id') + 1];
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

        this.insertRows();
        this.initOverlay();
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
            var image = self.images.nextUnviewed();

            if (image === null && currentRowWidth === 0) {
                return;
            } else if (image === null) {
                break;
            }

            models.push(image);
            row.push(self.createImg(image.get('thumbSrc')));
            currentRowWidth += image.get('thumbWidth');
        }

        // Scale images to equal height, based on smallest height.
        var smallestHeight = models[0].get('thumbHeight');
        $(models).each(function(index, image) {
            var height = image.get('thumbHeight');
            if (height < smallestHeight) {
                smallestHeight = height;
            }
        });
        currentRowWidth = 0;
        $(row).each(function(index, img) {
            var width = models[index].get('thumbWidth');
            var height = models[index].get('thumbHeight');

            var scale = smallestHeight / height;
            width = Math.floor(width * scale);
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
    },

    insertRows: function() {
        for (var i = 0; i < 4; i++) {
            this.insertRow();
        }
    },

    // Insert row of images if scroll near bottom of page.
    endlessScroller: function() {
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();

        // Don't do anything if all images inserted.
        if (this.images.unviewed().length == 0) {
            return;
        }

        var scrollBot = scrollTop + windowHeight;
        if (scrollBot / documentHeight >= .85 || scrollTop == documentHeight) {
            this.insertRows();
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

        // Show image on overlay.
        img.click({'view': event.data.view}, function() {
            var view = event.data.view;
            view.showImage.apply(
                view.images.getBySrc(img.attr('src'))[0], [event]
            );
        });

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

    initOverlay: function() {
        var overlayBg = $('.overlay-bg');
        // Create overlay background.
        overlayBg.click(function() {
            $('.overlay').hide();
            $('.overlay-img.full').hide();
            $('.overlay-img.thumb').show();
        });
    },

    // Overlay full size image when clicked.
    showImage: function(event) {
        var image = this;
        var self = event.data.view;
        $('.overlay').show();

        // Create full size image.
        var imgThumb = $('.overlay-img.thumb');
        var imgLarge = $('.overlay-img.full');
        var imgGroup = $('.overlay-img');

        // Scale down to viewport size if necessary.
        var d = self.calcScaledSize(this);
        imgGroup.css('width', d[0]);
        imgGroup.css('height', d[1]);
        imgThumb.attr('src', image.get('thumbSrc'));
        imgLarge.attr('src', image.get('src'));

        // Switch to prev/next image on click.
        // Hide the overlay images, prepare to view the next one.
        imgGroup.add('.overlay .nav').off('click');
        $('.nav.prev').click(function() {
            imgGroup.hide().attr('src', '');
            self.showImage.apply(self.images.prev(image), [event]);
        });
        $('.nav.next').click(function() {
            imgGroup.hide().attr('src', '');
            self.showImage.apply(self.images.next(image), [event]);
        });
        imgGroup.click(function() {
            $(this).hide().attr('src', '');
            var nextImage = self.images.next(image);
            self.showImage.apply(nextImage, [event]);
        });

        // Center image based on its width/height and viewport size once loaded.
        imgLarge.on('load', function() {
            imgThumb.hide();
            $(this).show();
        });
        imgThumb.on('load', function() {
            $(this).show();
        });

        // Return the corresponding model of the image.
        return image;
    },

    calcScaledSize: function(image) {
        /*
            Calculates the width and height for a thumb image
            as if we had applied max-width and max-height to
            the full-size image. This allows the thumb image to
            be the same scale as the full image for lazy-loading.
        */
        var width = image.get('width');
        var height = image.get('height');
        var viewHeight = $(window).height();
        var viewWidth = $(window).width();
        var aspectRatio = width / height;
        if (width > viewWidth) {
            width = viewWidth * 0.9;
            height = width / aspectRatio;
        }
        if (height > viewHeight) {
            height = viewHeight * 0.9;
            width = height * aspectRatio;
        }
        return [width, height];
    },
});

var albumView = new AlbumView();

})(jQuery);
