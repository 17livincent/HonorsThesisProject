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
            currentPanel: '0',
            files: []
        }

        this.submitData = this.submitData.bind(this);
    }

    /**
     * Callback function passed to the InputData
     */
    submitData(files) {
        alert('CSV files submitted: ' + files);
        this.setState({files: files});
        // close this accordion, open the second
        this.setState({currentPanel: '1'});

    }

    render() {
        return (
            <div>
                <Accordion id='app' activeKey={this.state.currentPanel}>
                    <Card>
                        <Card.Header eventKey='0'>
                            <h2>1. Input Data</h2>
                        </Card.Header>
                        <Accordion.Collapse eventKey='0'>
                            <Card.Body>
                                <InputData id='main' onSubmit={this.submitData}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header eventKey='1'>
                            <h2>2. Select Preprocessing Steps</h2>
                        </Card.Header>
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
