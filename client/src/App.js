/**
 * The highest-level component of the web app.
 */
import React from 'react';
import {Accordion, Card, Col, Row, Button} from 'react-bootstrap';

import Header from './Header.js';
import HomeInfo from './HomeInfo.js';
import InputData from './InputData.js';
import StepsForm from './StepsForm.js';
import Confirm from './Confirm.js';
import Footer from './Footer.js';

import socketIOClient from 'socket.io-client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
//import './outline.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        // socket to send and receive data from server
        this.socket = socketIOClient('web-app.li-vincent.com:3000');
        // FileList of inputted files
        this.files = [];
        // array of selected steps
        this.steps = [];

        this.state = {
            currentPanel: '0'
        }

        this.submitData = this.submitData.bind(this);
        this.submitSteps = this.submitSteps.bind(this);
        this.commitOps = this.commitOps.bind(this);
    }

    componentWillMount() {
        // verify connection
        this.socket.on('connection', () => {
            console.log(`Connected to server with socket ID: ${this.socket.id}`);
        });
    }

    /**
     * Callback function passed to the InputData
     */
    submitData(files) {
        console.log('Files submitted:');
        console.log(files);
        this.files = files;
        // close this accordion, open the second
        this.setState({currentPanel: '1'});
    }

    /**
     * Callback function passed to the StepsForm
     */
    submitSteps(steps) {
        console.log(`Steps submitted: ${JSON.stringify(steps)}`);
        this.steps = steps;
        // close this accordion, open the next
        this.setState({currentPanel: '2'});
    }

    /**
     * Called in step 3 if the user presses the 'Confirm" button.
     */
    commitOps() {
        console.log('Files and steps confirmed.');
        this.sendSteps();

    }

    /**
     * Sends the steps object to the server
     */
    sendSteps() {
        this.socket.emit('submit', this.steps, (callback) => {
            console.log(callback);
        });
    }

    render() {
        let inputData = <InputData id='main' onSubmit={this.submitData}/>;
        let stepsForm = <StepsForm id='main' onSubmit={this.submitSteps}/>;
        let goBackButton1 = <Button id='goback1' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '0'}))}>Go back</Button>;
        let goBackButton2 = <Button id='goback2' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '1'}))}>Go back</Button>;

        return (
            <React.Fragment>
                <Header />
                <HomeInfo />
                <Accordion id='app' activeKey={this.state.currentPanel}>
                    <Card>
                        <Card.Header eventKey='0'>
                            <h2>1. Input Data</h2>
                        </Card.Header>
                        <Accordion.Collapse eventKey='0'>
                            <Card.Body>{inputData}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
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
                            <Card.Body>{stepsForm}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header eventKey='2'>
                            <Row>
                                <Col>
                                    <h2>3. Run Steps</h2>
                                </Col>
                                <Col>
                                    {(this.state.currentPanel === '2') && goBackButton2}
                                </Col>
                            </Row>
                        </Card.Header>
                        <Accordion.Collapse eventKey='2'>
                            <Card.Body>
                                <Confirm files={this.files} steps={this.steps} onSubmit={this.commitOps}/>
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
