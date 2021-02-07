/**
 * InputData.js
 * @author Vincent Li <vincentl@asu.edu>
 * This component manages the input of multiple CSV files.
 */
import React from 'react';
import {Form, Button, Col, Alert} from 'react-bootstrap';
import Space from './Space.js';
import Util from './util.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/InputData.css';
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

    getFileInput(index) {
        return (
            <React.Fragment>
                <Form.Row>
                    <Form.File 
                        id='fileInput'
                        accept='.csv'
                        onChange={(e) => (this.updateFiles(index, e.target.files[0]))}>
                    </Form.File>
                </Form.Row>
                <Space />
            </React.Fragment>
        );
    }

    /**
     * Called when the Submit button is pressed
     * Processes the files array and passes it to a callback
     */
    onSubmit(event) {
        event.preventDefault();
        // remove blanks from files
        let newFiles = this.state.files.slice().filter((element) => (element !== ''));
        let newNum = newFiles.length;

        this.setState({files: newFiles, numOfFiles: newNum});
        this.props.onSubmit(newFiles.slice());
    }

    /**
     * Conditionally disable the "Input another file" button
     */
    disableAdd() {
        return (this.state.files[this.state.numOfFiles - 1] !== '') ? false : true;
    }

    /**
     * Conditionally disable the "Submit" button
     */
    disableSubmit() {
        let status = true;
        let files = this.state.files;
        for(let index in files) {
            if(files[index] !== '') {
                status = false;
                break;
            }
        }
        return status;
    }

    // returns all file inputs
    renderFileInputs() {
        return Util.range(0, this.state.numOfFiles - 1, 1).map((i) => this.getFileInput(i));
    }

    // returns a button to add a file
    renderAddFileButton() {
        return (
            <Button 
                id='addButton' 
                variant='secondary' 
                onClick={this.incNumOfFiles} 
                disabled={(this.state.files[this.state.numOfFiles - 1] !== '') ? false : true}>
                Input another file
            </Button>
        );
    }

    // returns the submit data button
    renderSubmitButton() {
        return (
            <Button 
                id='submitButton' 
                variant='primary' 
                type='submit'
                disabled={this.disableSubmit()}>
                Submit
            </Button>
        );
    }

    render() {
        return (
            <React.Fragment id='main'>
                <h3>Select CSV files</h3>
                <Form onSubmit={this.onSubmit}>
                    <div id='files'>
                        {this.renderFileInputs()}
                    </div>
                    <Alert variant='light'>
                        FYI: Files must contain headers only on the first row and not have an index column.<br />
                        To undo a file input, click on the corresponding "Choose File" and press "Cancel", or refresh the page.
                    </Alert>
                    <Form.Row>
                        <Col>
                            {this.renderAddFileButton()}
                        </Col>
                        <Col>
                            {this.renderSubmitButton()}
                        </Col>
                    </Form.Row>
                </Form>
            </React.Fragment>
        );
    }
}

export default InputData;