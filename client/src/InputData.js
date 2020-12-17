/**
 * InputData.js
 * This component manages the input of multiple CSV files
 */

import React from 'react';
import {Form, Button, Col, Alert} from 'react-bootstrap';
import Space from './Space.js';

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
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Called when a file is selected
     */
    updateFiles(index, file) {
        //alert(`File ${index} changed`);
        // update files
        let newFiles = this.state.files.slice();
        newFiles.splice(index, 1, file);
        // update state
        this.setState({files: newFiles});
    }

    /**
     * Increments the state variable numOfFiles
     * If the last file input hasn't been filled, numOfFiles won't be incremented
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
            <React.Fragment>
                <Form.Row>
                    <Form.File 
                        id='fileInput'
                        accept='.csv, .png'
                        onChange={(e) => (this.updateFiles(index, e.target.value))}>
                    </Form.File>
                </Form.Row>
                <Space />
            </React.Fragment>
        );
    }

    onSubmit() {
        this.props.onSubmit();
        
    }

    render() {
        return (
            <React.Fragment id='main'>
                <h3>Select CSV files</h3>
                <Form id='files'>
                    {this.range(0, this.state.numOfFiles - 1, 1).map((i) => this.getFileInput(i))}
                </Form>
                <br />
                <Alert variant='light'>
                    FYI: To undo a file input, click on the corresponding "Choose File" and press "Cancel".
                </Alert>
                <Form.Row>
                    <Col>
                        <Button id='addButton' variant='secondary' onClick={this.incNumOfFiles} disabled={(this.state.files[this.state.numOfFiles - 1] !== '') ? false : true}>Input another file</Button>
                    </Col>
                    <Col>
                        <Button id='submitButton' variant='primary' onClick={this.onSubmit}>Submit</Button>
                    </Col>
                </Form.Row>
            </React.Fragment>
        );
    }
}

export default InputData;