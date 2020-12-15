/**
 * InputData.js
 * This component manages the input of multiple CSV files
 */

import React from 'react';
import {Form, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './InputData.css';
import './outline.css';

class InputData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfFiles: 1,
            files: []
        }

        this.incNumOfFiles = this.incNumOfFiles.bind(this);
    }

    /**
     * Called when a file is selected
     */
    updateFiles(index) {
        alert(`File ${index} changed`);
    }

    /**
     * Increments the state variable numOfFiles
     */
    incNumOfFiles() {
        let newNum = this.state.numOfFiles + 1;
        this.setState({numOfFiles: newNum});
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
                onChange={() => (this.updateFiles(index))}>
            </Form.File>
        );
    }

    render() {
        return (
            <React.Fragment id='main'>
                <h2>Select CSV files</h2>
                <Form>
                    {this.range(0, this.state.numOfFiles - 1, 1).map((i) => this.getFileInput(i))}
                </Form>
                <br />
                <Button onClick={this.incNumOfFiles}>Input another file</Button>
            </React.Fragment>
        );
    }
}

export default InputData;