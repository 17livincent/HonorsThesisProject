/**
 * login.js
 * React file to handle login
 */

import React from 'react';
import {Form, Button, Navbar, Nav, Container} from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        alert("Poop");
    }

    render() {
        return (   
            <div className='LoginPage'>
                <Container>
                    <Navbar className='loginNav' sticky='top' bg='light' variant='light'>
                    <Navbar.Brand href=''>Home</Navbar.Brand>
                    <Nav className='ml-auto'>
                        <Button href='' disabled>Log In</Button>
                        <div class='dividerHorizontal' />
                        <Button href=''>Sign Up</Button>
                    </Nav>
                </Navbar>
                </Container>

                <div className='Login'>
                    <h1>Welcome Back</h1>

                    <GoogleLogin
                        buttonText="Log in with Google"
                    />
                    <h3>Log in with an email</h3>
                    <Form onSumbit={this.handleSubmit}>
                        <Form.Group controlId='getEmail'>
                            <Form.Control 
                                type='email' 
                                placeholder='Email address' 
                                required='required'
                                autoFocus
                                value={this.state.email}
                                onChange={(event) => this.setState({email: event.target.value})}/>
                        </Form.Group>
                        <Form.Group controlId='getPassword'>
                            <Form.Control 
                                type='password' 
                                placeholder='Password' 
                                required='required' 
                                value={this.state.password}
                                onChange={(event) => this.setState({password: event.target.value})}/>
                        </Form.Group>
                        <Button variant='primary' type='submit'>Log In</Button>
                    </Form>
                </div>
            </div>
            
        );
    }
}

export default Login;