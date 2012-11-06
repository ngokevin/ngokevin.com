# create (max size) thumbnails of all JPEG images in each album folder
import glob
import Image
import os

ORIG_THUMBNAIL_SIZE = [210, 210]
THUMBNAIL_PREFIX = 'THUMB_'
GALLERY_DIR = os.path.abspath("./media/img/gallery/") + '/'
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

def create_thumbnails():
    """
    Wok site.start hook
    Walks through gallery folder in media directory
    and creates thumbnails for images that do not yet have thumbnails
    """

    # look into each album in the gallery
    for folder in os.listdir(GALLERY_DIR):

        # grab absolute paths of images in the album
        for image_list in [glob.glob(GALLERY_DIR + folder + '/*.' + file_type) for file_type in FILE_TYPES]:

            if not image_list:
                continue

            else:
                for infile in image_list:

                    # don't do anything if thumbnail already exists
                    split = infile.split('/')
                    if not split[-1].startswith(THUMBNAIL_PREFIX) and '/'.join(split[:-1]) + '/' + THUMBNAIL_PREFIX + split[-1] not in image_list :

                        image = Image.open(infile)
                        thumbnail_size = [0, 0]

                        thumbnail_size[0] = ORIG_THUMBNAIL_SIZE[0]
                        thumbnail_size[1] = ORIG_THUMBNAIL_SIZE[1]

                        width = image.size[0]
                        height = image.size[1]

                        # blow up the thumbnail if it doesn't meet aspect ratio
                        while width < thumbnail_size[0] or height < thumbnail_size[1]:
                            width = int(width * 1.5)
                            height = int(height* 1.5)
                            image.resize((width, height), Image.ANTIALIAS)

                        # make thumbnail size be a minimum, not maximum
                        if width > height:
                            thumbnail_size[0] = width
                        else:
                            thumbnail_size[1] = height

                        # convert to thumbnail image
                        try:
                            image.thumbnail(thumbnail_size, Image.ANTIALIAS)
                        except Exception as e:
                            print image

                        # prefix thumbnail file with prefix
                        image_name = '/' + THUMBNAIL_PREFIX + infile.split('/')[-1]
                        image.save(GALLERY_DIR + folder + image_name)


if __name__ == '__main__':

    GALLERY_DIR = os.path.abspath("../media/images/gallery/") + '/'
    create_thumbnails()
