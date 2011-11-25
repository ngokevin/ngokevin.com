# create 128x128 (max size) thumbnails of all JPEG images in the working folder

import glob
import Image
import os

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

                # don't save if thumbnail already exists
                if infile[0:2] != "T_":
                    # convert to thumbnail image
                    image.thumbnail((300, 300), Image.ANTIALIAS)
                    # prefix thumbnail file with T_

                    image_name = '/T_' + infile.split('/')[-1]
                    image.save(GALLERY_DIR + folder + image_name, "JPEG")
