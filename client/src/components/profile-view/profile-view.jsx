import React from 'react';
import axios from 'axios';
import FavoriteMovies from './favorite-movies';
import UpdateUser from './update-user';
import UserInfo from './user-info';
import { Row, 
         Col, 
         Container } from 'react-bootstrap';
import { API_URL } from '../../utils/constant';

const ProfileView = ({user, movies}) => {
    const favoriteMovies = user.FavoriteMovies.map( favMovie => (
        movies.find(movie => (movie._id === favMovie))
    ));
    
    const handleDelFavMovie = (movieId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        axios.delete(`${API_URL}/users/${user.Username}/movies/${movieId}`,{
            headers: { Authorization: `Bearer ${token}`}
        })
        .then((response) => {
            const updatedUser = response.data;
            console.log("Movie deleted from fav list");
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        })
        .catch((error) => {
            console.log('Fav movie deleting failed.', error);
        })
    }

    return (
        <Container>
            <Row>
                <Col xs={12} sm={4}>
                    <UserInfo name={user.Username} email={user.Email} />
                </Col>
                <Col xs={12} sm={8}>
                    <UpdateUser user={user} />
                </Col>
            </Row>
            <FavoriteMovies favoriteMovies={favoriteMovies} delFavMovie={id => handleDelFavMovie(id)} />
        </Container>
    );
}

export default ProfileView;