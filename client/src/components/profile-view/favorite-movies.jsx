import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Figure, Card } from 'react-bootstrap';

import './profile-view.scss';

const FavoriteMovies = ({favoriteMovies, delFavMovie}) => {
    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col xs={12}>
                        <h4>Favorite Movies</h4>
                    </Col>
                </Row>
                <Row>
                    {
                        favoriteMovies.length !== 0 ? 
                        favoriteMovies.map((movie) => (
                            <Col xs={12} md={6} lg={3} key={movie._id} className="fav-movie">   
                                <Figure>
                                    <Link to={`/movies/${movie._id}`}>
                                        <Figure.Image 
                                            src={movie.ImagePath}
                                            alt={movie.Title}
                                            crossOrigin="anonymous"
                                        />
                                        <Figure.Caption>
                                            {movie.Title}
                                        </Figure.Caption>
                                    </Link>
                                </Figure>
                                <Button variant="secondary" onClick={() => delFavMovie(movie._id)}>Remove From list</Button>
                            </Col>
                        )) 
                        : <Col xs={12}>
                            <p>No movies favorited yet</p>
                        </Col>
                    }
                </Row>
            </Card.Body>
        </Card>
    );
}
 
export default FavoriteMovies;