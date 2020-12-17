/**
 * Footer.js
 * 
 * This renders a Navbar as a footer.
 */

import React from 'react';
import {Navbar} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

class Footer extends React.Component {

    render() {
        return (
            <div>
                <Navbar id='footer' sticky='bottom' bg='dark' variant='dark'>
                    <Navbar.Text>
                        Developed by Vincent Li<br />
                        Contact: <a href='mailto:vincentl@asu.edu'>vincentl@asu.edu</a>
                    </Navbar.Text>
                </Navbar>
            </div>
        );
    }
}

export default Footer;