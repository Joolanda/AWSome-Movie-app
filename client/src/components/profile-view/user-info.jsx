import React from 'react';
import { Card } from 'react-bootstrap';

const UserInfo = ({ name, email }) => {
    return ( 
        <Card>
            <Card.Body>
                <h4>User Info</h4>
                <p>Name: {name}</p>
                <p>e-mail: {email}</p>
            </Card.Body>           
        </Card>
    );
}
 
export default UserInfo;