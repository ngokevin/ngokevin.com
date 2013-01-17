import glob
import os

GALLERY_DIR = os.path.abspath("./media/img/gallery/") + '/'
REL_GALLERY_DIR = "/img/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]
THUMB_PREFIX = "THUMB_"
PREVIEW_IMGS_NUM = 3

def get_albums(page, templ_vars):
    """
    Wok page.template.pre hook
    Load several preview images into each album
    """
    if 'type' in page.meta and page.meta['type'] == 'gallery':

        # for each album
        albums = {}

        try:
            for album in sorted(templ_vars['site']['categories']['gallery'], key=lambda album:album['datetime']):

                # get absolute paths of images in album
                images = []
                for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:

                    # grab only several
                    if len(images) > PREVIEW_IMGS_NUM:
                        break

                    # grab only thumbnails, convert paths from absolute to relative
                    images += [REL_GALLERY_DIR + album['slug'] + '/' + image.split('/')[-1] for image in image_list if image.split('/')[-1].startswith(THUMB_PREFIX)]

                # dictionary of albums
                albums[album['slug']] = images[0:3]

            # add albums to template variables
            templ_vars['site']['albums'] = albums
        except KeyError:
            pass


