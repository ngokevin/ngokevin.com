import thumbnail
import gallery

hooks = {
    'site.start': [thumbnail.create_thumbnails],
    'page.template.pre': [gallery.get_album_dirs],
}

