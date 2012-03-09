import glob
import Image
import os
import simplejson

GALLERY_DIR = os.path.abspath("./media/images/gallery/") + '/'
REL_GALLERY_DIR = "/images/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

def get_image_srcs(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images in the album as relative paths
    """
    if 'type' in page.meta and page.meta['type'] == 'album':
        album = page.meta

        # get paths of all of the images in the album
        album_images = []

        # get absolute paths of images in album for each file type
        for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:

            # convert paths from absolute to relative
            album_images += [REL_GALLERY_DIR + album['slug'] + '/' + image.split('/')[-1] for image in image_list]

        templ_vars['site']['album_image_srcs'] = simplejson.dumps(sorted(album_images))


def get_image_sizes(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images sizes (width/height) since JS doesn't know until loaded
    Each image size tuple corresponds to an image from get_image_srcs
    Will be in the same order
    """
    if 'type' in page.meta and page.meta['type'] == 'album':
        album = page.meta

        abs_album_image_srcs = []

        # get absolute paths of images in album for each file type
        for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:

            abs_album_image_srcs += image_list

        abs_album_image_srcs = sorted(abs_album_image_srcs)

        image_sizes = []
        for src in abs_album_image_srcs:
            image = Image.open(src)
            width = image.size[0]
            height = image.size[1]
            image_sizes.append([width, height])

        templ_vars['site']['album_image_sizes'] = simplejson.dumps(image_sizes)
