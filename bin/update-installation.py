#!/usr/local/bin/python

# Changes stylusRootDir to whatever directory this python file is located.

import os 

this_file_dir = os.path.dirname(os.path.realpath(__file__))
cur_dir = os.path.dirname(this_file_dir)

# # Make sure that the variable stylusRootDir reflects the 
# # true location of the Stylus installation

# def modify(line):
#     if line.startswith("const stylusRootDir = "):
#         return "const stylusRootDir = \"" + cur_dir + "\"\n"
#     else:
#         return line
 
# stylus_js_path = os.path.join(cur_dir, "stylus.js")   

# newLines = []
# with open(stylus_js_path, 'r') as f:
#     lines = f.readlines()
#     newLines = [modify(l) for l in lines]

# with open(stylus_js_path, 'w') as f:
#     f.write("".join(newLines))
#     print("Successfully set Stylus installation directory at \n    " + cur_dir)
