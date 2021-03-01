/**
 * InputData.js
 * @author Vincent Li <vincentl@asu.edu>
 * This component manages the input of multiple CSV files.
 */
import React from 'react';
import {Form, Button, Col, Alert} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/InputData.css';
//import './outline.css';

class InputData extends React.Component {
    constructor(props) {
        super(props);

        this.files = [];

        this.state = {
            filesAdded: false   // used to disable submit button on condition
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Updates this.files when the file input is changed
     */
    updateFiles(fileList) {
        this.files = Array.from(fileList);
        console.log(this.files);
        // update submit button
        if(this.files.length !== 0) this.setState({filesAdded: true});
        else this.setState({filesAdded: false});
    }

    /**
     * Called when the Submit button is pressed
     * Processes the files array and passes it to a callback
     */
    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.files);
    }

    // returns the submit data button
    renderSubmitButton() {
        return (
            <Button 
                id='submitButton' 
                variant='primary' 
                type='submit'
                disabled={!this.state.filesAdded}>
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
                        <input type='file'
                            accept='.csv'
                            multiple
                            onChange={(e) => (this.updateFiles(e.target.files))}
                        />
                    </div>
                    
                    <Alert variant='light'>
                        Files must contain headers only on the first row and should not have an index column.<br />
                        To undo file input, simply reselect files or refresh the page.
                    </Alert>
                    <Form.Row>
                        <Col></Col>
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