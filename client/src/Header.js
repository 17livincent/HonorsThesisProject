import React from 'react';
import {Navbar} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Header.css';

class Header extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Navbar id='header' bg='dark' variant='dark'>
                    <Navbar.Brand>
                        <h2>AppName</h2>
                    </Navbar.Brand>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default Header;