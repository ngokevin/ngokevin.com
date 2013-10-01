import glob
import os
import pprint
import json

import requests
import Image

from config import GALLERY_WOK_TYPE, IMGUR_CLIENT_ID, FLICKR_CLIENT_ID
from lib import flickr


# Gallery.
MAX_WIDTH = 400
MAX_HEIGHT = 600
pp = pprint.PrettyPrinter(indent=4)
PREVIEW_IMGS_NUM = 3

# Local.
FILE_TYPES = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF']
GALLERY_DIR = os.path.abspath('./media/img/gallery/') + '/'
REL_GALLERY_DIR = '/img/gallery/'
THUMB_PREFIX = 'THUMB_'

# Imgur.
IMGUR_HEADERS = {'Authorization': 'Client-ID {0}'.format(IMGUR_CLIENT_ID)}
IMGUR_ALBUM_CACHE = {}
IMGUR_ALBUM_URL = 'https://api.imgur.com/3/album/{0}/'
THUMB_SIZE = 'm'  # (see http://api.imgur.com/models/image)

# Flickr.
flickr.API_KEY = FLICKR_CLIENT_ID


class Gallery(object):
    """Gallery and album pages."""

    def __init__(self):
        self.albums = {}

    def get_albums(self, page, templ_vars):
        """
        Wok page.template.pre hook
        Load several preview images into each album.
        """
        if ('type' in page.meta and page.meta['type'] == GALLERY_WOK_TYPE and
            'gallery' in templ_vars['site']['categories']):
            album_pages = sorted(
                templ_vars['site']['categories']['gallery'],
                key=lambda album: album['datetime'],
            )
            albums = {}
            for album_page in album_pages:
                image_list = []
                images = map(
                    lambda i: i['thumb_src'],
                    self.albums[album_page['slug']]
                )
                image_list += images[:PREVIEW_IMGS_NUM]
                albums[album_page['slug']] = image_list
            templ_vars['site']['albums'] = albums

    def get_images(self, page):
        """
        Wok page.template.pre hook
        Get all images in the album as relative paths.
        Binds srcs and thumb_srcs to template.
        """
        is_imgur = page.meta.get('source') == 'imgur'
        is_flickr = page.meta.get('source') == 'flickr'

        if 'type' in page.meta and page.meta['type'] == 'album':
            album = page.meta

            # Route to the correct image host based on source attribute.
            Klass = Local
            if is_imgur:
                Klass = Imgur
            elif is_flickr:
                Klass = Flickr
            self.albums[album['slug']] = Klass().get_images(page)

    def set_images(self, page, templ_vars):
        """
        Wok page.template.pre hook
        Inserts a single JSON blob containing all images into the page.
        """
        album = page.meta
        if 'type' in page.meta and page.meta['type'] == 'album':
            templ_vars['site']['images'] = json.dumps(
                self.albums[album['slug']]
            )


class Local(object):
    """Filesystem images."""

    def get_images(self, page):
        """Get paths of all of the images in the album."""
        album = page.meta
        srcs = []
        # Get absolute paths of images in album for each file type.
        for file_type in FILE_TYPES:
            imgs = glob.glob(
                GALLERY_DIR + album['slug'] + '/*.' + file_type
            )

            for img in imgs:
                img_rel_path = (
                    REL_GALLERY_DIR +
                    album['slug'] + '/' + img.split('/')[-1]
                )
                srcs.append(img_rel_path)

        # Split full srcs and thumb srcs from srcs into two lists
        images = []
        thumb_srcs = filter(
            lambda src: src.split('/')[-1].startswith(THUMB_PREFIX),
            srcs
        )
        for thumb_src in thumb_srcs:
            src = thumb_src.replace(THUMB_PREFIX, '')
            thumb_width, thumb_height = calc_img_hw(thumb_src)
            width, height = calc_img_hw(src)
            images.append({
                'thumb_src': thumb_src,
                'thumb_width': thumb_width,
                'thumb_height': thumb_height,

                'src': src,
                'width': width,
                'height': height,
            })
        return images


class Imgur(object):
    """Imgur-hosted images."""

    def get_images(self, page):
        if 'album-id' not in page.meta:
            raise Exception('No Imgur album-id for {0}'
                            .format(page.meta['title']))

        return map(
            make_image,
            sorted(
                self._get_imgur_album(page.meta['album-id'])['data']['images'],
                key=lambda img: img['datetime']
            )
        )

    def _get_imgur_album(self, album_id):
        global IMGUR_ALBUM_CACHE
        if album_id not in IMGUR_ALBUM_CACHE:
            response = requests.get(
                IMGUR_ALBUM_URL.format(album_id), headers=IMGUR_HEADERS
            )
            IMGUR_ALBUM_CACHE[album_id] = json.loads(response.content)
        return IMGUR_ALBUM_CACHE[album_id]


class Flickr(object):
    """Flickr-hosted images."""

    def get_images(self, page):
        if 'album-id' not in page.meta:
            raise Exception('No Flickr album-id for {0}'
                            .format(page.meta['title']))
        return self._get_flickr_set(page.meta['album-id'])

    def _get_flickr_set(self, set_id):
        images = []
        photoset = flickr.Photoset(set_id)
        for photo in photoset.getPhotos():
            sizes = photo.getSizes()
            image = {}
            for size in sizes:
                if size['label'] == 'Medium 640':
                    image['thumb_src'] = size['source']
                    image['thumb_width'] = int(size['width'] * 1.20)
                    image['thumb_height'] = int(size['height'] * 1.20)
                if size['label'] == 'Large 1600':
                    image['src'] = size['source']
                    image['width'] = size['width']
                    image['height'] = size['height']
            images.append(image)
        return images


def calc_img_hw(path):
    image = Image.open(path.replace(REL_GALLERY_DIR, GALLERY_DIR))
    return image.size[0], image.size[1]


def calc_thumb(src):
    for ft in FILE_TYPES:
        if src.endswith(ft):
            return src.replace('.' + ft, THUMB_SIZE + '.' + ft)
    raise Exception("Unknown filetype for {0}".format(src))


def calc_thumb_xy(*args):
    def refactor(*args):
        return map(lambda d: int(d * 0.9), args)

    def within_max(width, height):
        if width > MAX_WIDTH:
            return False
        if height > MAX_HEIGHT:
            return False
        return True

    while not within_max(*args):
        args = refactor(*args)

    return args


def make_image(image):
    width = image['width']
    height = image['height']
    thumb_width, thumb_height = calc_thumb_xy(width, height)
    return {
        'thumb_src': calc_thumb(image['link']),
        'thumb_width': thumb_width,
        'thumb_height': thumb_height,

        'src': image['link'],
        'width': width,
        'height': height,
    }
