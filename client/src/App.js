/**
 * The highest-level component of the web app.
 */
import React from 'react';
import {Accordion, Card, Col, Row, Button, Alert} from 'react-bootstrap';

import Header from './Header.js';
import HomeInfo from './HomeInfo.js';
import InputData from './InputData.js';
import StepsForm from './StepsForm.js';
import Footer from './Footer.js';
import Transformations from './Transformations.js';
import Util from './Util.js';

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
     * Returns a component with the names of the files chosen
     */
    displayFiles() {
        return (
            this.state.files.length > 0 && this.state.files.map((file) => 
                <React.Fragment>
                    {file.replace('C:\\fakepath\\', '')}<br />
                </React.Fragment>
            )   // remove the fakepath if its there
        );
    }

    /**
     * Returns a component with the sequences of chosen steps and their inputs
     */
    displaySteps() {
        let trans = new Transformations();
        let transformations = trans.getTransformations();
        let steps = this.state.steps;
        let counter = 0;
        return steps.map((i) => {
            counter++;
            // find the index of this step
            let index = trans.getStepIndex(i.step);
            // get the step name
            let stepName = transformations[index].name;
            // get the input names and inputs
            let inputInfo;
            if(transformations[index].numOfInputs !== 0) {
                let inputNames = transformations[index].inputNames.slice();
                let inputs = i.inputs.slice();
                inputInfo = Util.range(0, transformations[index].numOfInputs - 1, 1).map((j) => (<React.Fragment>{inputNames[j]}: {inputs[j]}&emsp;</React.Fragment>));
            }
            return (
                <React.Fragment>
                    <br />{counter}: {stepName}<br />&emsp;{inputInfo}
                </React.Fragment>
            );
        });
    }

    render() {
        let inputData = <InputData id='main' onSubmit={this.submitData}/>;
        let stepsForm = <StepsForm id='main' onSubmit={this.submitSteps}/>;
        let goBackButton1 = <Button id='goback1' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '0'}))}>Go back</Button>;
        let goBackButton2 = <Button id='goback2' variant='outline-secondary' onClick={() => (this.setState({currentPanel: '1'}))}>Go back</Button>;

        let inputDataSummary = <Alert variant='success'><b>Files chosen: </b><br /> {this.displayFiles()}</Alert>;
        let stepsSummary = <Alert variant='success'><b>Steps chosen: </b>{this.displaySteps()}</Alert>;

        return (
            <React.Fragment>
                <Header />
                <HomeInfo />
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
                                    {(this.state.currentPanel > 1) && stepsSummary}
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
                    </Card>
                </Accordion>
                <Footer />
            </React.Fragment>
            
        );
        
    }
}

export default App;
