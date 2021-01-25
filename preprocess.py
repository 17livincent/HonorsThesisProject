"""
    trans.py
    Python code used to perform transformation steps.
    Takes command line arguments argv[1] for the stringified filenames list and argv[2] for the stringified steps object.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import sys
import json
from collections import OrderedDict

#####################################
# functions

def read_file(file):
    """
        Reads the file from the given path and returns a DataFrame or Series.

    """
    file_df = pd.read_csv(filepath_or_buffer = file, 
                            header = 0, 
                            skip_blank_lines = True, 
                            encoding = 'utf-8')
    return file_df

def read_json_to_list(steps):
    """
        Converts the steps JSON to python dictionary.
    """
    return json.loads(steps)

def standardize(df):
    """
        Transform data to have a mean of 0, and a standard dev of 1.
    """
    standardize = StandardScaler()
    trans = standardize.fit_transform(df)
    return pd.DataFrame(trans)

def normalize(df, min, max):
    """
        Scale data between min and max.
    """
    normalize = MinMaxScaler(feature_range = (min, max))
    trans = normalize.fit_transform(df)
    return pd.DataFrame(trans)

def moving_avg_filter(df, window_size):
    """
        Does a moving average filter of the inputted window size.
    """
    filtered = df.rolling(window = window_size).mean()
    filtered = filtered.dropna()
    return filtered

#####################################

# get inputs
file_inputs = sys.argv[1]
steps_input = sys.argv[2]

# get lists of filenames and steps
files_list = read_json_to_list(file_inputs)
steps_list = read_json_to_list(steps_input)

print(steps_list)
print(files_list)

# iterate through files
for filename in files_list:
    fileDF = read_file(filename)
    print(fileDF)

    # iterate through all steps
    for i in range(len(steps_list)):
        step_name = steps_list[i]['name']
        inputs_list = steps_list[i]['inputs']
        print(step_name)
        print(inputs_list)
        
        # according to the step name, call the appropriate function
        if step_name == 'stand':
            fileDF = standardize(fileDF)

        elif step_name == 'norm':
            fileDF = normalize(fileDF, inputs_list[0], inputs_list[1])

        elif step_name == 'moving_avg_filter':
            fileDF = moving_avg_filter(fileDF, inputs_list[0])

        print(fileDF)

sys.stdout.flush()

