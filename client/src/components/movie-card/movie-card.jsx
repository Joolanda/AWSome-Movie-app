import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Image, 
         Card } from 'react-bootstrap';
         
import './movie-card.scss';

class MovieCard extends React.Component{
    render(){
        const { movie } = this.props;
        
        return(
            <Card className="h-100 gap-1">
                <Card.Img 
                    variant="top" 
                    src={movie.ImagePath} 
                    crossOrigin="anonymous" 
                    className="movie-img" />
                <Card.Body>
                    <Card.Title as="h3">{movie.Title}</Card.Title>
                    <Card.Text>{movie.Description}</Card.Text>
                    <Link to={`/movies/${movie._id}`}>
                        <Button variant="outline-primary link">Open</Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string.isRequired,
        }),
        Director: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Bio: PropTypes.string.isRequired,
            Birth: PropTypes.string.isRequired,
            Death: PropTypes.string
        }),
        ImagePath: PropTypes.string.isRequired,
    }).isRequired,    
};

export default MovieCard;