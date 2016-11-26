const DEBUG_FLAG = 0;

// From http://stackoverflow.com/a/2007473
function NodeFromString(str) {
  const node = document.createElement("template");
  node.innerHTML = str;
  return node.content.firstChild;
}

function StandardNodeWithId(name, id) {
  const n = document.createElement(name);
  n.setAttribute("id", id);
  return n;
}

function StandardNodeWithClass(name, className) {
  const n = document.createElement(name);
  n.className = className;
  return n;
}

function StandardNodeWithIdAndClass(name, id, className) {
  const n = document.createElement(name);
  n.setAttribute("id", id);
  n.className = className;
  return n;
}

function println(str) {
  console.log(str);
}

// From http://stackoverflow.com/a/4793630
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}



const bodyNode = document.body;

// Naming convention:
//  - userAbcNode: the node user wrote in the html
//  - stylusAbcNode: the node that stylus generates
// In other words, userAbcNode is the input, stylusAbcNode is the output.

// Prepare a blank paper node.
const stylusPaperNode = StandardNodeWithIdAndClass("div", "paper", "paper");
bodyNode.appendChild(stylusPaperNode);

// Render title
const userPaperNode = document.getElementsByTagName("paper")[0];
const paperTitle = userPaperNode.getAttribute("title");
const stylusTitleNode = StandardNodeWithIdAndClass("div", "title", "title");
stylusTitleNode.innerHTML = paperTitle;
stylusPaperNode.appendChild(stylusTitleNode);

// Render authors
const userAuthorDefinitionNodes = document.getElementsByTagName("authors");
if (userAuthorDefinitionNodes.length == 1) {
  // Create the pane that holds the author list
  const stylusAuthorListPaneNode = StandardNodeWithIdAndClass("div", "author-list-pane", "author-list-pane");
  stylusPaperNode.appendChild(stylusAuthorListPaneNode);

  // Create the author list that contains authors
  const stylusAuthorListNode = StandardNodeWithIdAndClass("ul", "author-list", "author-list");
  stylusAuthorListPaneNode.appendChild(stylusAuthorListNode);

  // Visit each author the user created
  const userAuthorNodes = Array.from(userAuthorDefinitionNodes[0].children);
  userAuthorNodes.forEach(n => {
    const authorName = n.getAttribute("name");
    const authorAffiliation = n.getAttribute("affiliation").replace("|", "<br />");
    const authorEmail = n.getAttribute("email");
    stylusAuthorListNode.appendChild(NodeFromString(
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
const stylusAbstractNode = NodeFromString(
    `<div id="abstract-pane">
      <div class="abstract-heading">Abstract</div>
      <div id="abstract-body" class="abstract-body">
        ${abstractContent}
      </div>
    </div>`
  );
stylusPaperNode.appendChild(stylusAbstractNode);


// Render sections
const stylusSectionPaneNode = StandardNodeWithIdAndClass("div", "section-pane", "section-pane");
stylusPaperNode.appendChild(stylusSectionPaneNode);

const sections = Array.from(document.getElementsByTagName("section"));

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

sections.forEach(s => {
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
  

  const stylusSectionNode = NodeFromString(
      `<div class="section-box-general section-box-${sectionLevel}">
        <div class="section-heading-general section-heading-${sectionLevel}">
          <span class="section-heading-number">${sectionNumber}</span> ${s.getAttribute("heading")}
        </div> 
        <div class="section-body-general section-body-${sectionLevel}">${s.innerText}</div>
      </div>`
    );

  stylusSectionPaneNode.appendChild(stylusSectionNode);

})


if (DEBUG_FLAG == 0) {
  // Remove everything that the user originally wrote.
  userPaperNode.parentNode.removeChild(userPaperNode);
}


