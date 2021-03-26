#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Aug 12 19:30:39 2020

@author: Shamir Alavi
"""

import numpy as np
import pandas as pd
# import matplotlib.pyplot as plt
from matplotlib import patches

class preprocess:
    '''
    Preprocess data before creating the radar
    Methods:
        cleanupCSV: Keeps only the necessary info from the original ETR
                    spreadsheet
    '''

    def __init__(self):
        return None

    def cleanupCSV(self, filepath, filename, outputPath, outputCSV, outputJSON):
        
        '''
        Keeps only the necessary info from the original ETR spreadsheet

        Parameters
        ----------
        filepath : string
            Full directory path where the spreadsheet is stored.
        filename : string
            Name of the spreadsheet, e.g. 'ETR.csv'.
        outputPath: string
            Directory where the new csv file will be stored.
        outputFile:  string
            Output file name

        Returns
        -------
        None; saves the new dataframe as a csv file and a json file

        '''

        fullfilepath = filepath + filename
        etr_csv = pd.read_csv(fullfilepath)

        etr_df = pd.DataFrame(etr_csv)
        etr = etr_df[['Emerging Technology', 'KPI Research Phase (Topic)',
                      'KPI Research Activity Arc (Topic)', 'Activity Type', 'Status']]
        
        # Keep only those rows where research phase is not null
        etr = etr[etr['KPI Research Phase (Topic)'].notna()]
        
        # fill empty values in activity arc column with the phrase 'Engage'        
        ind = etr.columns.get_loc('KPI Research Activity Arc (Topic)')
        for x in range(len(etr)):
            if pd.isna(etr.iloc[x, ind]):
                etr.iloc[x, ind] = 'Engage'

        # Save as CSV
        outCSV = outputPath + outputCSV
        etr.to_csv(outCSV, index=False)

        # Save as JSON
        outJSON = outputPath + outputJSON
        etr.to_json(outJSON, orient="columns")

        # etr_trimmed = []
        # for i in range(len(etr)):
        #     if pd.notna(etr['KPI Research Phase (Topic)'].values[i]):
        #         etr_trimmed.append(etr.values[i])

        # etr_to_use = np.array(etr_trimmed)

        return None


class canvas():

    def __init__(self):
        return None

    def arc(self, cent_x: float, cent_y: float, radius: float,
            theta1: float, theta2: float, width: float, colour: str, axes):

        '''
        Draws an arc on the radar

        Parameters
        ----------
        cent_x : float
            x coordinate of centre for the arc
        cent_y : float
            y coordinate of centre for the arc
        radius : float
            radius of the arc
        theta1 : float
            angle from which the arc starts
        theta2 : float
            angle up to which the arc is drawn
        width : float
            If width is given, then a partial wedge is drawn from inner radius
            (r - width) to outer radius r
        colour : str
            colour of the arc as HTML colour code
        axes:
            

        Returns
        -------
        None.

        '''
        Arc = patches.Wedge((cent_x, cent_y), radius, theta1, theta2, width=width, color=colour)

        #return Arc
        return axes.add_artist(Arc)

    def line(self, x1: float, x2: float, y1: float, y2: float):
        '''
        

        Parameters
        ----------
        x1 : float
            DESCRIPTION.
        x2 : float
            DESCRIPTION.
        y1 : float
            DESCRIPTION.
        y2 : float
            DESCRIPTION.

        Returns
        -------
        x : TYPE
            DESCRIPTION.
        y : TYPE
            DESCRIPTION.

        '''

        #slope = (y2- y1) / (x2 - x1)
        x = [x1, x2]
        y = [y1, y2]

        return x, y


