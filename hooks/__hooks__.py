import thumbnail
from gallery import Gallery
from hooks import compile_sass


gallery = Gallery()

hooks = {
    'site.start': [thumbnail.create_thumbnails],
    'page.meta.post': [gallery.get_images],
    'page.template.pre': [gallery.get_albums, gallery.set_images]
}
