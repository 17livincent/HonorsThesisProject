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
    }

    componentDidMount() {

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

    renderPSFormGroup(i) {
        return <PrepStepFormGroup stepNumber={i} />;
    }

    render() {

        let addStepButton = <Button onClick={this.addStep}>Add Step</Button>;

        return (
            <div>
                <Form>
                    {this.state.steps.map((i) => (this.renderPSFormGroup(i)))}
                    {addStepButton}
                    {this.state.steps}
                </Form>
            </div>
        );
    }

}

export default PrepStepsForm;