const DEBUG_FLAG = 0;

/** 
 * Utility functions
 */

class ScriptLoader {
  // From http://stackoverflow.com/a/950146
  static loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

  static loadScriptsSequentially(urls, callback) {
    function go(urls, curUrlIdx, callback) {
      if (curUrlIdx == urls.length) callback()
      else ScriptLoader.loadScript(urls[curUrlIdx], () => go(urls, curUrlIdx + 1, callback))
    }
    go(urls, 0, callback)
  }

  static loadMathJax() {
    var head = document.getElementsByTagName("head")[0], script;
    script = document.createElement("script");
    script.type = "text/x-mathjax-config";
    script[(window.opera ? "innerHTML" : "text")] =
      "MathJax.Hub.Config({\n" +
      "  tex2jax: { inlineMath: [['$','$'], ['\\\\(','\\\\)']] }, \n" +
      "  TeX: { equationNumbers: { autoNumber: \"AMS\" } }\n" +
      "});"
    head.appendChild(script);
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
    head.appendChild(script);
  }
}

class StyleSheetLoader {
  // Adapted from http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
  static loadStyleSheet(filename) {
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
    if (typeof fileref!="undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref)
  }
  static loadStyleSheets(urls) {
    urls.forEach(url => StyleSheetLoader.loadStyleSheet(url))
  }
}

class DomElement {
  // From http://stackoverflow.com/a/2007473
  static fromString(str) {
    const node = document.createElement("template");
    node.innerHTML = str;
    return node.content.firstChild;
  }

  static standardElementWithId(name, id) {
    const n = document.createElement(name);
    n.setAttribute("id", id);
    return n;
  }

  static standardElementWithClass(name, className) {
    const n = document.createElement(name);
    n.className = className;
    return n;
  }

  static standardElementWithIdAndClass(name, id, className) {
    const n = document.createElement(name);
    n.setAttribute("id", id);
    n.className = className;
    return n;
  }
}

function println(str) {
  console.log(str);
}

/** 
 * Core code
 */

StyleSheetLoader.loadStyleSheets([
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css",
  "../stylus.css",
  "../frosting/coling.css"
])

const scripts = [
  "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js",
  "../node_modules/jquery-balloon-js/jquery.balloon.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js"
]
ScriptLoader.loadScriptsSequentially(scripts, () => {$(() => {
  ScriptLoader.loadMathJax()

  // Naming convention:
  //  - userAbcNode(s): the node(s) user wrote in the html
  //  - stylusAbcNode(s): the node(s) that stylus generates
  // In other words, userAbcNode(s) is the input, stylusAbcNode(s) is the output.

  // FIRST PASS: translates user nodes into rough stylus nodes

  const bodyNode = document.body;

  // Render code blocks, before any other renderings. 
  // This prevents the html tags in the code blocks from being rendered.
  function codeContentAdjusted(rawCodeContent) {
    // TODO: Find the max of the number of heading spaces. 
    // Remove that number of heading spaces for each line.
    // TODO: think about what happens if the user mixes tabs and spaces...

    const escaped = rawCodeContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const firstNewLineIdx = escaped.indexOf("\n")
    const lastNewLineIdx = escaped.lastIndexOf("\n")
    const adjusted = escaped.substring(firstNewLineIdx + 1, lastNewLineIdx)

    return adjusted;
  }
  const userCodeBlockNodes = Array.from(document.getElementsByTagName("code-block"));
  userCodeBlockNodes.forEach(cb => {
    const lang = cb.getAttribute("lang");
    const codeContent = cb.innerHTML;
    const stylusCodeBlockNode = DomElement.fromString(
      `<div class="code-box">
        <pre><code class=${lang}>${codeContentAdjusted(codeContent)}</code></pre>
      </div>`
      );
    hljs.highlightBlock(stylusCodeBlockNode);
    cb.parentNode.replaceChild(stylusCodeBlockNode, cb);
  })

  // Prepare a blank paper node.
  const stylusPaperNode = DomElement.standardElementWithIdAndClass("div", "paper", "paper");
  bodyNode.appendChild(stylusPaperNode);

  // Render title
  const userPaperNode = document.getElementsByTagName("paper")[0];
  const paperTitle = userPaperNode.getAttribute("title");
  const stylusTitleNode = DomElement.standardElementWithIdAndClass("div", "title", "title");
  stylusTitleNode.innerHTML = paperTitle;
  stylusPaperNode.appendChild(stylusTitleNode);

  // Render authors
  const userAuthorDefinitionNodes = document.getElementsByTagName("authors");
  if (userAuthorDefinitionNodes.length == 1) {
    // Create the pane that holds the author list
    const stylusAuthorListPaneNode = DomElement.standardElementWithIdAndClass("div", "author-list-pane", "author-list-pane");
    stylusPaperNode.appendChild(stylusAuthorListPaneNode);

    // Create the author list that contains authors
    const stylusAuthorListNode = DomElement.standardElementWithIdAndClass("ul", "author-list", "author-list");
    stylusAuthorListPaneNode.appendChild(stylusAuthorListNode);

    // Visit each author the user created
    const userAuthorNodes = Array.from(userAuthorDefinitionNodes[0].children);
    userAuthorNodes.forEach(n => {
      const authorName = n.getAttribute("name");
      const authorAffiliation = n.getAttribute("affiliation").replace("|", "<br />");
      const authorEmail = n.getAttribute("email");
      stylusAuthorListNode.appendChild(DomElement.fromString(
        `<li class="author-list-item">
          <div class="author-box">
            <span class="author-name">${authorName}</span> <br />
            <span class="author-affiliation">
              ${authorAffiliation}
            </span><br />
            <span class="author-email">${authorEmail}</span>
          </div>
        </li>`
        ));
    });
  }

  // Render abstract
  const userAbstractNode = document.getElementsByTagName("abstract")[0];
  const abstractContent = userAbstractNode.innerHTML;
  const stylusAbstractNode = DomElement.fromString(
      `<div id="abstract-pane" class="abstract-pane">
        <div class="abstract-heading">Abstract</div>
        <div id="abstract-body" class="abstract-body">
          ${abstractContent}
        </div>
      </div>`
    );
  stylusPaperNode.appendChild(stylusAbstractNode);

  // Render sections
  const stylusSectionPaneNode = DomElement.standardElementWithIdAndClass("div", "section-pane", "section-pane");
  stylusPaperNode.appendChild(stylusSectionPaneNode);

  const userSectionNodes = Array.from(document.getElementsByTagName("section"));

  const lastNumber = new Map();

  function newSectionNumberForSuperSection(superSectionStr) {
    if (!lastNumber.has(superSectionStr)) {
      lastNumber.set(superSectionStr, 0);
    }

    lastNumber.set(superSectionStr, lastNumber.get(superSectionStr) + 1);
    if (superSectionStr == "") return lastNumber.get(superSectionStr);
    else return superSectionStr + "." + lastNumber.get(superSectionStr);
  }  

  function sectionLevelOfSectionNumber(sectionStr) {
    return sectionStr.split(".").length;
  }

  userSectionNodes.forEach(s => {
    var curNode = s;
    const key = [];

    var parentSectionNumber = "";
    const parent = s.parentNode;
    if (parent.tagName == "SECTION") {
      parentSectionNumber = parent.getAttribute("sectionNumber");
    }

    const sectionNumber = newSectionNumberForSuperSection(parentSectionNumber);
    const sectionLevel = sectionLevelOfSectionNumber(`${sectionNumber}`);

    s.setAttribute("sectionNumber", sectionNumber);
    
    // Get the substring of s without the strings of the sub section  
    const input = s.innerHTML;
    const matcher = /(^(.|[\r\n])+?)<section/g;
    var matches, output = [];
    while (matches = matcher.exec(input)) {
        output.push(matches[1]);
    } // this code is from http://stackoverflow.com/a/19913702

    if (output[0] == null) { // no subsection exists
      output[0] = input;
    }

    const stylusSectionNode = DomElement.fromString(
        `<div class="section-box-general section-box-${sectionLevel}">
          <div class="section-heading-general section-heading-${sectionLevel}">
            <span class="section-heading-number">${sectionNumber}</span> ${s.getAttribute("heading")}
          </div> 
          <div class="section-body-general section-body-${sectionLevel}">${output[0]}</div>
        </div>`
      );

    stylusSectionPaneNode.appendChild(stylusSectionNode);

  })


  // Create citation bibliography
  /// Parse bibliography
  const bibliography = {
    books: new Map(),
    webpages: new Map()
  }  

  const userBibliographyNode = document.getElementsByTagName("bibliography")[0];
  const userBookBibNodes = Array.from(userBibliographyNode.getElementsByTagName("book"));
  userBookBibNodes.forEach(x => {
    const id = x.getAttribute("id");
    const title = x.getAttribute("title");
    const authors = x.getAttribute("author").split("|");
    bibliography.books.set(id, {
      title: title,
      authors: authors
    })
  })
  const userWebPageBibNodes = Array.from(userBibliographyNode.getElementsByTagName("webpage"));
  userWebPageBibNodes.forEach(x => {
    const id = x.getAttribute("id");
    const title = x.getAttribute("title");
    const url = x.getAttribute("url");
    bibliography.webpages.set(id, {
      title: title,
      url: url
    })
  })

  if (DEBUG_FLAG == 0) {
    // Remove everything that the user originally wrote.
    userPaperNode.parentNode.removeChild(userPaperNode);
  }

  // SECOND PASS: refinement on the translated stylus nodes
  /// Turn citations into balloons.
  const balloonCSS = {
    border: 'solid 1px #999',
    padding: '7px 10px 5px 10px',
    backgroundColor: '#FFF',
    color: '#000',
    boxShadow: "0px 2px 10px 1px #CCC",
    borderRadius: "2px",
    maxWidth: "300px"
  }
  const userCiteNodes = Array.from(document.getElementsByTagName("cite"));
  userCiteNodes.forEach(c => {
    const type = c.getAttribute("type");
    const id = c.getAttribute("id");

    if (type == "webpage") {
      const p = bibliography.webpages.get(id)
      $(c).balloon({
        contents: `<div>
          <!--div class="bib-kind-box"><span class="bib-kind">webpage</span></div-->
          <div class="bib-name">${p.title}</div>
          <div class="bib-url"><a class="bib-url-text" href="${p.url}">${p.url}</a></div>
        </div>`,
        html: true,
        css: balloonCSS,
        showAnimation: function(d, c) { this.fadeIn(d, c); }
      });
    }

    if (type == "book") {
      const p = bibliography.books.get(id)
      $(c).balloon({
        contents: `<div>
          <!--div class="bib-kind-box"><span class="bib-kind">book</span></div-->
          <div class="bib-name">${p.title}</div>
          <div class="bib-author-box">
            ${p.authors.map(a => {return `<span class="bib-author-text">${a}</span>`}).join(", ")}
          </div>
        </div>`,
        html: true,
        css: balloonCSS,
        showAnimation: function(d, c) { this.fadeIn(d, c); }        
      });
    }    

    //println(c)
  })

    
})})