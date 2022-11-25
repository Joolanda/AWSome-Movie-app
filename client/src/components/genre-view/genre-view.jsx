import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GenreView = ({genre}) => {
    console.log(genre);
    return ( 
        <div className="genre-view d-grid gap-2">
            <div className="genre-name">
                    <span className="label">Name: </span>
                    <span className="value">{genre.Name}</span>
            </div>
            <div className="genre-desc">
                    <span className="label">Description: </span>
                    <span className="value">{genre.Description}</span>
            </div>
            <Link to='/'>
                <Button variant="link">Back to Movie List</Button>
            </Link>
        </div>
    );
}
 
export default GenreView;