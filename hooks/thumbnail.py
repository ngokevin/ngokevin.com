# create (max size) thumbnails of all JPEG images in each album folder
import glob
import Image
import os

ORIG_THUMBNAIL_SIZE = [210, 210]
THUMBNAIL_PREFIX = 'THUMB_'
GALLERY_DIR = os.path.abspath("../media/images/gallery/") + '/'
FILE_TYPES = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"]

# get all the jpg files from the current folder
for folder in os.listdir(GALLERY_DIR):

    for image_list in [glob.glob(GALLERY_DIR + folder + '/*.' + file_type) for file_type in FILE_TYPES]:

        if not image_list:
            continue
        else:
            for infile in image_list:
                image = Image.open(infile)
                thumbnail_size = [0, 0]

                # don't save if thumbnail already exists
                if not infile.startswith(THUMBNAIL_PREFIX):

                    thumbnail_size[0] = ORIG_THUMBNAIL_SIZE[0]
                    thumbnail_size[1] = ORIG_THUMBNAIL_SIZE[1]

                    width = image.size[0]
                    height = image.size[1]

                    # blow up the image if either dim is smaller than minimum thumbnail size
                    while width < thumbnail_size[0] or height < thumbnail_size[1]:
                        width = int(width * 1.5)
                        height = int(height* 1.5)
                        image.resize((width, height), Image.ANTIALIAS)

                    # rather than have thumbnail_size be a maximum, make it a minimum
                    if width > height:
                        thumbnail_size[0] = width
                    else:
                        thumbnail_size[1] = height

                    # convert to thumbnail image
                    image.thumbnail(thumbnail_size, Image.ANTIALIAS)

                    # prefix thumbnail file with T_
                    image_name = '/' + THUMBNAIL_PREFIX + infile.split('/')[-1]
                    image.save(GALLERY_DIR + folder + image_name)

