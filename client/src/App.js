/**
 * App.js
 * @author Vincent Li <vincentl@asu.edu>
 * The highest-level component of the web app.
 */
import React from 'react';
import {Accordion, Card, Col, Row, Button, ProgressBar, Alert} from 'react-bootstrap';

import Header from './Header.js';
import HomeInfo from './HomeInfo.js';
import InputData from './InputData.js';
import StepsForm from './StepsForm.js';
import Confirm from './Confirm.js';
import Visualizations from './Visualizations.js';
import Footer from './Footer.js';

import socketIOClient from 'socket.io-client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
//import './outline.css';

const CHUNKSIZE = 100000;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.serverName = 'web-app.li-vincent.com';
        // socket to send and receive data from server
        this.socket = socketIOClient(this.serverName); // while testing locally, the address should be 'localhost:3000'
        // FileList of inputted files
        this.files = [];
        // list of the names of the inputted files
        this.fileNames = [];
        // array of selected steps
        this.steps = [];

        this.state = {
            currentPanel: '0',  // which accordion section is open
            inProgress: false,  // to animate the progress bar
            succeeded: false,   // whether preprocessing succeeded and the user has received he download
            failed: false   // if the server sends and error message
        }

        this.submitData = this.submitData.bind(this);
        this.submitSteps = this.submitSteps.bind(this);
        this.commitOps = this.commitOps.bind(this);
    }

    componentDidMount() {
        this.socket.on('connection', () => {    // verify connection
            console.log(`Connected to server with socket ID: ${this.socket.id}`);
        });
        this.socket.on('ready to submit', () => {   // server acknowledges all steps and files have been received
            this.sendSubmit();  // send submit request
        })
        this.socket.on('download', () => {  // preprocessing completed and download is ready
            console.log(`Download ready`);
            // create invisible hyperlink element to click and download file
            let file = 'download/' + this.socket.id;
            let a = document.createElement('a');
            a.href = file;
            a.download = 'preprocessed.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // change the progress bar and disable the submit button
            this.setState({inProgress: false, succeeded: true});
        });
        this.socket.on('error', () => { // preprocessing stopped with error
            console.log('Preprocessing threw error');
            this.setState({inProgress: false, failed: true});
        });
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    /**
     * Callback function passed to the InputData
     */
    submitData(files) {
        //console.log('Files submitted:');
        //console.log(files);
        this.files = files;
        for(let i = 0; i < files.length; i++) {
            this.fileNames.push(files[i].name);
        }
        //console.log(this.fileNames);
        // close this accordion, open the second
        this.setState({currentPanel: '1'});
    }

    /**
     * Callback function passed to the StepsForm
     */
    submitSteps(steps) {
        //console.log(`Steps submitted: ${JSON.stringify(steps)}`);
        this.steps = steps;
        // close this accordion, open the next
        this.setState({currentPanel: '2'});
    }

    /**
     * Called in step 3 if the user presses the 'Confirm" button.
     */
    commitOps() {
        console.log('Files and steps confirmed.');
        // show the progress bar
        this.setState({inProgress: true});
        // send steps and files to server
        this.sendToServer();
    }

    /**
     * Returns an object representing a file chunk
     */
    getFileChunk(fileName, fileType, fileSize, arrayBuffer, i) {
        return {
            name: fileName,
            type: fileType,
            size: fileSize,
            data: arrayBuffer,
        }
    }

    /**
     * Send steps info to server
     */
    sendSteps() {
        this.socket.emit('steps', this.steps, (callback) => (console.log(callback)));
    }

    /**
     * Send files to server
     */
    sendFiles() {
        // send number of files
        this.socket.emit('num of files', this.files.length, (callback) => (console.log(callback)));
        // send file chunks
        for(let i in this.files) {
            let lastChunk = Math.ceil(this.files[i].size / CHUNKSIZE);  // the num of the last chunk in the file
            for(let j = 0; j < lastChunk; j++) {
                let reader = new FileReader();
                reader.onload = () => { // on load, emit to server
                    this.socket.compress(true).emit('file chunk', this.getFileChunk(this.files[i].name, this.files[i].type, this.files[i].size, reader.result), (callback) => (console.log(callback)));
                };
                let start = j * CHUNKSIZE;  // get starting byte
                let slice = this.files[i].slice(start, start + Math.min(CHUNKSIZE, this.files[i].size - start));    // get slice
                reader.readAsArrayBuffer(slice);    // read as array buffer
            }
        }
        //console.log('All files uploaded.');
    }

    /**
     * Sends the submit message to the server
     */
    sendSubmit() {
        this.socket.emit('submit', (callback) => (console.log(callback)));
    }

    /**
     * Send steps, filechunks, and submit to server
     */
    sendToServer() {
        this.sendSteps();
        this.sendFiles();
    }

    render() {
        let inputData = <InputData id='main' onSubmit={this.submitData}/>;
        let stepsForm = <StepsForm id='main' onSubmit={this.submitSteps}/>;
        let goBackButton1 = <Button id='goback1' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '0'}))}>Go back</Button>;
        let goBackButton2 = <Button id='goback2' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '1'}))}>Go back</Button>;

        let progressBar = <React.Fragment><br /><ProgressBar animated now={100} /></React.Fragment>;

        let status;
        if(this.state.succeeded === true && this.state.failed === false) status = 'dark';
        else if(this.state.succeeded === false && this.state.failed === true) status = 'danger';

        let successfulStatus = <React.Fragment>
            <h4>Preprocessing completed</h4>
            <Visualizations serverName={this.serverName} fileNames={this.fileNames} socketID={this.socket.id} />
        </React.Fragment>;
        let failureStatus = <React.Fragment>
            <h4>Error occurred</h4>
            Please check the order of steps and try again.
        </React.Fragment>;

        let statusComp = <Alert id='status' variant={status}>
            {(status !== undefined && status === 'dark') ? (successfulStatus) : (failureStatus)}
        </Alert>;

        return (
            <React.Fragment>
                <Header />
                <HomeInfo />
                <Accordion id='app' activeKey={this.state.currentPanel}>
                    <Card border='primary'>
                        <Card.Header eventKey='0'>
                            <h2>1. Input Data</h2>
                        </Card.Header>
                        <Accordion.Collapse eventKey='0'>
                            <Card.Body>
                                {inputData}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card border='primary'>
                        <Card.Header eventKey='1'>
                            <Row>
                                <Col>
                                    <h2>2. Select Preprocessing Steps</h2>
                                </Col>
                                <Col>
                                    {(this.state.currentPanel === '1') && goBackButton1}
                                </Col>
                            </Row>
                        </Card.Header>
                        <Accordion.Collapse eventKey='1'>
                            <Card.Body>
                                {stepsForm}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card border='primary'>
                        <Card.Header eventKey='2'>
                            <Row>
                                <Col>
                                    <h2>3. Run Steps</h2>
                                </Col>
                                <Col>
                                    {(this.state.currentPanel === '2') && !(this.state.succeeded || this.state.failed) && goBackButton2}
                                </Col>
                            </Row>
                        </Card.Header>
                        <Accordion.Collapse eventKey='2'>
                            <Card.Body>
                                <Confirm files={this.files} steps={this.steps} onSubmit={this.commitOps} buttonDisabled={this.state.succeeded || this.state.failed} />
                                {this.state.inProgress && progressBar}
                                {(this.state.succeeded || this.state.failed) && statusComp}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <Footer />
            </React.Fragment>
        );
    }
}

export default App;
