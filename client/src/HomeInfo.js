import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/HomeInfo.css';

class HomeInfo extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div id='info'>
                    <p>
                        Welcome!  This site allows you to easily preprocess data with a code-free interface.  
                        Simply select CSV files, choose the preprocessing steps from the dropdowns, and download the transformed dataset.
                    </p>
                </div>
            </React.Fragment>
            
        );
    }
}

export default HomeInfo;