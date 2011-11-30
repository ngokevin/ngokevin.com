def get_album_dirs(page, site):
    """
    Adds list of album_dirs to template variables
    List needs to be in same order as list of album slugs and titles
    """

    if page.path == 'content/gallery.mkd':
        for album in sorted(site['site']['categories']['gallery'], key=lambda album:album['datetime']):
            print album

