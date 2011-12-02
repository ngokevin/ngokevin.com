import glob
import os

GALLERY_DIR = os.path.abspath("./media/images/gallery/") + '/'
REL_GALLERY_DIR = "/images/gallery/"
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

def get_images(page, templ_vars):
    """
    Wok page.template.pre hook
    Get all images in the album
    """

    # how do i know if page is in gallery category?
    if 'gallery' in templ_vars['site']['categories']:

        # get paths of albums
        for image_list in [glob.glob(GALLERY_DIR + album['slug'] + '/*.' + file_type) for file_type in FILE_TYPES]:
            if len(images) > 3:
                break
            images += [REL_GALLERY_DIR + album['slug'] + '/' + image.split('/')[-1] for image in image_list]

        albums[album['slug']] = images[0:3]

        templ_vars['site']['albums'] = albums


