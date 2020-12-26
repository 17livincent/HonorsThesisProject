/**
 * StepFormGroup.js
 * A FormGroup which serves as an input of a preprocessing/augmentation step form
 */

import React from 'react';
import {Form, Card, Col, Button} from 'react-bootstrap';
import Transformations from './Transformations.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/StepFormGroup.css';
//import './outline.css';

class StepFormGroup extends React.Component {

    /**
     * List of props used:
     * this.props.stepNumber
     * this.props.stepName
     * this.props.inputs
     * this.props.steps
     * this.props.onFormGroupChange
     * this.props.onDelete
     */
    
    /**
     * Object format for passing form details is:
     * {stepVal: '', inputs: Array(numOfInputs)}
     */

    constructor(props) {        
        super(props);

        this.recordedInputs = this.props.inputs;    // parameter to record the inputs

        this.onDelete = this.onDelete.bind(this);
    }

    /**
     * A prop function passed from PrepStepsForm to update the above state
     * @param stepNumber this formgroup's step number
     * @param stepName this formgroup's selected step name value
     * @param input one of this formgroup's inputs
     * @param inputIndex the index of the input to be updated
     */
    updateAbove(stepName, input, inputIndex) {
        let newStepName = (typeof stepName !== 'undefined') ? stepName : this.props.stepName;

        let trans = new Transformations();
        // set recordedInputs accordingly
        if(stepName === '' || this.props.steps[trans.getStepIndex(newStepName)].numOfInputs === 0) {   // if there is not step selected, or the step selected has 0 required inputs
            this.recordedInputs = [];
        }
        else {
            this.recordedInputs[inputIndex] = input;
        }
        this.props.onFormGroupChange(this.props.stepNumber, newStepName, this.recordedInputs.slice());
    }

    /**
     * Called when the delete button is pressed
     */
    onDelete() {
        this.props.onDelete(this.props.stepNumber);
    }

    // returns the step select input
    renderStepSelect() {
        // get list of step options
        let stepOptions = this.props.steps.length > 0 && this.props.steps.map((item, i) => {
            return (
                <option value={item.val}>{item.name}</option>
            );
        });

        return (
            <Form.Control id='selectStepName'
                as='select'
                required='required'
                onChange={(e) => {this.updateAbove(e.target.value, undefined, undefined)}}
                value={this.props.stepName}>
                <option value=''>Select a step</option>
                {stepOptions}
            </Form.Control>
        );
        
    }

    // returns an input field
    getInputField(id, placeholder) {
        return (
            <Form.Control id={id}
                type='number' 
                required='true'
                placeholder={placeholder}
                onChange={(e) => {this.setState({input: e}); this.updateAbove(undefined, e.target.value, id)}}
                value={this.props.inputs[id]}>

            </Form.Control>
        );
    }

    // gets the right number of input fields based on the step index
    renderInputFields(index) {
        // get the corresponding number of input fields
        let numOfInputs;
        try {
            numOfInputs = this.props.steps[index].numOfInputs;
        }
        catch(e) {
            numOfInputs = 0;
        }
        // get the input names
        let inputNames;
        try {
            inputNames = this.props.steps[index].inputNames.slice();
        }
        catch(e) {
            inputNames = [];
        }
        let array = (numOfInputs !== 0) ? (this.range(0, numOfInputs - 1, 1)) : [];
        let inputFields = array.map((i) => this.getInputField(i, inputNames[i]));
    
        return inputFields;
    }

    // get a description label component based on the step name's index in the transformations object
    renderDescription(index) {
        let desc;
        if(index === -1) {
            desc = '';
        }
        else {
            if(this.props.steps[index].description !== '') {
                desc =  <React.Fragment><b>Description: </b> {this.props.steps[index].description}</React.Fragment>;
            }
            else {
                desc = '';
            }
        }
        return (
            <Form.Label>{desc}</Form.Label>
        );
    }

    // get a citation label component based on the step name's index in the transformations object
    renderCitation(index) {
        let cit;
        if(index === -1) {
            cit = '';
        }
        else {
            if(this.props.steps[index].citation !== '') {
                cit = <React.Fragment><b>Citation: </b> {this.props.steps[index].citation}</React.Fragment>;
            }
            else {
                cit = '';
            }
        }
        return (
            <Form.Label>{cit}</Form.Label>
        );
    }

    renderDeleteButton() {
        return (
            <Button id='deleteButton' variant='outline-danger' onClick={this.onDelete}>Delete</Button>
        );
    }

    /**
     * Creates an array like the python range function.
     */
    range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }

    render() {
        // index in transformations object of the selected step
        let trans = new Transformations();
        let index = trans.getStepIndex(this.props.stepName);

        return (
            <React.Fragment>
                <Form.Group>
                    <Card border='primary' bg='light' text='dark'>
                        <Card.Body>
                            <Card.Title>Step {this.props.stepNumber}</Card.Title>
                            <Form.Row>
                                <Col xs={7}>
                                    {this.renderStepSelect()}
                                </Col>
                                <Col xs='auto'>
                                    {this.renderInputFields(index)}
                                </Col>
                                <Col id='dbCol' xs='auto'>
                                    {this.renderDeleteButton()}
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                {this.renderDescription(index)}
                            </Form.Row>
                            <Form.Row>
                                {this.renderCitation(index)}
                            </Form.Row>
                        </Card.Body>
                    </Card>
                </Form.Group>
            </React.Fragment>
        );
    }
}

export default StepFormGroup;