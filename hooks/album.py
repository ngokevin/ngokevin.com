import glob
import os
import simplejson

import Image

GALLERY_DIR = os.path.abspath('./media/img/gallery/') + '/'
REL_GALLERY_DIR = '/img/gallery/'
FILE_TYPES = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
THUMB_PREFIX = 'THUMB_'

def get_image_srcs(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images in the album as relative paths
    Binds srcs and thumb_srcs to template
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

        # split full srcs and thumb srcs from srcs into two lists
        full_srcs = []
        thumb_srcs = []
        for src in srcs:
            if src.split('/')[-1].startswith(THUMB_PREFIX):
                thumb_srcs.append(src)
            else:
                full_srcs.append(src)

        # bind to template via json
        templ_vars['site']['srcs'] = simplejson.dumps(sorted(full_srcs))
        templ_vars['site']['thumb_srcs'] = simplejson.dumps(sorted(thumb_srcs))


def get_image_sizes(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images sizes (width/height) since JS doesn't know until loaded
    Binds sizes and thumb_sizes to template
    """
    if 'type' in page.meta and page.meta['type'] == 'album':
        album = page.meta

        srcs = []

        # get absolute paths of images in album for each file type
        for file_type in FILE_TYPES:
            image_list = glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type)
            srcs += image_list

        # split full srcs and thumb srcs from srcs into two lists
        full_sizes = []
        thumb_sizes = []
        for src in sorted(srcs):
            image = Image.open(src)
            width = image.size[0]
            height = image.size[1]
            size = [width, height]

            if src.split('/')[-1].startswith(THUMB_PREFIX):
                thumb_sizes.append(size)
            else:
                full_sizes.append(size)

        # bind to template via json
        templ_vars['site']['sizes'] = simplejson.dumps(full_sizes)
        templ_vars['site']['thumb_sizes'] = simplejson.dumps(thumb_sizes)
