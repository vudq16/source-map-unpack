[![npm version](https://badge.fury.io/js/source-map-unpack.svg)](https://badge.fury.io/js/source-map-unpack)
[![Twitter](https://img.shields.io/twitter/url/https/www.npmjs.com/package/source-map-unpack.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsource-map-unpack)

### CLI to unpack 🛍 your JS source maps 🗺 to original files and folders.

### Usage:

1. `npm install -g https://github.com/vudq16/source-map-unpack`
2. `unpack <sourcemaps-dir> <project-dir>`

For example:

`unpack ./sourcemaps ./results`

Note:

The original minified file should be placed according to the path in sources map's `file` variable.
