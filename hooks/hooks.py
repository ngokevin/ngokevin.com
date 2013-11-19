import logging
import os
import subprocess


def compile_sass(output_dir):
    '''
    Compile Sass files -> CSS in the output directory.

    Any .scss or .sass files found in the output directory will be compiled
    to CSS using Sass. The compiled version of the file will be created in the
    same directory as the Sass file with the same name and an extension of
    .css. For example, foo.scss -> foo.css.

    Serves as a 'site.output.post' wok hook, e.g., your __hooks__.py file might
    look like this:

    from wok.contrib.hooks import compile_sass

    hooks = {
    'site.output.post':[compile_sass]
    }

    Dependencies:

    - Ruby
    - Sass (http://sass-lang.com)
    '''
    logging.info('Running hook compile_sass on {0}.'.format(output_dir))
    for root, dirs, files in os.walk(output_dir):
        for f in files:
            fname, fext = os.path.splitext(f)
            if fext == ".scss" or fext == ".sass":
                abspath = os.path.abspath(root)
                sass_src = "%s/%s" % (abspath, f)
                sass_dest = "%s/%s.css" % (abspath, fname)
                sass_arg = "%s:%s" % (sass_src, sass_dest)
                logging.debug('[hook/sass] sass {0}'.format(sass_arg))
                try:
                    subprocess.call(['sass', sass_arg])
                except OSError:
                    logging.warning('[hook/compile_sass] Could not run SASS ' +
                                    'hook. (Is SASS installed?)')
