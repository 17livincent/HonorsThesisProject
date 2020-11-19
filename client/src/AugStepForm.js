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

            categories: this.props.categories || [], // array of category options
            steps: this.props.steps || []  // array of step options
        };

        this.setRemoveStep = this.setRemoveStep.bind(this);
        this.clearSelects = this.clearSelects.bind(this);
    }

    componentDidMount() {
        this.setState({
            // get list of categories
            categories: [
                {name: 'CategoryName', val: 'OptionValue'},
                {name: 'Category1', val: 'cat1'},
                {name: 'Category2', val: 'cat2'},
                {name: 'Category3', val: 'cat3'}
            ],
            // get list of steps
            steps: [
                {name: 'StepName', val: 'OptionValue'},
                {name: 'Step1', val: 'step1'},
                {name: 'Step2', val: 'step2'},
                {name: 'Step3', val: 'step3'}
            ]
        });
    }

    // sets the state value to show that the delete button was pressed
    setRemoveStep() {
        this.setState({removeStep: true});
        alert('Step deleted');  // for testing
    }

    // NOT WORKING
    clearSelects() {
        //if(this.state.stepCategory === '') {
        //    document.getElementById('selectStepName').value = '';
        //    document.getElementById('inputField').value = '';
        //}
        if(this.state.stepName === '') {
            document.getElementById('inputField').value = '';
        }
    }

    getInputField(id, placeholder) {
        return (
            <Col>
                <Form.Control id={id}
                    type='text' 
                    placeholder={placeholder}
                    disabled={this.state.stepName === ''}>

                </Form.Control>
            </Col>
        );
    }

    render() {
        // get list of category options
        let categoryOptions = this.state.categories.length > 0 && this.state.categories.map((item, i) => {
            return (
                <option value={item.val}>{item.name}</option>
            )
        }, this);

        // get list of step options
        let stepOptions = this.state.steps.length > 0 && this.state.steps.map((item, i) => {
            return (
                <option value={item.val}>{item.name}</option>
            )
        })

        // select input for step category
        let selectStepCategory = <Form.Control id='selectStepCategory'
                                    as='select' 
                                    required='required' 
                                    onChange={(e) => {this.setState({stepCategory: e.target.value}); this.clearSelects()}} 
                                    value={this.state.stepCategory}> 
                                        <option value=''>SELECT A CATEGORY</option>
                                        {categoryOptions}
                                    </Form.Control>;

        // select input for specific step
        let selectStepName = <Form.Control id='selectStepName'
                                as='select'
                                required='required'
                                onChange={(e) => {this.setState({stepName: e.target.value}); this.clearSelects()}}
                                value={this.state.stepName}>
                                    <option value=''>SELECT A STEP</option>
                                    {stepOptions}
                                </Form.Control>;

        // label for step description
        let stepDescription = <Form.Label>Description: {this.state.description}</Form.Label>;

        // label for step citation
        let stepCitation = <Form.Label>Citation: {this.state.citation}</Form.Label>;

        // button to remove
        let deleteButton = <Button variant='outline-secondary' onClick={this.setRemoveStep}>Delete</Button>

        return (
            <div>
                <Form.Group>
                    <Card.Header as='h5'>
                        <Form.Label>Step {this.state.stepNumber}</Form.Label>
                    </Card.Header>
                    <Card.Body>
                        <Form.Row>
                            <Col xs={7}>
                                {selectStepName}
                            </Col>
                            <Col>
                                {this.getInputField('inputField', 'Input')}
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