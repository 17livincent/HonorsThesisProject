# SigNorm
SigNorm is a web application which allows the user to preprocess time series data files (.csv) with an easy-to-use, code-free, and file-converter-like interface.  To use the app, visit [web-app.li-vincent.com](http://web-app.li-vincent.com).  The user can simply upload multiple files, pick the preprocessing steps from dropdowns, and download the processed data.  Visualizations and graphs of the data before and after the transformations will be displayed as well.

Front-end is designed with React, back-end with Express, and is hosted on AWS EC2.  It utilizes socket.io for real-time communication.

This project is sponsored by the Arizona State University School of Arts, Media, and Engineering.

## Table of Contents
- [Notable Files and Directories](#notable)
- [How to Run Locally](#locally)
- [How to Add More Transformations](#add)

<a name='notable'></a>
## Notable Files and Directories
[```index.js```](index.js):
- Defines the server for the web application
- Deals with socket communication, file I/O, and client submissions

[```client/src/App.js```](client/src/App.js):
- Top-level component for the React front-end

[```client/src/Transformations.js```](client/src/Transformations.js)
- Defines the available preprocessing steps to the client, including names, descriptions, citations, associated inputs, and input sanitization rules

[```temp/<socket ID>```](temp/README.md):
- A directory where the client's data files are written to, in order for the transformation steps to be performed

[```preprocess.py```](preprocess.py):
- Python code that takes in an array of filenames and preprocessing steps info submitted by the client, and performs the transformations on those files

[```test_preprocess.ipynb```](test_preprocess.ipynb):
- A Jupyter Notebook to test the transformation functions on example data

<a name='locally'></a>
## How To Run Locally
If you'd like to host and run SigNorm on your own machine, first, clone the repository into your preferred directory.
```
git clone https://github.com/17livincent/SigNormApp
```
If you do not have ```Node.js``` and ```npm``` installed on your machine, you must do so through [this link](https://nodejs.org/en/download/current).  You must have the latest current verson of Node to run the app.

Next, navigate into ```SigNormApp/```, initialize the server, and install ```node_modules``` using this command in the terminal:
```
cd SigNormApp/
npm init
npm install
```
Navigate into ```/client``` and install ```node_modules``` for the React app and build it for production.
```
cd client/
npm install
npm run build
```
The back-end operations related to performing preprocessing steps are written in Python and use ```python3```, along with ```numpy```, ```pandas```, ```sklearn```, and ```matplotlib```.  If these are already installed, make sure they are up-to-date.  

If they are not downloaded, you can install ```python3``` and ```pip3``` [from here](https://www.python.org/downloads/).  If you are using a Linux machine, you can use these commands:
```
sudo apt install python3
sudo apt install python3-pip
```
Once those are installed, you can add the other packages using ```pip3```:
```
pip3 install numpy
pip3 install pandas
pip3 install scikit-learn
pip3 install matplotlib
```
Once all the dependencies are in-place, from the ```SigNormApp/``` directory, start the Express server with: 
```
node index.js
```
Finally, to access the app, from your web browser, enter the address ```localhost:3000```.

<a name='add'></a>
## How to Add More Transformations
### Add a JSON object to ```client/src/Transformations.js```
First, add a new JSON object to the one in ```client/src/Transformations.js```.  The JSON object is of this format, with the attributes' default values:
```
{
    name: '',
    val: '',
    description: '',
    citation: '',
    numOfInputs: 0,
    inputNames: [''],
    rules: [],
    ruleDescs: ['']
},
```
- ```name```: (string) The displayed name of the transformation step
- ```val```: (string) The actual, 'communicated' name of the step, which will also be used by the server
- ```description```: (string) A displayed description of the step, which can describe the inputs
    - If this is an empty string, then a description won't be displayed
- ```citation```: (string) A displayed citation
    - If this is an empty string, then a citation won't be displayed
- ```numOfInputs```: (integer) The number of (numerical) inputs for this step
    - If this is ```0```, then no input fields will be rendered
- ```inputNames```: (string array) The displayed names of each input, in order
- ```rules```: (function array) Boolean functions which take in an array of the inputs (floats) and are run to validate and sanitize them
    - If the function is passed ```inputs```, then the individual input values can be accessed with ```inputs[<0 to numOfInputs - 1>]```
    - Each function must return ```true``` (the inputs are validated for this rule) or ```false``` (the inputs have violated this rule)
- ```ruleDescs```: (string array) The string referenced in ```ruleDescs[index]``` describes why the validation rule in ```rules[index]``` was violated
    - These strings are displayed only when the corresponding rules are violated

*Note: All of the numerical inputs are floats (3 decimal places) by default.  Non-numerical values cannot be entered by the user.

### Write transformation function in ```preprocess.py```
Second, in ```preprocess.py``` in the app's root directory, write a function which takes in a DataFrame and inputs given by the user, performs the transformation on the DataFrame, and returns it.  If it needs to use functions from additional libraries, you must explicitly ```import``` them at the top of the file.

Here is an example:
```
def normalize(df, min, max):
    """
        Scale data between min and max.
    """
    headers = list(df)  # saving column names
    # sklearn.preprocessing.MinMaxScaler is imported at the top of the file
    normalize = MinMaxScaler(feature_range = (min, max))    
    trans = normalize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)   # column names are maintained
```

### Read the ```val``` of the step's JSON object to call the function
Finally, back in ```preprocess.py```, add an else-if statement for your function to the bottom of ```def call_step(df, step_name, inputs)```.  The ```step_name``` is exactly the ```val``` of the step's JSON object in ```client/src/Transformations.js```.  The statement should look something like this:
```
elif step_name == 'norm':
        df = normalize(df, inputs[0], inputs[1])
```
Once that is done, rebuild the React app using ```npm run build``` in ```clients/``` and check for any errors in ```preprocess.py```.  Run the application, and if things work correctly, then you have successfully added a transformation step.  Otherwise, go over your code, and compare it with the existing transformations.