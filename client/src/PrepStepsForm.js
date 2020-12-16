/**
 * PrepStepsForm.js
 * This class manages an array of PrepStepFormGroups by handling form submit, stepNums add, and stepNums deletion
 */

import React from 'react';
import {Form, Col, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './PrepStepsForm.css';
//import './outline.css';

import PrepStepFormGroup from './PrepStepFormGroup';

class PrepStepsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            numOfSteps: 1,
            stepNums: ['1'],    // array of step numbers
            stepVals: [''],     // array of selected steps
            inputs: [''],        // array of inputs
            stepOptions: [
                {name: 'StepName', val: 'optionValue', description: 'stepDescription', citation: 'stepCitation'},
                {name: 'Option1', val: 'option1', description: 'description1', citation: 'citation1'},
                {name: 'Option2', val: 'option2', description: 'description2', citation: 'citation2'},
                {name: 'Option3', val: 'option3', description: 'description3', citation: 'citation3'}
            ]
        }

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
        this.onFormGroupChange = this.onFormGroupChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // adds a new stepNums
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        // add new stepNums to this.state.stepNums
        let newSteps = this.range(1, nextStep, 1);
        // push new element to stepVals
        let newStepNames = this.state.stepVals.slice();
        newStepNames.push('');
        // push new element to inputs
        let newInputs = this.state.inputs.slice();
        newInputs.push('');
        // update state
        this.setState({numOfSteps: nextStep, stepNums: newSteps, stepVals: newStepNames, inputs: newInputs});

    }

    // handles deleting a stepNums
    deleteStep(stepNumber) {
        if(stepNumber !== '1' && this.state.numOfSteps !== 1) {
            // decrement state.numOfSteps
            let newNum = this.state.numOfSteps -1;
            // update stepNums array
            let newSteps = this.range(1, newNum, 1);
            // update stepVals
            let newStepNames = this.state.stepVals.slice();
            newStepNames.splice(stepNumber - 1, 1);
            // update inputs
            let newInputs = this.state.inputs.slice();
            newInputs.splice(stepNumber - 1, 1);
            // update state
            this.setState({numOfSteps: newNum, stepNums: newSteps, stepVals: newStepNames, inputs: newInputs});

            //alert(`stepNums ${stepNumber} deleted.`);            
            
        }
        else {
            alert('The first stepNums cannot be deleted.');
        }
        
    }

    /**
     * Called when the inputs of a PrepStepFormGroup are updated
     */
    onFormGroupChange(stepNumber, stepName, input) {
        // get index for this step
        let index = stepNumber - 1;
        // create updated stepVals
        let newStepNames = this.state.stepVals.slice();
        newStepNames.splice(index, 1, stepName);
        // create updated inputs
        let newInputs = this.state.inputs.slice();
        newInputs.splice(index, 1, input);
        // update state
        this.setState({stepVals: newStepNames, inputs: newInputs});
    }

    /**
     * Creates an array like the python range function.
     */
    range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }

    renderPSFormGroup(i) {
        return <PrepStepFormGroup 
                    stepNumber={i} 
                    stepName={this.state.stepVals[i - 1]}
                    input={this.state.inputs[i - 1]}
                    steps={this.state.stepOptions} 
                    onFormGroupChange={this.onFormGroupChange}
                    onDelete={this.deleteStep}/>;
    }

    /**
     * Handles the form submission
     */
    onSubmit() {
        alert("Submitted");
    }

    render() {
        let addStepButton = <Button id='addButton' variant='secondary' onClick={this.addStep}>Add step</Button>;
        let submitButton = <Button id='submitButton' variant='primary' type='submit'>Run steps</Button>;

        return (
            <React.Fragment id='main'>
                <Form onSubmit={this.onSubmit}>
                    {this.state.stepNums.map((i) => (this.renderPSFormGroup(i)))}
                    <Form.Row>
                        <Col>
                            {addStepButton}
                        </Col>
                        <Col>
                            {submitButton}
                        </Col>
                    </Form.Row>
                </Form>
            </React.Fragment>
        );
    }

}

export default PrepStepsForm;