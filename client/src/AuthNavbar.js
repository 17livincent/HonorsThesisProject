/**
 * AuthNavbar.js
 * 
 * This renders a Navbar for the authentication pages.
 * Takes in a props.type equalling 'LOGIN' or 'SIGNUP'.
 */

import React from 'react';
import {Button, Navbar, Nav, Container} from 'react-bootstrap';

class AuthNavbar extends React.Component {

    render() {
        return (
            <div>
                <Container>
                    <Navbar className='loginNav' sticky='top' bg='light' variant='light'>
                        <Navbar.Brand href=''>Home</Navbar.Brand>
                        <Nav className='ml-auto'>
                            <Button href='' disabled={this.props.type === 'LOGIN'}>Log In</Button>
                            <div class='dividerHorizontal' />
                            <Button href='' disabled={this.props.type === 'SIGNUP'}>Sign Up</Button>
                        </Nav>
                    </Navbar>
                </Container>
            </div>
        );
    }
}

export default AuthNavbar;