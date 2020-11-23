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
            steps: Array(1).fill('1')   // array of steps [1, 2, 3, 4, ...]
        }

        this.addStep = this.addStep.bind(this);
        this.deleteStep = this.deleteStep.bind(this);
    }

    // adds a new step
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        this.setState({numOfSteps: nextStep});
        // add new step to this.state.steps
        let newSteps = this.state.steps.slice();
        newSteps.push(nextStep.toString());
        this.setState({steps: newSteps});

    }

    // handles deleting a step
    deleteStep(stepNumber) {
        if(stepNumber !== '1' && this.state.numOfSteps !== 1) {
            let currentSteps = this.state.steps.slice();
            let currentNumOfSteps = this.state.numOfSteps;
            // remove the step of stepNumber from the state.steps array
            let newSteps = currentSteps.slice();
            let index = newSteps.indexOf(stepNumber.toString());
            newSteps.splice(index, 1);
            // decrement state.numOfSteps
            let newNum = currentNumOfSteps -1;
            // update state
            this.setState({numOfSteps: newNum, steps: newSteps});

            alert(`Step ${stepNumber} deleted.`);
        }
        else {
            alert('The first step cannot be deleted.');
        }
        
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