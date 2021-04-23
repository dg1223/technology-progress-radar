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

    def shortenTitles(df):
        # Clean some names
        df.replace("Artificial\ Intelligence\ \(AI\)", "AI", regex=True, inplace=True)
        df.replace("Enterprise\ taxonomy\ and\ ontology\ management", "Enterprise Taxonomy & Ontology", regex=True, inplace=True)
        df.replace("Infrastructure\ as\ a\ code\ using\ Terraform", "Infrastructure as code", regex=True, inplace=True)
        df.replace("Angular\ framework", "Angular", regex=True, inplace=True)
        df.replace("REST\ webservices", "REST", regex=True, inplace=True)
        df.replace("Pan\ Canadian\ Trust\ Framework", "Pan-Canadian Trust Framework", regex=True, inplace=True)
        df.replace("R\ &\ Python", "R / Python", regex=True, inplace=True)
        df.replace("ICAM", "Identity, Credential & Access Management", regex=True, inplace=True)
        df.replace("DLT Offensive", "Distributed Ledger Technology - offensive", regex=True, inplace=True)
        df.replace("DLT Defensive", "DLT - defensive (cryptocurrency)", regex=True, inplace=True)
        df.replace("Touchless\ computing\/interfaces", "Touchless computing", regex=True, inplace=True)
        df.replace("PoC\ \(technology\)", "PoC", regex=True, inplace=True)
        df.replace("PoC\ \(business\)", "PoC", regex=True, inplace=True)

        return df

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
        outputCSV:  string
            Output csv file name
        outputJSON:  string
            Output json file name
        outputCSVcomp:  string
            Output csv file name (no duplicate technology names)
        outputJSONcomp:  string
            Output json file name (no duplicate technology names)

        Returns
        -------
        None; saves the new dataframe as csv and json files (4 files)

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

        # Remove leading and trailing spaces
        etr = etr.applymap(lambda x: x.strip())

        # Remove duplicate names
        etr.drop_duplicates(subset=['Emerging Technology', 'Activity Type', 'Status'], inplace=True)
        etr.sort_values(by=['Emerging Technology', 'Activity Type', 'Status'], inplace=True)
        etr.drop_duplicates(subset=['Emerging Technology', 'Activity Type'], inplace=True)  

        print(etr.head(10))

        # Clean some names
        etr = preprocess.shortenTitles(etr)     

        # Reset index after dropping NaN
        etr.reset_index(drop=True, inplace=True)

        # Save as CSV
        outCSV = outputPath + outputCSV
        etr.to_csv(outCSV, index=False)

        # Save as JSON
        outJSON = outputPath + outputJSON
        etr.to_json(outJSON, orient="columns", indent=4)

        return None
