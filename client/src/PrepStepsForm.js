/**
 * PrepStepsForm.js
 * This class manages an array of PrepStepFormGroups by handling form submit, stepNums add, and stepNums deletion
 */

import React from 'react';
import {Form, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
//import './outline.css';

import PrepStepFormGroup from './PrepStepFormGroup';

class PrepStepsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            numOfSteps: 1,
            stepNums: ['1'],    // array of step numbers
            stepNames: [''],     // array of selected steps
            inputs: ['']        // array of inputs
        }

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
    }

    // adds a new stepNums
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        // add new stepNums to this.state.stepNums
        let newSteps = this.range(1, nextStep, 1);
        // push new element to stepNames
        let newStepNames = this.state.stepNames.slice();
        newStepNames.push('');
        // push new element to inputs
        let newInputs = this.state.inputs.slice();
        newInputs.push('');
        // update state
        this.setState({numOfSteps: nextStep, stepNums: newSteps, stepNames: newStepNames, inputs: newInputs});

    }

    // handles deleting a stepNums
    deleteStep(stepNumber) {
        if(stepNumber !== '1' && this.state.numOfSteps !== 1) {
            // decrement state.numOfSteps
            let newNum = this.state.numOfSteps -1;
            // update stepNums array
            let newSteps = this.range(1, newNum, 1);
            // update stepNames
            let newStepNames = this.state.stepNames.slice();
            newStepNames.splice(stepNumber - 1, 1);
            // update inputs
            let newInputs = this.state.inputs.slice();
            newInputs.splice(stepNumber - 1, 1);
            // update state
            this.setState({numOfSteps: newNum, stepNums: newSteps, stepNames: newStepNames, inputs: newInputs});

            //alert(`stepNums ${stepNumber} deleted.`);            
            
        }
        else {
            alert('The first stepNums cannot be deleted.');
        }
        
    }

    /**
     * Creates an array like the python range function.
     */
    range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }

    renderPSFormGroup(i) {
        return <PrepStepFormGroup stepNumber={i} onDelete={() => this.deleteStep(i)}/>;
    }

    render() {

        let addStepButton = <Button onClick={this.addStep}>Add step</Button>;

        return (
            <div>
                <Form>
                    {this.state.stepNums.map((i) => (this.renderPSFormGroup(i)))}
                    {addStepButton} <br />
                    stepNums: {this.state.stepNums} <br />
                    NumOfSteps: {this.state.numOfSteps}
                </Form>
            </div>
        );
    }

}

export default PrepStepsForm;