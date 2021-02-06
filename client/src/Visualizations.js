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
        // line plots
        let origLinePlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/orig/lineplot'} alt={'Original ' + (i) + ' lineplot'} />);
        let prepLinePlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/prep/lineplot'} alt={'Preprocessed ' + (i) + ' lineplot'} />);
        // histograms
        let origHistograms = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/orig/histogram'} alt={'Original ' + (i) + ' histogram of first feature'} />);
        let prepHistograms = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/prep/histogram'} alt={'Preprocessed ' + (i) + ' histogram of first feature'} />);
        // density plots
        let origDensityPlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/orig/densityplot'} alt={'Original ' + (i) + ' density plot'} />);
        let prepDensityPlots = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/prep/densityplot'} alt={'Preprocessed ' + (i) + ' density plot'} />);
        // heatmaps
        let origHeatmaps = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/orig/heatmap'} alt={'Original ' + (i) + ' heatmap'} />);
        let prepHeatmaps = this.state.fileNames.map((i) => <img id='graph' src={'/graphs/' + this.state.socketID + '/' + (i) + '/prep/heatmap'} alt={'Preprocessed ' + (i) + ' heatmap'} />);

        this.origPlots = [...origLinePlots, ...origHistograms, ...origDensityPlots, ...origHeatmaps];
        this.prepPlots = [...prepLinePlots, ...prepHistograms, ...prepDensityPlots, ...prepHeatmaps];
        
        let structure = <Container fluid>
            {
                Util.range(0, (this.state.fileNames.length - 1) * 4, 1).map((i) => {
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