/**
 * HomeInfo.js
 * @author Vincent Li <vincentl@asu.edu>
 * Text on the main page.
 */
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/HomeInfo.css';

class HomeInfo extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div id='info'>
                    <h1>Welcome!</h1>
                    <p>
                        This site allows you to easily preprocess numerical, time-series data with a code-free interface.  
                        Simply select CSV files, choose the transformations from the dropdowns in the order you want them to be performed, and download the transformed dataset.
                    </p>
                </div>
            </React.Fragment>
            
        );
    }
}

export default HomeInfo;