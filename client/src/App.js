/**
 * The highest-level component of the web app.
 */
import React from 'react';
import {Accordion, Card, Col, Row, Button, Alert} from 'react-bootstrap';

import InputData from './InputData.js';
import StepsForm from './StepsForm.js';
import Footer from './Footer.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
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
    }

    render() {
        let inputData = <InputData id='main' onSubmit={this.submitData}/>;
        let stepsForm = <StepsForm id='main' onSubmit={this.submitSteps}/>;
        let goBackButton1 = <Button id='goback1' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '0'}))}>Go back</Button>;

        let displayFiles = this.state.files.length > 0 && this.state.files.map((file) => <React.Fragment>{file.replace('C:\\fakepath\\', '')}<br /></React.Fragment>);   // remove the fakepath if its there
        let inputDataSummary = <Alert variant='success'><b>Files chosen: </b><br /> {displayFiles}</Alert>;

        return (
            <div>
                <Accordion id='app' activeKey={this.state.currentPanel}>
                    <Card>
                        <Card.Header eventKey='0'>
                            <h2>1. Input Data</h2>
                            {(this.state.currentPanel !== '0') && inputDataSummary}
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
                </Accordion>
                <Footer />
            </div>
            
        );
        
    }
}

export default App;
