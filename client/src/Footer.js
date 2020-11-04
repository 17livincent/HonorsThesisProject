/**
 * Footer.js
 * 
 * This renders a Navbar as a footer.
 */

import React from 'react';
import {Navbar} from 'react-bootstrap';

class Footer extends React.Component {

    render() {
        return (
            <div>
                <Navbar className='FooterNav' sticky='bottom' bg='light' variant='light'>
                    <Navbar.Text>
                        Developed by Vincent Li<br />
                        Contact: vincentl@asu.edu
                    </Navbar.Text>
                </Navbar>
            </div>
        );
    }
}

export default Footer;