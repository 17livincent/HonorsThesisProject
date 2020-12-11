/**
 * PrepStepsForm.js
 * This class manages an array of PrepStepFormGroups by handling form submit, step add, and step deletion
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
            steps: ['1']
        }

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
    }

    // adds a new step
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        // add new step to this.state.steps
        let newSteps = this.range(1, nextStep, 1);
        // update state
        this.setState({numOfSteps: nextStep, steps: newSteps});

    }

    // handles deleting a step
    deleteStep(stepNumber) {
        if(stepNumber !== '1' && this.state.numOfSteps !== 1) {
            let currentNumOfSteps = this.state.numOfSteps;

            // decrement state.numOfSteps
            let newNum = currentNumOfSteps -1;
            // update steps array
            let newSteps = this.range(1, newNum, 1);
            // update state
            this.setState({numOfSteps: newNum, steps: newSteps});

            //alert(`Step ${stepNumber} deleted.`);            
            
        }
        else {
            alert('The first step cannot be deleted.');
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

        let addStepButton = <Button onClick={this.addStep}>Add Step</Button>;

        return (
            <div>
                <Form>
                    {this.state.steps.map((i) => (this.renderPSFormGroup(i)))}
                    {addStepButton} <br />
                    Steps: {this.state.steps} <br />
                    NumOfSteps: {this.state.numOfSteps}
                </Form>
            </div>
        );
    }

}

export default PrepStepsForm;