import glob
import os

GALLERY_DIR = os.path.abspath("./media/images/gallery/") + '/'
REL_GALLERY_DIR = "/images/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

def get_images(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images in the album as relative paths
    """
    if 'type' in page.meta and page.meta['type'] == 'album':
        album = page.meta

        # get paths of all of the images in the album
        album_images = []

        # get absolute paths of images in album
        for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:

            # convert paths from absolute to relative
            album_images += [REL_GALLERY_DIR + album['slug'] + '/' + image.split('/')[-1] for image in image_list]

        templ_vars['site']['album_images'] = sorted(album_images)


