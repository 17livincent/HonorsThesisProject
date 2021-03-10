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
from os.path import split
from textwrap import wrap
#####################################

# functions
def read_file(file):
    """
        Reads the file from the given path and returns a DataFrame or Series.
    """
    chunks = pd.read_csv(filepath_or_buffer = file, 
                            header = 0, 
                            skip_blank_lines = True, 
                            error_bad_lines = False,
                            float_precision='round_trip',
                            dtype = 'float64',
                            chunksize = 100000,
                            encoding = 'utf-8')
    file_df = pd.concat(chunks)
    return file_df

# transformation functions
def standardize(df, inputs):
    """
        Transform data to have a mean of 0, and a standard dev of 1.
    """
    headers = list(df.columns)
    standardize = StandardScaler()
    trans = standardize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)

def normalize(df, inputs):
    """
        Scale data between minimum (inputs[0]) and maximum (inputs[1]).
    """
    minimum = inputs[0]
    maximum = inputs[1]
    headers = list(df.columns)
    normalize = MinMaxScaler(feature_range = (minimum, maximum))
    trans = normalize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)

def moving_avg_filter(df, inputs):
    """
        Does a moving average filter of the inputted window size (inputs[0]).
        If the window size is too large, it'll be set to the dataframe's size.
    """
    window_size = int(inputs[0])
    if(window_size >= len(df.index)): 
        window_size = len(df.index)
    filtered = df.rolling(window = window_size).mean()
    filtered = filtered.dropna()
    filtered = filtered.reset_index(drop = True)
    return filtered

def difference_trans(df, inputs):
    """
        Does a difference transformation.
    """
    trans = df.diff()
    trans = trans.dropna()
    trans = trans.reset_index(drop = True)
    return trans

def box_cox_power_trans(df, inputs):
    """
        Does a Box-Cox power transformation.
        Data are initially scaled to positive values, and is returned standardized.
    """
    headers = list(df.columns)
    scale = MinMaxScaler(feature_range = (1, 2))
    bc = PowerTransformer(method='box-cox')
    trans = scale.fit_transform(df)
    trans = bc.fit_transform(trans)
    return pd.DataFrame(trans, columns = headers)

def yeo_johns_power_trans(df, inputs):
    """
        Does a Yeo-Johnson power transformation.
        Data is returned standardized.
    """
    headers = list(df.columns)
    yj = PowerTransformer(method='yeo-johnson')
    trans = yj.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)

def div_stand_devs(df, inputs):
    """
        Divides each column by its standard deviation.
    """
    sd = df.std(axis = 0)
    for i in df:
        df[i] = df[i] / sd[i]
    return df

def sub_means(df, inputs):
    """
        Subtracts the mean from each column.
    """
    means = df.mean(axis = 0)
    for i in df:
        df[i] = df[i] / means[i]
    return df

def do_nothing(df, inputs):
    """
        Does absolutely nothing.
    """
    return df

# plotting functions
def get_line_plot(data, title, saveas):
    """
        Creates and saves a scatter plot
    """
    data.plot()
    pyplot.title(title)
    pyplot.savefig(saveas)
    pyplot.close()

def get_histogram(data, title, saveas):
    """
        Creates and saves a histogram of the data's first feature
    """
    data.hist()
    pyplot.title(title)
    pyplot.savefig(saveas)
    pyplot.close()

def get_density(data, title, saveas):
    """
        Creates and saves a density plot
    """
    data.plot(kind = 'kde')
    pyplot.title(title)
    pyplot.savefig(saveas)
    pyplot.close()

def get_heatmap(data, title, saveas):
    """
        Creates and saves a heatmap
    """
    pyplot.matshow(data[:20])
    pyplot.title(title)
    pyplot.savefig(saveas)
    pyplot.close()

#####################################

# dictionary of transformation functions
function_dict = {
    'stand': standardize,
    'norm': normalize,
    'moving_avg_smoother': moving_avg_filter,
    'dif_trans': difference_trans,
    'box-cox': box_cox_power_trans,
    'y-j': yeo_johns_power_trans,
    'div_stand_devs': div_stand_devs,
    'sub_means': sub_means,
    'nothing': do_nothing,
    # add more here
}

# get inputs
file_inputs = sys.argv[1]
steps_input = sys.argv[2]
option_vis = sys.argv[3]

# get lists of filenames and steps
files_list = json.loads(file_inputs)
steps_list = json.loads(steps_input)

print(steps_list)
print(files_list)

# iterate through files
for filename in files_list:
    # filename(s) are temp/<socket ID>/<file>.csv
    fileDF = read_file(filename)
    headers = list(fileDF.columns)
    print(fileDF.shape)
    #print(headers[0:5])
    #print(fileDF)
    head, tail = split(filename)
    # number of colums to plot
    cols_to_plot = fileDF.shape[1]
    if(cols_to_plot > 5): cols_to_plot = 5

    if option_vis == '1':
        # Create original plots
        # png files are temp/<socket ID>/<type>-<when>-<filename>.png
        get_line_plot(fileDF.iloc[:, 0: cols_to_plot], '\n'.join(wrap('Line plot of %s features: Original %s' % (cols_to_plot, tail[5:]))), '%s/lineplot-orig-%s.png' % (head, tail))
        get_histogram(fileDF.iloc[:, 0], '\n'.join(wrap('Histogram of feature 1: Original ' + tail[5:])), '%s/histogram-orig-%s.png' % (head, tail))
        try:
            get_density(fileDF.iloc[:, 0: cols_to_plot], '\n'.join(wrap('Density plot of %s features: Original %s' % (cols_to_plot, tail[5:]))), '%s/densityplot-orig-%s.png' % (head, tail))
        except np.linalg.LinAlgError as error:
            pass
        #get_heatmap(fileDF, '\n'.join(wrap('Heatmap rows 0-20: Original ' + tail[5:])), tail, '%s/heatmap-orig-%s.png' % (head, tail))

    # iterate through all steps
    for i in range(len(steps_list)):
        step_name = steps_list[i]['name']
        inputs_list = np.array(steps_list[i]['inputs']).astype(np.float32)
        # according to the step name, call the appropriate function from the dictionary
        fileDF = function_dict[step_name](fileDF, inputs_list)

    if option_vis == '1':
        # Create new plots
        get_line_plot(fileDF.iloc[:, 0: cols_to_plot], '\n'.join(wrap('Line plot of %s features: Preprocessed %s' % (cols_to_plot, tail[5:]))), '%s/lineplot-prep-%s.png' % (head, tail))
        get_histogram(fileDF.iloc[:, 0], '\n'.join(wrap('Histogram of feature 1: Preprocessed ' + tail[5:])), '%s/histogram-prep-%s.png' % (head, tail))
        try:
            get_density(fileDF.iloc[:, 0: cols_to_plot], '\n'.join(wrap('Density plot of %s features: Preprocessed %s' % (cols_to_plot, tail[5:]))), '%s/densityplot-prep-%s.png' % (head, tail))
        except np.linalg.LinAlgError as error:
            pass
        #get_heatmap(fileDF, '\n'.join(wrap('Heatmap rows 0-20: Preprocessed ' + tail[5:])), tail, '%s/heatmap-prep-%s.png' % (head, tail))

    # save file
    fileDF.to_csv(path_or_buf = filename, index = False, header = headers, float_format="%.6f", encoding = 'utf-8')

sys.stdout.flush()