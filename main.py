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
outputCSV = 'ETR_clean.csv'
outputJSON = 'ETR_clean.json'

ETR = radar.preprocess()                # create a radar object

ETR.cleanupCSV(CSVpath, CSVname, CSVpath, outputCSV, outputJSON)  # call method




