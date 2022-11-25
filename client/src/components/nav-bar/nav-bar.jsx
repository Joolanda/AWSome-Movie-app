import React from 'react';
import { Container,
         Navbar,
         Nav } from 'react-bootstrap';

import './nav-bar.scss';

const MyNavbar = ({user}) => {
    const onLoggedOut = () =>{
        localStorage.clear();
        window.open("/","_self");
    }
    
    return ( 
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar w-12 pb-2">
            <Container>
                <Navbar.Brand href="/" className="me-auto">Movies</Navbar.Brand>
                <Nav>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href={`/profile`}>Profile</Nav.Link>
                <Nav.Link onClick={() => onLoggedOut()}>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
 
export default MyNavbar;