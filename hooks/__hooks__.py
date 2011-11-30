import thumbnail
import gallery

hooks = {
    'site.start': [thumbnail.create_thumbnails],
    'page.template.pre': [gallery.load_albums]
}

