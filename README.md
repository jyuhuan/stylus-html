## Stylus<sup style="font-variant: small-caps">HTML</sup>

> Stylus<sup style="font-variant: small-caps">HTML</sup> is the HTML/JavaScript implementation of Stylus. It serves as the *assembly* for all other Stylus implementations. Even so, Stylus<sup style="font-variant: small-caps">HTML</sup> is simple and human-friendly enough to be used directly.

Ever wanted to do academic writing using HTML? Stylus<sup style="font-variant: small-caps">HTML</sup> is here to help!

Stylus<sup style="font-variant: small-caps">HTML</sup> provides simple HTML tags and attributes for fundamental elements in academic-style writing. 

Powerful as Stylus<sup style="font-variant: small-caps">HTML</sup> is, no external interpreters are required for rendering. Everything is implemented in pure HTML and JavaScript. So you can write your stuff using your favorite editor, and render the file in your favorite browser. It's as simple as that!

### Getting Started

Clone this repo to any directory. Let `stylus-dir` be that directory for demonstration purpose.

The following command will create a new document with a basic skeleton:

```
python stylus-dir/bin/stylus-new.py "My Paper Title"
```

The new file will be created under `pwd`, and has the name `My-Paper-Title.html`. You can also omit the name. In that case, the the file name will be `Untitled-Stylus-Paper.html`.

You may add `stylus-dir/bin` to your PATH for quick access.

### Why Stylus<sup style="font-variant: small-caps">HTML</sup>?
> **Q**: With so many existing applications for writers, why are you still making Stylus<sup style="font-variant: small-caps">HTML</sup>? Sounds like you're reinventing the wheel. 

Yes, I am. But Stylus<sup style="font-variant: small-caps">HTML</sup> is a better wheel, in which

- There is only one type of file. There is not a separation between source files and rendered files. What you write in the text editor becomes the rendered result automatically in a browser. In contrast, a Markdown user typically writes in a `*.md` file, and renders the file into a `*.html` file by exporting it. 
- The user can only access tags that have nothing to do with styles. This truly ensures the separation of content and formatting. The only way to adjust the formatting is through changing the style sheets. Even LaTeX does not do this (it allows macros like `vspace`). 
- No external renderer or interpreter needed. Everything runs in the browser, as everything is written in pure JavaScript.

And yes, some succinctness is sacrificed, but that is the price we need to pay for achieving precisely the above three purposes.