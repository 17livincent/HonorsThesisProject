"""
    trans.py
    Author: Vincent Li <vincentl@asu.edu>
    Python code used to perform transformation steps.
    Takes command line arguments argv[1] for the stringified filenames list and argv[2] for the stringified steps object.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, PowerTransformer
from matplotlib import pyplot
import sys
import json
import os

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
    headers = list(df)
    standardize = StandardScaler()
    trans = standardize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)

def normalize(df, min, max):
    """
        Scale data between min and max.
    """
    headers = list(df)
    normalize = MinMaxScaler(feature_range = (min, max))
    trans = normalize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)

def moving_avg_filter(df, window_size):
    """
        Does a moving average filter of the inputted window size.
        If the window size is too large, it'll be set to the dataframe's size.
    """
    ws = window_size
    if(window_size >= len(df.index)): 
        ws = len(df.index)
    print(ws)
    filtered = df.rolling(window = ws).mean()
    filtered = filtered.dropna()
    filtered = filtered.reset_index(drop = True)
    return filtered

def difference_trans(df):
    """
        Does a difference transformation.
    """
    trans = df.diff()
    trans = trans.dropna()
    trans = trans.reset_index(drop = True)
    return trans

def box_cox_power_trans(df):
    """
        Does a Box-Cox power transformation.
        Data are initially scaled to positive values, and is returned standardized.
    """
    scale = MinMaxScaler(feature_range = (1, 2))
    bc = PowerTransformer(method='box-cox')
    trans = scale.fit_transform(df)
    trans = bc.fit_transform(trans)
    return pd.DataFrame(trans)

def yeo_johns_power_trans(df):
    """
        Does a Yeo-Johnson power transformation.
        Data is returned standardized.
    """
    yj = PowerTransformer(method='yeo-johnson')
    trans = yj.fit_transform(df)
    return pd.DataFrame(trans)

def div_stand_devs(df):
    """
        Divides each column by its standard deviation.
    """
    sd = df.std(axis = 0)
    for i in df:
        df[i] = df[i] / sd[i]
    return df

def sub_means(df):
    """
        Subtracts the mean from each column.
    """
    means = df.mean(axis = 0)
    for i in df:
        df[i] = df[i] / means[i]
    return df

def getLinePlot(data, title, filename, saveas):
    """
        Creates and saves a scatter plot
    """
    data.plot()
    pyplot.title(title)
    pyplot.savefig(saveas)    # png files are temp/<socket ID>/<type>-<when>-<filename>.png

def call_step(df, step_name, inputs):
    """
        Calls the appropriate preprocessing function based on the step name.
        Returns the transformed dataframe.
    """
    if step_name == 'stand':
        df = standardize(df)
    elif step_name == 'norm':
        df = normalize(df, inputs_list[0], inputs_list[1])
    elif step_name == 'moving_avg_smoother':
        df = moving_avg_filter(df, int(inputs_list[0]))
    elif step_name == 'dif_trans':
        df = difference_trans(df)
    elif step_name == 'box-cox':
        df = box_cox_power_trans(df)
    elif step_name == 'y-j':
        df = yeo_johns_power_trans(df)
    elif step_name == 'div_stand_devs':
        df = div_stand_devs(df)
    elif step_name == 'sub_means':
        df = sub_means(df)

    return df

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
    # filename(s) are temp/<socket ID>/<file>.csv
    fileDF = read_file(filename)
    headers = list(fileDF)
    #print(fileDF)
    head, tail = os.path.split(filename)

    # Create original plots
    getLinePlot(fileDF, 'Line Plot: Original ' + tail, tail, head + '/lineplot-orig-' + tail + '.png')

    # iterate through all steps
    for i in range(len(steps_list)):
        step_name = steps_list[i]['name']
        inputs_list = np.array(steps_list[i]['inputs']).astype(np.float)
        # according to the step name, call the appropriate function
        fileDF = call_step(fileDF, step_name, inputs_list)

    # Create new plots
    getLinePlot(fileDF, 'Line Plot: Preprocessed ' + tail, tail, head + '/lineplot-prep-' + tail + '.png')

    # save file
    fileDF.to_csv(path_or_buf = filename, index = False, header = headers)

sys.stdout.flush()