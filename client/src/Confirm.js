/**
 * Confirm.js
 * 
 * Displays the selected files, selected steps, and accepts confirmation.
 */

import React from 'react';
import {Alert, Button} from 'react-bootstrap';

import Transformations from './transformations.js';
import Util from './util.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Confirm.css';

class Confirm extends React.Component {

    /**
     * Returns a component with the names of the files chosen
     */
    displayFiles() {
        return (
            this.props.files.length > 0 && this.props.files.map((file) => 
                <React.Fragment>
                    {file.replace('C:\\fakepath\\', '')}<br />
                </React.Fragment>
            )   // remove the fakepath if its there
        );
    }

    /**
     * Returns a component with the sequences of chosen steps and their inputs
     */
    displaySteps() {
        let trans = new Transformations();
        let transformations = trans.getTransformations();
        let steps = this.props.steps;
        let counter = 0;
        return steps.map((i) => {
            counter++;
            // find the index of this step
            let index = trans.getStepIndex(i.step);
            // get the step name
            let stepName = transformations[index].name;
            // get the input names and inputs
            let inputInfo;
            if(transformations[index].numOfInputs !== 0) {
                let inputNames = transformations[index].inputNames.slice();
                let inputs = i.inputs.slice();
                inputInfo = Util.range(0, transformations[index].numOfInputs - 1, 1).map((j) => (<React.Fragment>{inputNames[j]}={inputs[j]}&ensp;</React.Fragment>));
            }
            return (
                <React.Fragment>
                    {counter}: <b>{stepName}</b>&emsp;{inputInfo}<br />
                </React.Fragment>
            );
        });
    }

    render() {
        let inputDataSummary = <Alert variant='success'><h4>Files chosen:</h4>{this.displayFiles()}</Alert>;
        let stepsSummary = <Alert variant='success'><h4>Steps chosen:</h4>{this.displaySteps()}</Alert>;

        return (
            <React.Fragment>
                {inputDataSummary}
                {stepsSummary}
                <Button id='confirmButton' variant='primary' size='lg'>Confirm</Button>
            </React.Fragment>
        );
    }

}

export default Confirm;