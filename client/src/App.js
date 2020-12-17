/**
 * The highest-level component of the web app.
 */
import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

import InputData from './InputData.js';
import PrepStepsForm from './PrepStepsForm.js';
import Footer from './Footer.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
//import './outline.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPanel: '0'
        }

        this.submitData = this.submitData.bind(this);
    }

    /**
     * Callback function passed to the InputData
     */
    submitData() {
        alert('CSV files submitted');
        this.setState({currentPanel: '1'});
        // close this accordion, open the second

    }

    render() {
        return (
            <div>
                <Accordion id='app' defaultActiveKey='0'>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey='0'>
                            <h2>1. Input Data</h2>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey='0'>
                            <Card.Body>
                                <InputData id='main' onSubmit={this.submitData}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey='1'>
                            <h2>2. Select Preprocessing Steps</h2>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey='1'>
                            <Card.Body>
                                <PrepStepsForm id='main' />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <Footer />
            </div>
            
        );
        
    }
}

export default App;
