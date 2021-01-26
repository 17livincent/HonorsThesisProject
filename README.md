# HonorsThesisProject
This is a web application which allows the user to preprocess time series data files (.csv) with an easy-to-use, file-converter-like interface.  The link is [here](http://web-app.li-vincent.com).

It is designed for machine learning researchers/engineers or data scientists to preprocess time series data in a code-free environment.  The user can simply upload multiple files, pick the preprocessing steps from dropdowns, and download the processed data.

Front-end is designed with React, back-end with Express, and is hosted on AWS EC2.

This project is sponsored by the Arizona State University School of Arts, Media, and Engineering.

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