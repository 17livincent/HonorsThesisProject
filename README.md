```
 ____  _       _   _                      
/ ___|(_) __ _| \ | | ___  _ __ _ __ ___  
\___ \| |/ _` |  \| |/ _ \| '__| '_ ` _ \ 
 ___) | | (_| | |\  | (_) | |  | | | | | |
|____/|_|\__, |_| \_|\___/|_|  |_| |_| |_|
         |___/                            
```
#
SigNorm is a web application which allows the user to preprocess time series data files (.csv) with an easy-to-use, code-free, and file-converter-like interface.  To use the app, visit [web-app.li-vincent.com](http://web-app.li-vincent.com).  The user can simply upload multiple files, pick the preprocessing steps from dropdowns, and download a zipped file of the processed data.  Visualizations and graphs of the data before and after the transformations will be displayed as well.

Front-end is built with React, back-end with Express, and is hosted on AWS EC2.  It utilizes socket.io for real-time communication and to send file chunks, and HTTP methods to send downloads and visualization pictures.

This project is sponsored by the Arizona State University School of Arts, Media, and Engineering.

#
# Table of Contents
- [Notable Files and Directories](#notable)
- [Brief Design Description](#design)
    - [Front-end](#design1)
    - [Back-end](#design2)
    - [File transfer, and sending and receiving file chunks](#design3)
- [How to Run Locally](#locally)
    - [Setting up the Node and React apps](#locally1)
    - [Including the Python packages](#locally2)
    - [Running the application](#locally3)
- [How to Add More Transformations](#add)
    - [Add a JSON object to ```client/src/Transformations.js```](#add1)
    - [Write your transformation function in ```preprocess.py```](#add2)
    - [Read the ```val``` of the step's JSON object to call the function](#add3)

#
<a name='notable'></a>
# Notable Files and Directories
[```index.js```](index.js):
- Defines the server for the web application
- Deals with socket communication, file I/O, and client submissions

[```client/src/App.js```](client/src/App.js):
- Top-level component for the React front-end

[```client/src/Transformations.js```](client/src/Transformations.js)
- Defines the available preprocessing steps to the client, including names, descriptions, citations, associated inputs, and input sanitization rules

[```preprocess.py```](preprocess.py):
- Python code that takes in an array of filenames and preprocessing steps info submitted by the client, and performs the transformations on those files

#
<a name='design'></a>
# Brief Design Description

<a name='design1'></a>
## Front-End
The client-side application is built with the React framework.  
### Purposes
- Send the files (in chunks) selected by the user to the server (explained in a later section)
- Validate user inputs
- Send the preprocessing steps information to the server
- Receive a ```.zip``` file as a download
- Display graphs and visualizations describing the datasets before and after transformation

The list of preprocessing steps are organized and sent via ```socket.io``` in a JSON object array like this:
```
steps = [
    {   // the first step to be performed
        name: '',   // the 'val' of the step defined in client/src/Transformations.js
        inputs: []  // an array of strings of the decimal-value inputs
    },
    {   // the second step and a valid example
        name: 'norm',               // the string which represents normalization
        inputs: ['-1.0', '1.0']     // the inputs asked by the form for this step
    },
]
```

<a name='design2'></a>
## Back-End
The application server is built with the Express framework on Node.  
### Purposes
- Record current users, including their selected preprocessing steps and files
- Receive file chunks and append them to the appropriate user's files
- When a client confirms, execute its selected preprocessing steps on its files using a Python child process, and save these files after transformation
- Send the preprocessed files in a zipped folder back to the client as a download
- Create graphs and visualizations before and after preprocessing
- Make those visualizations avaiable to the client via Express routing, so that they can be accessed via something like ```<img src='web-app.li-vincent.com/graphs/:id/:filename/:when/:type' alt='line plot' />```

### Recording clients

Client information is stored in an array of JSON objects like this one:
```
let clientForm = {          // details associated with a connected client
    id: null,               //  a unique parameter from socket.io identifying this client
    steps: [],              // sent steps
    files: [],              // sent files
    numOfFiles: 0,          // number of files that will be sent by this client
    numOfReceivedFiles: 0   // number of files fully received by the server
}
```
When a connection with a client is established, a new ```clientForm``` is created with a socket ID in the ```clientForm.id``` attribute.  When a client disconnects, it's associated ```clientForm``` is deleted.

### Completing preprocessing steps

When the client emits a 'submit' message to the server, the server will create a directory in ```temp/``` named after the client's socket ID (```clientForm.id```) and write all of the files into that directory.  From there, the server will execute this command:
```
python3 preprocess.py <stringified array of the filenames> <stringified clientForm.steps>
```
This command will create the graphs and visualizations of the datasets as they are (before), perform the preprocessing steps, and create those same visualizations again (after).

If the command completes successfully, the server will compress the data files into ```preprocessed.zip```.  If the command returns an error, an 'error' message will be emitted.

### Sending visualizations and preprocessed files to the client

Once the preprocessing steps are completed and visualizations are created, the server makes these files available via Express routing.  It will emit a 'download' message, notifying the client that the file can be downloaded via ```web-app.li-vincent.com/download/:socketID```.  The client creates and clicks an invisible HTML hyperlink to access this link.

The graphs are accessed by the client by creating HTML ```<img>``` components, with the ```src``` field referencing the link to a specific graph.  The route requested is something like ```web-app.li-vincent.com/graphs/<socket ID>/<filename>/<orig or prep>/<graph type>```.  The Express server will take the input fields provided by the request link, and send the correct .png to the client.

<a name='design3'></a>
## File transfer, and sending and receiving file chunks

A way to receive file chunks in order needed be designed due to the combination of using socket communication to send files, and that the client will read and emit each chunk asynchronously.  This means that the last chunk, which is most likely shorter in length than the define chunk byte length, could be emitted by the client before the second to last chunk (which is full-length) has been emitted.  Or, in general, the (n)'th chunk of a file could be read and emitted by the client before the (n-1)'th chunk, for some reason.  Combining the chunk bytes as they are received could place the chunks out of order and corrupt the file.  

Using a much smaller number of bytes for a file chunk could solve this issue, but it makes file transfer, much, much longer.  Keeping track of the order of chunks that are sent allows the server to place the chunks in their specified order and concatenate the file correctly.  By default, the chunk size is 100KB.

The ```clientForm.files``` attribute for each client is an array of JSON objects that keep track of each client's file chunks.  Each file will have it's own object.  The client sends one object per chunk.
```
let fileChunk = {
    name: fileName,
    type: fileType,
    size: fileSize,
    chunkNum: chunkNum,
    totalChunks: chunkSum,
    data: arrayBuffer,
    chunksReceived : 0
}
```
- ```name```: (string) the name, and unique identifier of the file
- ```type```: (string) ".csv"
- ```size```: (integer) the number of bytes for this file
- ```chunkNum```: (integer) a value that corresponds to the order of this chunk [0 : totalChunks - 1]
- ```totalChunks```: (integer) the number of chunks the server should expect to receive for this file
- ```data```: (Array Buffer) the actual bytes of this file chunk
- ```chunksReceived```: (integer) the number of chunks that the server has received for this file

When the first chunk of a file is received by the server, the ```fileChunk.data``` attribute is converted to an array of ```Node.Buffer``` objects, with ```fileChunk.chunkNum``` referencing the index in the array at which the initial chunk should be placed, and ```fileChunk.totalChunks``` specifying the length of this array.  For future chunks of this file, their ```fileChunk.data``` will just be inserted into the array with their ```fileChunk.chunkNum``` as the index.  So, while a file's chunks are being sent to the server, the corresponding ```fileChunk.data``` might look something like ```[<Buffer of chunk 0>, undefined, <Buffer of chunk 2>]```.

Every time a file's chunk is received by the server, it increments its copy of the attribute ```fileChunk.chunksReceived```.  When this value equals ```fileChunk.totalChunks```, then the server knows that this file has been fully received.  The server then can concatenate the array ```fileChunk.data```, combining all ```Node.Buffer``` objects of this file, in order, into a single ```Node.Buffer```.

#
<a name='locally'></a>
# How To Run Locally
If you'd like to host and run SigNorm on your own machine, start by cloning the repository into your preferred directory.
```
git clone https://github.com/17livincent/SigNormApp
```

<a name='locally1'></a>
## 1. Setting up the Node and React apps
If you do not have ```Node.js``` and ```npm``` installed on your machine, you must do so through [this link](https://nodejs.org/en/download/current).  You must have the latest verson of Node to run the app.

Next, navigate into ```SigNormApp/```, initialize the server, and install ```node_modules``` using these commands in the terminal:
```
cd SigNormApp/
npm install
```
From there, navigate into ```client/```.  Change ```client/src/App.js``` by updating the socket destination to match the web application's server, whether it be ```localhost:3000``` or ```<a public IP>:3000```.  You may also change the port number, which is 3000 to begin with, but must also update the port number specified in ```index.js```.
Afterward, install ```node_modules``` for the React app and build it for production.
```
cd client/
npm install
npm run build
```

<a name='locally2'></a>
## 2. Including the Python packages
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

<a name='locally3'></a>
## 3. Running the application
Once all the dependencies are in-place, from the ```SigNormApp/``` directory, start the Express server with: 
```
node index.js --expose-gc
```
To run the application with PM2, use this command:
```
pm2 start index.js --node-args="--expose-gc"
```
Finally, to access the app, from your web browser, enter the address ```localhost:3000```.

#
<a name='add'></a>
# How to Add More Transformations

<a name='add1'></a>
## 1. Add a JSON object to ```client/src/Transformations.js```
First, add a new JSON object to the one in ```client/src/Transformations.js```.  The JSON object is of this format, with the attributes' default values:
```
{
    name: '',
    val: '',
    description: '',
    citation: '',
    numOfInputs: 0,
    inputNames: [],
    rules: [],
    ruleDescs: []
},
```
Here is a valid example:
```
{
    name: 'Normalize', 
    val: 'norm', 
    description: 'Rescale the range of the data to be between a min and max.', 
    citation: '',
    numOfInputs: 2, 
    inputNames: ['Min', 'Max'], 
    rules: [(inputs) => (parseFloat(inputs[0]) < parseFloat(inputs[1]))],
    ruleDescs: ['Normalization minimum must be less than the maximum.']
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
- ```rules```: (function array) Boolean functions which take in an array of the inputs (stringified floats) and are run to validate and sanitize them
    - If the function is passed ```inputs```, then the individual input values can be accessed with ```inputs[<0 to numOfInputs - 1>]```
    - Each function must return ```true``` (the inputs are validated for this rule) or ```false``` (the inputs have violated this rule)
- ```ruleDescs```: (string array) The string referenced in ```ruleDescs[index]``` describes why the validation rule in ```rules[index]``` was violated
    - These strings are displayed only when the corresponding rules are violated
    - This array must be the same length as ```rules```

*Note: All of the numerical inputs are floats (3 decimal places) by default, but are read as strings, which means the floats must be parsed before any numerical comparison can be made.  Non-numerical values (except '.' and '-') cannot be entered by the user.

<a name='add2'></a>
## 2. Write your transformation function in ```preprocess.py```
Second, in ```preprocess.py``` in the app's root directory, write a function which takes in a DataFrame and inputs given by the user, performs the transformation on the DataFrame, and returns it.  The function inputs should be a DataFrame and then an array of the numerical inputs (floats).  Both must be present in the function definition because the functions will be called from a dictionary, as described later.  
If it needs to use functions from additional libraries, you must explicitly ```import``` them at the top of the file.  

Here is an example:
```
def normalize(df, inputs):
    """
        Scale data between minimum (inputs[0]) and maximum (inputs[1]).
    """
    minimum = inputs[0]
    maximum = inputs[1]
    headers = list(df)      # maintain headers before and after
    normalize = MinMaxScaler(feature_range = (minimum, maximum))    # imported above
    trans = normalize.fit_transform(df)
    return pd.DataFrame(trans, columns = headers)
```

<a name='add3'></a>
## 3. Read the ```val``` of the step's JSON object to call the function
Finally, back in ```preprocess.py```, add a key-value pair to the ```function_dict```.  The key is exactly the ```val``` of the step from the JSON object in ```client/src/Transformations.js```, and the value is the name of the function.  The pair should look something like this:
```
# 'norm' is the string name of the transformation step
# normalize is the name of the corresponding funtion
'norm': normalize   
```
The functions will be called from the ```function_dict``` based on that key.

Once that is done, rebuild the React app using ```npm run build``` in ```clients/``` and check for any errors in ```preprocess.py```.  Run the application, and if things work correctly, then you have successfully added a transformation step.  Otherwise, go over your code, and compare it with the existing transformations.