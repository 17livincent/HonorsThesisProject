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
            stepNumber: 0,  // step number
            stepCategory: '',    // step category
            stepName: '',    // step name
            input: '',
            description: '',    // step description, if applicable
            citation: '',   // step citation, if applicable
            removeStep: false   // determines whether or not this object should be deleted
        };

        this.setRemoveStep = this.setRemoveStep.bind(this);

    }

    setRemoveStep() {
        this.setState({removeStep: true});
        alert('Step deleted');  // for testing
    }

    render() {

        // select input for step category
        let selectStepCategory = <Form.Control 
                                    as='select' 
                                    required='required' 
                                    onChange={(e) => {this.setState({stepCategory: e.target.value});}} 
                                    value={this.state.stepCategory}> 
                                        <option value=''>Select a category</option>
                                        <option value='Extra'>Extra</option>

                                    </Form.Control>;

        // select input for specific step
        let selectStepName = <Form.Control
                                as='select'
                                required='required'
                                onChange={(e) => {this.setState({stepName: e.target.value});}}
                                value={this.state.stepName}>
                                    <option value=''>Select a step</option>
                                    <option value='Extra'>Extra</option>
                                    
                                </Form.Control>;

        // small input field
        let inputField = <Form.Control 
                            type='text' 
                            placeholder='Input'
                            disabled={this.state.stepCategory === '' | this.state.stepName === ''}>

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

                </Form.Group>
                
            </div>
        );
    }
}

export default AugStepForm;