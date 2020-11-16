/**
 * AugStepForm.js
 * A Form which serves as an input of a preprocessing/augmentation step form
 */

import React from 'react';
import {Form, Card, Col, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './outline.css';

class AugStepForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stepNumber: this.props.stepNumber || 0,  // step number
            stepCategory: '',    // step category
            stepName: '',    // step name
            input: '',
            description: '',    // step description, if applicable
            citation: '',   // step citation, if applicable
            removeStep: false,   // determines whether or not this object should be deleted

            numOfCategories: this.props.numOfCategories || 0,   // number of options in the category dropdown
            categoriesArray: this.props.categoriesArray || Array(this.props.numOfCategories).fill(null), // array of category options
            numOfSteps: this.props.numOfSteps || 0, // number of options in the steps dropdown, based on category option
            stepsArray: this.props.stepsArray || Array(this.props.numOfSteps).fill(null)  // array of step options
        };

        this.setRemoveStep = this.setRemoveStep.bind(this);
        this.clearSelects = this.clearSelects.bind(this);
        this.populateOptions = this.populateOptions.bind(this);
    }

    setRemoveStep() {
        this.setState({removeStep: true});
        alert('Step deleted');  // for testing
    }

    clearSelects() {
        if(this.state.stepCategory === '') {
            document.getElementById('selectStepName').value = '';
            document.getElementById('inputField').value = '';
        }
        if(this.state.stepName === '') {
            document.getElementById('inputField').value = '';
        }
    }

    // returns a returnable form of select options from the array
    populateOptions(array) {
        let options = '';
        for(let i in array) {
            options += `<option value='${array[i]}'>${array[i]}</option>`;
        }
        return options;
    }

    render() {

        // select input for step category
        let selectStepCategory = <Form.Control id='selectStepCategory'
                                    as='select' 
                                    required='required' 
                                    onChange={(e) => {this.setState({stepCategory: e.target.value}); this.clearSelects()}} 
                                    value={this.state.stepCategory}> 
                                        <option value=''>Select a category</option>
                                        {this.populateOptions(this.state.categoriesArray)}
                                    </Form.Control>;

        // select input for specific step
        let selectStepName = <Form.Control id='selectStepName'
                                as='select'
                                required='required'
                                onChange={(e) => {this.setState({stepName: e.target.value}); this.clearSelects()}}
                                value={this.state.stepName}>
                                    <option value=''>Select a step</option>

                                </Form.Control>;

        // small input field
        let inputField = <Form.Control id='inputField'
                            type='text' 
                            placeholder='Input'>

                            </Form.Control>

        // label for step description
        let stepDescription = <Form.Label>Description: {this.state.stepCategory}</Form.Label>;

        // label for step citation
        let stepCitation = <Form.Label>Citation: {this.state.stepName}</Form.Label>;

        // button to remove
        let deleteButton = <Button variant='outline-secondary' onClick={this.setRemoveStep}>
                                Delete
                            </Button>

        return (
            <div>
                <Form.Group>
                    <Card.Header as='h5'>
                        <Form.Label>Step {this.state.stepNumber}</Form.Label>
                    </Card.Header>
                    <Card.Body>
                        <Form.Row>
                            <Col xs={4}>
                                {selectStepCategory}
                            </Col>
                            <Col xs={4}>
                                {selectStepName}
                            </Col>
                            <Col>
                                {inputField}
                            </Col>
                            <Col xs='auto'>
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
                    {this.populateOptions(this.state.categoriesArray)}
                </Form.Group>
                
            </div>
        );
    }
}

export default AugStepForm;