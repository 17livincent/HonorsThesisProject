/**
 * StepsForm.js
 * This class manages an array of PrepStepFormGroups by handling form submit, stepNums add, and stepNums deletion
 */

import React from 'react';
import {Form, Col, Button} from 'react-bootstrap';

import StepFormGroup from './StepFormGroup';

import 'bootstrap/dist/css/bootstrap.min.css';
import './StepsForm.css';
//import './outline.css';

class StepsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfSteps: 1,
            stepNums: ['1'],    // array of step numbers
            formDetails: [this.getFormInfo('', 0), ],
            stepOptions: this.getTransformations()
        }

        this.getTransformations = this.getTransformations.bind(this);
        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.onFormGroupChange = this.onFormGroupChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Returns a dictionary containing stepname and array of inputs
     * @param stepName the formgroup's chosen step
     * @param numOfInputs the number of inputs associated with @param stepName 
     */
    getFormInfo(stepName, numOfInputs) {
        return (
            {
                step: stepName.toString(),
                inputs: Array(numOfInputs)
            }
        )
    }

    // return the object of transformation info
    getTransformations() {
        return (
            [
                {
                    name: 'Standardize', 
                    val: 'stand', 
                    numOfInputs: 0, 
                    inputNames: [], 
                    description: 'Transform the data to have a mean of 0, and a standard deviation of 1.', 
                    citation: ''
                },
                {
                    name: 'Normalize', 
                    val: 'norm', 
                    numOfInputs: 2, 
                    inputNames: ['Min', 'Max'], 
                    description: 'Rescale the range of the data to be between a min and max.', 
                    citation: ''
                },
                {
                    name: 'Moving average filter',
                    val: 'moving_avg',
                    numOfInputs: 1,
                    inputNames: ['Window size'],
                    description: 'Smooth data by calculating the average out of a defined number of data points.',
                    citation: ''
                }
            ]
        );
    }

    // adds a new stepNums
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        // add new stepNums to this.state.stepNums
        let newSteps = this.range(1, nextStep, 1);
        // push new element to formDetails
        let newFormDetails = this.state.formDetails.slice();
        newFormDetails.push(this.getFormInfo('', 0));
        // update state
        this.setState({numOfSteps: nextStep, stepNums: newSteps, formDetails: newFormDetails});

    }

    // handles deleting a stepNums
    deleteStep(stepNumber) {
        if(stepNumber !== '1' && this.state.numOfSteps !== 1) {
            // decrement state.numOfSteps
            let newNum = this.state.numOfSteps -1;
            // update stepNums array
            let newSteps = this.range(1, newNum, 1);
            // update formDetails
            let newFormDetails = this.state.formDetails.slice();
            newFormDetails.splice(stepNumber - 1, 1);
            // update state
            this.setState({numOfSteps: newNum, stepNums: newSteps, formDetails: newFormDetails});

            //alert(`stepNums ${stepNumber} deleted.`);            
            
        }
        else {
            //alert('The first stepNums cannot be deleted.');
        }
    }

    /**
     * Called when the inputs of a StepFormGroup are updated
     * @param stepNumber the step number of the formgroup
     * @param stepName the selected step name value
     * @param inputs the array of input arguments form the formgroup
     */
    onFormGroupChange(stepNumber, stepName, inputs) {
        // get index for this step
        let index = stepNumber - 1;
        // update stepname
        let newFormDetails = this.state.formDetails.slice();
        newFormDetails[index].step = stepName;
        // update inputs
        newFormDetails[index].inputs = inputs;
        // update state
        this.setState({formDetails: newFormDetails});
    }

    /**
     * Creates an array like the python range function.
     */
    range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }

    renderFormGroup(i) {
        return (
            <StepFormGroup 
                stepNumber={i} 
                stepName={this.state.formDetails[i - 1].step}
                inputs={this.state.formDetails[i - 1].inputs}
                steps={this.state.stepOptions} 
                onFormGroupChange={this.onFormGroupChange}
                onDelete={this.deleteStep}/>
        );
    }

    renderAddStepButton() {
        return (
            <Button id='addButton' variant='secondary' onClick={this.addStep}>Add step</Button>
        );
    }

    renderSubmitButton() {
        return (
            <Button id='submitButton' variant='primary' onClick={this.onSubmit}>Run steps</Button>
        );
    }

    /**
     * Handles the form submission
     */
    onSubmit() {
        alert("Submitted");
    }

    render() {
        return (
            <React.Fragment id='main'>
                <Form>
                    {this.state.stepNums.map((i) => (this.renderFormGroup(i)))}
                    <Form.Row>
                        <Col>
                            {this.renderAddStepButton()}
                        </Col>
                        <Col>
                            {this.renderSubmitButton()}
                        </Col>
                    </Form.Row>
                </Form>
                {console.log(this.state.formDetails)}
            </React.Fragment>
        );
    }

}

export default StepsForm;