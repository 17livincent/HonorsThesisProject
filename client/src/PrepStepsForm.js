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
            steps: Array(1).fill(1)   // array of steps [1, 2, 3, 4, ...]
        }

        this.renderFormGroups = this.renderFormGroups.bind(this);
        this.addStep = this.addStep.bind(this);
    }

    componentDidMount() {

    }

    // adds a new step
    addStep() {
        let currentState = this.state;
        let currentSteps = currentState.steps[currentState.steps.length - 1];
        let nextStep = currentState.numOfSteps;
        this.setState({numOfSteps: nextStep, steps: currentSteps.slice().push(nextStep)});
    }

    renderPSFormGroup(i) {
        return (
            <PrepStepFormGroup stepNumber={i} />
        );
    }

    renderFormGroups() {
        return (this.state.steps).map((stepNumber) => (<PrepStepFormGroup stepNumber={stepNumber} />));
    }

    render() {

        let addStepButton = <Button onClick={this.addStep}>Add Step</Button>;

        return (
            <div>
                <Form>
                    {addStepButton}
                    {this.state.steps}
                </Form>
            </div>
        );
    }

}

export default PrepStepsForm;