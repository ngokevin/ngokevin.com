import glob
import os
import simplejson

import Image

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
        srcs = []

        # get absolute paths of images in album for each file type
        for file_type in FILE_TYPES:
            imgs = glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type)

            for img in imgs:
                img_rel_path = REL_GALLERY_DIR + album['slug'] + '/' + img.split('/')[-1]
                srcs.append(img_rel_path)

        templ_vars['site']['srcs'] = simplejson.dumps(sorted(srcs))


def get_image_sizes(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images sizes (width/height) since JS doesn't know until loaded
    Each image size tuple corresponds to an image from get_image_srcs
    Will be in the same order
    """
    if 'type' in page.meta and page.meta['type'] == 'album':
        album = page.meta

        srcs = []

        # get absolute paths of images in album for each file type
        for file_type in FILE_TYPES:
            image_list = glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type)
            srcs += image_list

        srcs = sorted(srcs)

        sizes = []
        for src in srcs:
            image = Image.open(src)
            width = image.size[0]
            height = image.size[1]
            sizes.append([width, height])

        templ_vars['site']['sizes'] = simplejson.dumps(sizes)
