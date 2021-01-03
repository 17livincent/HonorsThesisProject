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

        this.state = {
            currentPanel: '0',
            files: [],
            steps: []
        }

        this.submitData = this.submitData.bind(this);
        this.submitSteps = this.submitSteps.bind(this);
    }

    /**
     * Callback function passed to the InputData
     */
    submitData(files) {
        console.log(`Files submitted: ${files.toString()}`);
        this.setState({files: files});
        // close this accordion, open the second
        this.setState({currentPanel: '1'});
    }

    /**
     * Callback function passed to the StepsForm
     */
    submitSteps(steps) {
        console.log('Steps submitted:');
        console.log(steps);
        this.setState({steps: steps});
        // close this accordion, open the next
        this.setState({currentPanel: '2'});
    }

    /**
     * Called in step 3 if the user presses the 'Confirm" button.
     * 
     */
    commitOps() {
        const ENDPOINT = 'https://localhost:3000';
        console.log('Files and steps confirmed.');
        let socket = socketIOClient(ENDPOINT, {
            secure: true,
        });

        socket.on('connection', () => {
            console.log('Connected to server');
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
                                <Confirm files={this.state.files} steps={this.state.steps} onSubmit={this.commitOps}/>
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
