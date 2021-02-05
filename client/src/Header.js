/**
 * Header.js
 * @author Vincent Li <vincentl@asu.edu>
 * Header of the App.
 */
import React from 'react';
import {Navbar} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Header.css';

class Header extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Navbar id='header' bg='primary' variant='dark'>
                    <Navbar.Brand>
                        <h2>SigNorm</h2>
                    </Navbar.Brand>
                </Navbar>                
            </React.Fragment>
        );
    }
}

export default Header;