/**
 * Visualisations.js
 * @author Vincent Li <vincentl@asu.edu>
 * A component that organizes and shows the graphs from the server.
 */

import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import Util from './util.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Visualisations.css';
//import './styles/outline.css';

class Visualizations extends React.Component {
    constructor(props) {
        super(props);

        this.origPlots = [];    // array of the img's of plots related to the original data
        this.prepPlots = [];    // array of the img's of plots related to the preprocessed data

        this.state = {
            // parameters for the img links to the server
            serverName: '',
            socketID: '',
            fileNames: []
        };
    }

    componentDidMount() {
        this.setState({serverName: this.props.serverName, socketID: this.props.socketID, fileNames: this.props.fileNames});
    }

    render() {
        let origLinePlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/orig/lineplot'} alt='original lineplot' />);
        let prepLinePlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/prep/lineplot'} alt='preprocessed lineplot' />);

        this.origPlots = this.origPlots.concat(origLinePlots);
        this.prepPlots = this.prepPlots.concat(prepLinePlots);

        let structure = <Container fluid>
            {
                Util.range(0, this.state.fileNames.length - 1, 1).map((i) => {
                    return <Row><Col>{this.origPlots[i]}</Col><Col>{this.prepPlots[i]}</Col></Row>
                })
            }
        </Container>;

        return (
            <React.Fragment>
                {structure}
            </React.Fragment>
        );
    }
}

export default Visualizations;