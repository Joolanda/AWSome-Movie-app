import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import { validate } from '../../utils/validate';
import { Card, 
         Form, 
         Button } from 'react-bootstrap';

import './registration-view.scss';


const RegisterationView = () => {
    const [userData, setUserData] = React.useState({
        username : '',
        password: '',
        email: '',
        dob: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = e => {
        const {name, value} = e.target;
        let error = validate(name, value);
        setErrors((prevErr) =>{
            return {
                ...prevErr,
                ...error
            }
        });

        setUserData((prevState) =>({
            ...prevState,
            [name] : value
        }));
    }

    const handleSubmit = e => {
        e.preventDefault();
        console.log(userData, new Date(userData.dob));
        const { username, password, email, dob } = userData; 

        axios.post(`${API_URL}/users`,{
            Username: username,
            Password: password,
            Email: email,
            Birthday: new Date(dob)
        })
        .then(response =>{
            const data = response.data;
            setMessage("User registration was successful");
            setUserData({
                username : '',
                password: '',
                email: '',
                dob: ''
            });
            data && window.open('/', '_self');
            // hosting client on heroku together with api: data && window.open('/client', '_self');
         })
         .catch(error =>{
            setMessage("User registration failed. Please try later");
            /*window.open('/', '_self');*/
            console.log(`Registration failed!!! ${error}`);
         });
    }

    return (
        <Card className="reg-container">
            <Card.Body>
                <Card.Title as="h2" className="text-center">Registration Page</Card.Title>
                {message && (
                        <div className="form-group">
                            <div className="alert alert-danger my-1 py-2" role="alert">
                                {message}
                            </div>
                        </div>
                )}
                <Form>
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Username: </Form.Label>
                        <Form.Control 
                            type="text" 
                            name="username" 
                            value={userData.username || ''}
                            onChange={handleChange}
                            placeholder="Enter username here"
                            isInvalid={!!errors.username}
                            required />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>                           
                    <Form.Group controlId="password" className="mb-3"> 
                        <Form.Label>Password: </Form.Label> 
                        <Form.Control 
                            type="password" 
                            name="password" 
                            value={userData.password || ''}
                            onChange={handleChange}
                            placeholder="Enter password here"
                            isInvalid={!!errors.password}
                            required />                       
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="email" className="mb-3"> 
                        <Form.Label>Email: </Form.Label> 
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={userData.email || ''}
                            onChange={handleChange}
                            placeholder="Enter email here"
                            isInvalid={!!errors.email}
                            required />                       
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="dob" className="mb-3"> 
                        <Form.Label>Date of Birth: </Form.Label> 
                        <Form.Control 
                            type="date"
                            name="dob" 
                            onChange={handleChange}
                            placeholder="Enter date of birth here"/>
                    </Form.Group>
                    <Button 
                        type="submit"
                        className="login-btn"
                        disabled={!userData.email && !userData.password}
                        onClick={handleSubmit}>
                            Register
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default RegisterationView;