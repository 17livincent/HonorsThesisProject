"""
    trans.py
    Python code used to perform transformation steps.
    Takes command line arguments argv[1] for the stringified filenames list and argv[2] for the stringified steps object.
"""
import numpy as np
import pandas as pd
import sys
import json

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

#####################################

file_inputs = sys.argv[1]
steps_input = sys.argv[2]

files_list = read_json_to_list(file_inputs)
steps = read_json_to_list(steps_input)

print(steps)
print(files_list)

for filename in files_list:
    fileDF = read_file(filename)
    print(fileDF)

sys.stdout.flush()

