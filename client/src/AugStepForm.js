/**
 * AugStepForm.js
 * A Form which serves as an input of a preprocessing/augmentation step form
 */

import React from 'react';
import {Form, Card, Col, Row, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
//import './outline.css';

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
        this.setDisabledValues = this.setDisabledValues.bind(this);

    }

    setRemoveStep() {
        this.setState({removeStep: true});
        alert('Step deleted');  // for testing
    }

    setDisabledValues() {
        if(this.state.stepCategory === 'NOTSELECTED') {
            this.setState({stepName: 'NOTSELECTED'});
            this.setState({input: ''});

        }
        if(this.state.stepName === 'NOTSELECTED') {
            this.setState({input: ''});
        }
    }

    render() {
        return (
            <div className='StepForm'>
                <Form.Group>
                    <Card.Header as='h5'>
                        <Form.Label>Step {this.state.stepNumber}</Form.Label>
                    </Card.Header>
                    <Card.Body>
                        <Form.Row>
                            <Col xs={4}>
                                <Form.Control id='selectStepCategory'
                                    as='select'
                                    required='required'
                                    onChange={(e) => {this.setState({stepCategory: e.target.value})}}
                                    value={this.state.stepCategory || 'NOTSELECTED'}>
                                    <option value='NOTSELECTED'>Select a category</option>
                                    <option value='extra'>Extra</option>
                            
                                </Form.Control>
                            </Col>
                            <Col xs={4}>
                                <Form.Control id='selectStepName'
                                    as='select'
                                    required='required'
                                    //disabled={this.state.stepCategory === 'NOTSELECTED'}
                                    onChange={(e) => {this.setState({stepName: e.target.value})}}
                                    value={this.state.stepName || 'NOTSELECTED'}>
                                    <option value='NOTSELECTED'>Select a step</option>
                                    <option value='extra'>Extra</option>
                            
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Control id='input'
                                    type='text'
                                    placeholder='Input'
                                    //disabled={this.state.stepCategory === 'NOTSELECTED' | this.state.stepName === 'NOTSELECTED'}
                                    >

                                </Form.Control>
                            </Col>
                            <Col xs='auto'>
                                <Button variant='outline-secondary' onClick={this.setRemoveStep}>
                                    Delete
                                </Button>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Description: {this.state.stepCategory}</Form.Label>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Citation: {this.state.stepName}</Form.Label>
                        </Form.Row>
                    </Card.Body>

                </Form.Group>
                
            </div>
        );
    }
}

export default AugStepForm;