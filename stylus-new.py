#!/usr/local/bin/python

# Creates a new empty Stylus template under whatever directory pwd is

import os 
import sys

cur_dir = os.path.dirname(os.path.realpath(__file__))

# Make sure that the variable stylusRootDir reflects the 
# true location of the Stylus installation

def modify(line):
    if line.startswith("const stylusRootDir = "):
        return "const stylusRootDir = \"" + cur_dir + "\"\n"
    else:
        return line
 
stylus_js_path = os.path.join(cur_dir, "stylus.js")   

newLines = []
with open(stylus_js_path, 'r') as f:
    lines = f.readlines()
    newLines = [modify(l) for l in lines]

with open(stylus_js_path, 'w') as f:
    f.write("".join(newLines))


# Create a new template
def create_file_at(p, title):
	with open(p, 'w') as f:
		s = """<paper title="%s">

  <authors>
    <author name="Firstname Lastname" affiliation="Affiliation Can Be|Multilined" email="name@domain.com"></author>
  </authors>

  <abstract>
  	Enter abstract here...
  </abstract>

  <section heading="Introduction">
    You can <cite type="webpage" id="pageId">cite a link like this</cite>. You can also <cite type="book" id="bookId">cite a book</cite>. Make sure to hover over the italic text to view the cited book/webpage.
  </section>

  <bibliography>
    <book id="bookId" title="Title of the Book" author="Author One|Author Two"></book>
    <webpage id="pageId" title="A GitHub Repo" url="https://github.com/jyuhuan/stylus-html"></webpage>
  </bibliography>

  <script src="%s"></script>
</paper>""" % (title, stylus_js_path)
		f.write(s)
	return None

pwd = cwd = os.getcwd()
new_paper_title = "Untitled Stylus Paper"

if len(sys.argv) > 1:
	new_paper_title = sys.argv[1]
	
new_file_path = os.path.join(pwd, "-".join(new_paper_title.split(" ")) + ".html")

if os.path.isfile(new_file_path):
	print("File already exists!")
else:
	create_file_at(new_file_path, new_paper_title)
	print("Successfully created new Stylus file at \n    " + new_file_path)

