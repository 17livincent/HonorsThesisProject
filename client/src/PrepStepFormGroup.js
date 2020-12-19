/**
 * PrepStepFormGroup.js
 * A FormGroup which serves as an input of a preprocessing/augmentation step form
 */

import React from 'react';
import {Form, Card, Col, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './PrepStepFormGroup.css';
//import './outline.css';

class PrepStepFormGroup extends React.Component {

    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
    }

    /**
     * A prop function passed from PrepStepsForm to update the above state
     */
    updateAbove(stepNumber, stepName, input) {
        stepNumber = (typeof stepNumber !== 'undefined') ? stepNumber : this.props.stepNumber;
        stepName = (typeof stepName !== 'undefined') ? stepName : this.props.stepName;
        input = (typeof input !== 'undefined') ? input : this.props.input;
        this.props.onFormGroupChange(stepNumber, stepName, input);
    }

    /**
     * Called when the delete button is pressed
     */
    onDelete() {
        this.props.onDelete(this.props.stepNumber);
    }

    // returns an input field
    getInputField(id, placeholder) {
        return (
            <Form.Control id={id}
                type='text' 
                placeholder={placeholder}
                onChange={(e) => {this.setState({input: e}); this.updateAbove(undefined, undefined, e.target.value)}}
                value={this.props.input}
                disabled={this.props.stepName === ''}>

            </Form.Control>
        );
    }

    // clears the input field of a step if not selected
    setInput(stepValSelected) {
        if(stepValSelected === '') {
            //let input = document.getElementById('inputField');
            //input.value = '';
        }
    }

    /**
     * Find the index in the transformations object of this stepVal
     * If the stepValSelected === '', then return -1
     */
    getStepIndex(stepValSelected) {
        let index = -1;
        if(stepValSelected !== '') {
            for(let i in this.props.steps) {
                if(stepValSelected === this.props.steps[i].val) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    // get a description label component based on the step name's index in the transformations object
    getDescription(index) {
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
    getCitation(index) {
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

    render() {
        // get list of step options
        let stepOptions = this.props.steps.length > 0 && this.props.steps.map((item, i) => {
            return (
                <option value={item.val}>{item.name}</option>
            );
        });

        // select input for specific step
        let selectStepName = <Form.Control id='selectStepName'
                                as='select'
                                required='required'
                                onChange={(e) => {
                                                    this.setInput(e.target.value); 
                                                    this.updateAbove(undefined, e.target.value, undefined)}}
                                value={this.props.stepName}>
                                    <option value=''>Select a step</option>
                                    {stepOptions}
                                </Form.Control>;


        //let numOfInputs = 
        let inputFields = [1,1].map(() => this.getInputField('inputField', 'Input'));

        // button to remove
        let deleteButton = <Button id='deleteButton' variant='outline-danger' onClick={this.onDelete}>Delete</Button>

        // index in transformations object of the selected step
        let index = this.getStepIndex(this.props.stepName);

        return (
            <React.Fragment>
                <Form.Group>
                    <Card border='primary' bg='light' text='dark'>
                        <Card.Body>
                            <Card.Title>Step {this.props.stepNumber}</Card.Title>
                            <Form.Row>
                                <Col xs={7}>
                                    {selectStepName}
                                </Col>
                                <Col xs='auto'>
                                    {inputFields}
                                </Col>
                                <Col id='dbCol' xs='auto'>
                                    {deleteButton}
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                {this.getDescription(index)}
                            </Form.Row>
                            <Form.Row>
                                {this.getCitation(index)}
                            </Form.Row>
                        </Card.Body>
                    </Card>
                </Form.Group>
            </React.Fragment>
        );
    }
}

export default PrepStepFormGroup;