/**
 * InputData.js
 * This component manages the input of multiple CSV files
 */

import React from 'react';
import {Form, Button, Col} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './InputData.css';
//import './outline.css';

class InputData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfFiles: 1,
            files: ['']
        }

        this.incNumOfFiles = this.incNumOfFiles.bind(this);
    }

    /**
     * Called when a file is selected
     */
    updateFiles(index, file) {
        alert(`File ${index} changed`);
        // update files
        let newFiles = this.state.files.slice();
        newFiles.splice(index, 1, file);
        // update state
        this.setState({files: newFiles});
    }

    /**
     * Increments the state variable numOfFiles
     */
    incNumOfFiles() {
        // get new numOfFiles
        let newNum = this.state.numOfFiles + 1;
        // get new files
        let newFiles = this.state.files.slice();
        newFiles.push('');
        // update state
        this.setState({numOfFiles: newNum, files: newFiles});
    }

    /**
     * Creates an array like the python range function.
     */
    range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }

    getFileInput(index) {
        return (
            <Form.File 
                accept='.csv, .png'
                onChange={(e) => (this.updateFiles(index, e.target.value))}>
            </Form.File>
        );
    }

    render() {
        return (
            <React.Fragment id='main'>
                <h3>Select CSV files</h3>
                <Form>
                    {this.range(0, this.state.numOfFiles - 1, 1).map((i) => this.getFileInput(i))}
                </Form>
                <br />
                <Form.Row>
                    <Col>
                        <Button id='addButton' variant='secondary' onClick={this.incNumOfFiles}>Input another file</Button>
                    </Col>
                    <Col>
                        <Button id='submitButton' variant='primary' type='submit'>Submit</Button>
                    </Col>
                </Form.Row>
            </React.Fragment>
        );
    }
}

export default InputData;