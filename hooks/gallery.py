import glob
import os

GALLERY_DIR = os.path.abspath("./media/images/gallery/") + '/'
REL_GALLERY_DIR = "/images/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]
THUMB_PREFIX = "THUMB_"

def load_albums(page, templ_vars):
    """
    Wok page.template.pre hook
    Get album information and grab several images to load into each album
    """
    if page.path == 'content/gallery.mkd':

        # get paths of albums
        albums = {}
        for album in sorted(templ_vars['site']['categories']['gallery'], key=lambda album:album['datetime']):

            images = []
            for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:
                if len(images) > 3:
                    break
                images += [REL_GALLERY_DIR + album['slug'] + '/' + image.split('/')[-1] for image in image_list if image.split('/')[-1].startswith(THUMB_PREFIX)]

            albums[album['slug']] = images[0:3]

        templ_vars['site']['albums'] = albums


