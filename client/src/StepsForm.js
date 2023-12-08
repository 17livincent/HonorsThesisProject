/**
 * StepsForm.js
 * @author Vincent Li <vincentl@asu.edu>
 * This class manages an array of PrepStepFormGroups by handling form submit, stepNums add, and stepNums deletion
 */
import React from 'react';
import {Form, Row, Col, Button, Alert} from 'react-bootstrap';

import StepFormGroup from './StepFormGroup.js';
import Transformations from './Transformations.js';
import Util from './Util.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/StepsForm.css';
//import './outline.css';

class StepsForm extends React.Component {

    constructor(props) {
        super(props);
        this.trans = new Transformations();
        this.transformations = this.trans.getTransformations();
        this.errors = [];   // string of errors from input validation
        
        this.state = {
            numOfSteps: 1,
            stepNums: ['1'],    // array of step numbers
            formDetails: [this.getFormInfo('', 0)],
            stepOptions: this.transformations,
            displayErrors: false
        }

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
                name: stepName.toString(),
                inputs: Array(numOfInputs)
            }
        )
    }

    // adds a new stepNums
    addStep() {
        // increment this.state.numOfSteps
        let nextStep = this.state.numOfSteps + 1;
        // add new stepNums to this.state.stepNums
        let newSteps = Util.range(1, nextStep, 1);
        // push new element to formDetails
        let newFormDetails = this.state.formDetails.slice();
        newFormDetails.push(this.getFormInfo('', 0));
        // update state
        this.setState({numOfSteps: nextStep, stepNums: newSteps, formDetails: newFormDetails});

    }

    // handles deleting a stepNums
    deleteStep(stepNumber) {
        if(this.state.numOfSteps !== 1) {   // there is >1 step
            // decrement state.numOfSteps
            let newNum = this.state.numOfSteps -1;
            // update stepNums array
            let newSteps = Util.range(1, newNum, 1);
            // update formDetails
            let newFormDetails = this.state.formDetails.slice();
            newFormDetails.splice(stepNumber - 1, 1);
            // update state
            this.setState({numOfSteps: newNum, stepNums: newSteps, formDetails: newFormDetails});            
        }
        else {  // if there is only one step, clear its selection
            let newStep1 = this.getFormInfo('', 0);
            console.log(newStep1);
            // update state
            this.setState({formDetails: [newStep1]});
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
        newFormDetails[index].name = stepName;
        // update inputs
        newFormDetails[index].inputs = inputs;
        // update state
        this.setState({formDetails: newFormDetails});
    }

    renderFormGroup(i) {
        return (
            <StepFormGroup 
                key={i}
                stepNumber={i} 
                stepName={this.state.formDetails[i - 1].name}
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
            <Button id='submitButton' type='submit' variant='primary'>Run steps</Button>
        );
    }

    renderErrors() {
        return (
            <React.Fragment>
                <br />
                <Alert variant='danger'>
                    <b>Errors: </b><br />
                    {this.errors.map(i => (
                        <React.Fragment>
                            {i}<br />
                        </React.Fragment>
                    ))}
                </Alert>
            </React.Fragment>
        );
    }

    /**
     * Handles the form submission
     */
    onSubmit(event) {
        event.preventDefault();

        // validate all inputs
        let form = this.state.formDetails.slice();
        let okToSubmit = true;  // whether all validation rules have been met
        this.errors = [];   // reset errors if necessary
        // run through validation rules.  If any are violated, don't submit
        for(let i = 0; i < form.length; i++) {  // iterate through each step selected
            let stepIndex = this.trans.getStepIndex(form[i].name);  // get step index
            let inputs = form[i].inputs;
            for(let j = 0; j < this.transformations[stepIndex].rules.length; j++) {    // iterate through each validation rule
                if(this.transformations[stepIndex].rules[j](inputs) === false) {    // if a rule has been violated
                    okToSubmit = false;
                    this.errors.push(`Step ${i + 1}: ${this.transformations[stepIndex].ruleDescs[j]}`);
                }
            }
        }
        // if all validation rules have been met, submit 
        if(okToSubmit === true) {
            this.setState({displayErrors: false});
            this.props.onSubmit(form.slice());
        }
        else {
            this.setState({displayErrors: true});
        }
    }

    render() {
        return (
            <React.Fragment key='main'>
                <Form onSubmit={this.onSubmit}>
                    {this.state.stepNums.map((i) => (this.renderFormGroup(i)))}
                        <Row>
                        <Col>
                            {this.renderAddStepButton()}
                        </Col>
                        <Col>
                            {this.renderSubmitButton()}
                        </Col>
                        </Row>
                    {this.state.displayErrors && this.renderErrors()}
                </Form>
            </React.Fragment>
        );
    }
}

export default StepsForm;