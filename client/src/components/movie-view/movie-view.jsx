import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button,
         Image } from 'react-bootstrap';

import './movie-view.scss';

class MovieView extends React.Component{
    render(){
        const { movie, onBackClick } = this.props;

        return(
            <div className="movie-view d-grid gap-2">
                <Image src={movie.ImagePath} alt="movie-poster" className="mx-auto" crossOrigin="anonymous" style={{ width: 660, height: 'auto' }}/>
                <div className="movie-title">
                    <span className="label">Title: </span>
                    <span className="value">{movie.Title}</span>
                </div>
                <div className="movie-director">
                    <span className="label">Director: </span>
                    <span className="value">{movie.Director.Name}</span>
                </div>
                <div className="movie-genre">
                    <span className="label">Genre: </span>
                    <span className="value">{movie.Genre.Name}</span>
                </div>
                <div className="movie-description">
                    <span className="label">Description: </span>
                    <span className="value">{movie.Description}</span>
                </div>
                <div className="movie-footer">
                    <Button variant="success link" onClick={() => onBackClick()}>Back</Button>                   
                    <Link to={`/directors/${movie.Director.Name}`}>
                        <Button variant="success link">Director</Button>
                    </Link>
                    <Link to={`/genres/${movie.Genre.Name}`}>
                        <Button variant="success link">Genre</Button>
                    </Link>
                </div>     
            </div>
        );
    }
}

MovieView.propTypes = {
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
    onBackClick: PropTypes.func.isRequired,
};

export default MovieView;