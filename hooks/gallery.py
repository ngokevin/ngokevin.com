import glob
import os

GALLERY_DIR = os.path.abspath("./media/images/gallery/") + '/'
REL_GALLERY_DIR = "/media/images/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

def load_albums(page, site):
    """
    Wok page.template.pre hook
    Get album information and grab several images to load into each album
    """
    if page.path == 'content/gallery.mkd':

        # get paths of albums
        albums = {}
        for album in sorted(site['site']['categories']['gallery'], key=lambda album:album['datetime']):

            images = []
            for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:
                if len(images) > 3:
                    break
                images += image_list

            albums[album['slug']] = images[0:3]

        site['site']['albums'] = albums


