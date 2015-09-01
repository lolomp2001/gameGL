#!/usr/bin/env python

from os import listdir
from os.path import isfile, join
from gimpfu import *

def batchAlpha(workDir) :
	onlyfiles = [ f for f in listdir(workDir) if isfile(join(workDir,f)) ]
	for file in onlyfiles:
		image = pdb.gimp_file_load(workDir+"\\"+file, workDir+"\\"+file)
		drawable = pdb.gimp_image_active_drawable(image)
		color = (0, 0, 255, 0)
		pdb.gimp_image_select_color(image, 0, drawable, color)
		pdb.plug_in_colortoalpha(image, drawable, color)
		pdb.gimp_file_save(image, drawable, workDir+"\\"+file, workDir+"\\"+file)
	return

args = [(PF_STRING, "dir", "dir", "")]
register('python-batchAlpha', '', '', '', '', '', '', '', args, [], batchAlpha)

main()