#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Aug 12 20:02:16 2020

@author: Shamir Alavi
"""

import radar
import matplotlib.pyplot as plt

'''
Cleanup ETR
'''

CSVpath = '/home/shamir/Documents/GitHub/tech-radar/'
CSVname = 'ETR.csv'
outputFile = 'ETR_clean.csv'

ETR = radar.preprocess()                # create a radar object

ETR.cleanupCSV(CSVpath, CSVname, CSVpath, outputFile)  # call method


'''
Draw canvas
'''

# figure, axes = plt.subplots()

# axes.set_aspect(0.75)
# # axes.axis('off')
# axes.get_xaxis().set_ticks([])
# axes.get_yaxis().set_ticks([])

# etradar = radar.canvas()

# identify = etradar.arc(0, 0, 80, 90, -180, 9, '#ccffcc', axes)
# study = etradar.arc(0, 0, 70.7, 90, -180, 13.5, '#b3ffb3', axes)
# relate = etradar.arc(0, 0, 56.9, 90, -180, 12, '#99ff99', axes)
# plan = etradar.arc(0, 0, 44.6, 90, -180, 8, '#80ff80', axes)
# adopt = etradar.arc(0, 0, 36.2, 90, -180, 15.5, '#ffffcc', axes)
# adopt_line = etradar.arc(0, 0, 36.2, 90, -180, 0.3, 'black', axes)
# readiness = etradar.arc(0, 0, 20.3, 90, -180, 20, '#ccff99', axes)

# line1_x, line1_y = etradar.line(-27, -52, 24, 60.5)
# line2_x, line2_y = etradar.line(-20, -35, 30, 71.5)
# # print(line1, line2)
# # axis limits
# x_min, x_max, y_min, y_max = -80, 0, 0, 80

# plt.axis([x_min, x_max, y_min, y_max])
# plt.xlabel('Identify      Study          Relate      Plan          Adopt                Readiness', fontsize=8)

# plt.text(-73, 45, 'Engage', rotation=45, fontsize=8)
# plt.text(-52, 72, 'Watch', rotation=25, fontsize=8)
# plt.text(-48.5, 70.7, '+', rotation=25, fontsize=8)
# plt.text(-49, 67, 'Learn', rotation=25, fontsize=8)
# plt.text(-20, 80, 'Park', rotation=15, fontsize=8)


# plt.axvline()
# plt.axhline()
# plt.grid(False)
# plt.plot(line1_x, line1_y, line2_x, line2_y, color='black')
# plt.title('ET Radar', fontsize=8)
# plt.show()




