/**
 * Footer.js
 * @author Vincent Li <vincentl@asu.edu>
 * This renders a Navbar as a footer.
 */

import React from 'react';
import {Navbar, Col, Row} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Footer.css';

class Footer extends React.Component {

    getYear() {
        let today = new Date();
        return today.getUTCFullYear();
    }

    render() {
        return (
            <React.Fragment>
                <Navbar id='footer' sticky='bottom' bg='dark' variant='dark'>
                    <Row id='row'>
                        <Col id='left' xs={3}>
                            <Navbar.Text id='text'>
                                Developed by Vincent Li {this.getYear()}<br />
                                Contact: <a href='mailto:vincentl@asu.edu'>vincentl@asu.edu</a>
                            </Navbar.Text>
                        </Col>
                        <Col id='right'>
                            <Navbar.Text id='text'>
                                This web application is an honors thesis project for Barrett, the Honors College at Arizona State University.<br />
                                This project is sponsored by the Arizona State University, School of Arts, Media, and Engineering.
                            </Navbar.Text>
                        </Col>
                    </Row>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default Footer;