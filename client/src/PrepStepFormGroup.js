/**
 * PrepStepFormGroup.js
 * A FormGroup which serves as an input of a preprocessing/augmentation step form
 */

import React from 'react';
import {Form, Card, Col, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
//import './outline.css';

class PrepStepFormGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stepNumber: this.props.stepNumber,  // step number
            stepName: this.props.stepName || '',    // step name
            input: this.props.input || '',
            description: '',    // step description, if applicable
            citation: '',   // step citation, if applicable

            steps: this.props.steps || [],  // array of step options
        };

    }

    /**
     * A prop function passed from PrepStepsForm to update the above state
     */
    updateAbove(stepNumber, stepName, input) {
        stepNumber = (typeof stepNumber !== 'undefined') ? stepNumber : this.state.stepNumber;
        stepName = (typeof stepName !== 'undefined') ? stepName : this.state.stepName;
        input = (typeof input !== 'undefined') ? input : this.state.input;
        this.props.onFormGroupChange(stepNumber, stepName, input);
    }

    // returns an input field
    getInputField(id, placeholder) {
        return (
            <Col>
                <Form.Control id={id}
                    type='text' 
                    placeholder={placeholder}
                    onChange={(e) => {this.setState({input: e}); this.updateAbove(undefined, undefined, e)}}
                    disabled={this.state.stepName === ''}>

                </Form.Control>
            </Col>
        );
    }

    // clears the input field of a step if not selected
    setInput(stepValSelected) {
        if(stepValSelected === '') {
            let input = document.getElementById('inputField');
            input.value = '';
        }
    }

    // assign the corresponding info to state.description of the chosen step
    setDescription(stepValSelected) {
        if(stepValSelected === '') {
            this.setState({description: ''});
        }
        else {
            for(let i in this.state.steps) {
                if(stepValSelected === this.state.steps[i].val) {
                    this.setState({description: this.state.steps[i].description});
                }
            }
        }
    }

    // assign the corresponding info to state.citation of the chosen step
    setCitation(stepValSelected) {
        if(stepValSelected === '') {
            this.setState({citation: ''});
        }
        else {
            for(let i in this.state.steps) {
                if(stepValSelected === this.state.steps[i].val) {
                    this.setState({citation: this.state.steps[i].citation});
                }
            }
        }
    }

    render() {
        // get list of step options
        let stepOptions = this.state.steps.length > 0 && this.state.steps.map((item, i) => {
            return (
                <option value={item.val}>{item.name}</option>
            );
        });

        // select input for specific step
        let selectStepName = <Form.Control id='selectStepName'
                                as='select'
                                required='required'
                                onChange={(e) => {this.setInput(e.target.value); 
                                                    this.setState({stepName: e.target.value}); 
                                                    this.setDescription(e.target.value); 
                                                    this.setCitation(e.target.value); 
                                                    this.updateAbove(undefined, e.target.value, undefined)}}
                                value={this.state.stepName}>
                                    <option value=''>Select a step</option>
                                    {stepOptions}
                                </Form.Control>;

        // label for step description
        let stepDescription = <Form.Label>Description: {this.state.description}</Form.Label>;

        // label for step citation
        let stepCitation = <Form.Label>Citation: {this.state.citation}</Form.Label>;

        // button to remove
        let deleteButton = <Button variant='outline-secondary' onClick={this.props.onDelete}>Delete</Button>

        return (
            <div id='main'>
                <Form.Group>
                    <Card border='primary'>
                        <Card.Body>
                            <Card.Title>Step {this.state.stepNumber}</Card.Title>
                            <Form.Row>
                                <Col xs={7}>
                                    {selectStepName}
                                </Col>
                                <Col>
                                    {this.getInputField('inputField', 'Input')}
                                </Col>
                                <Col xs='auto' display='inline-block'>
                                    {deleteButton}
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                {stepDescription}
                            </Form.Row>
                            <Form.Row>
                                {stepCitation}
                            </Form.Row>
                        </Card.Body>
                    </Card>
                </Form.Group>
            </div>
        );
    }
}

export default PrepStepFormGroup;