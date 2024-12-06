import React from 'react';
import { Star } from 'lucide-react';

/**
 * ReviewCard Component
 * 
 * This component displays the review title, review text, rating (as stars), and the creation date of the review.
 *
 * @param {string} title - The title of the review.
 * @param {string} review - The content of the review.
 * @param {number} rating - The rating value, represented as a number from 1 to 5.
 * @param {string} createdAt - The date when the review was created, formatted as a string.
 * @returns {JSX.Element} The rendered review card component.
 */
const ReviewCard = ({ title, review, rating, createdAt }) => {
    return (
        <div className='review-card'>

            {/* Title of the Review */}
            <h5>{title}</h5>

            {/* Review Content */}
            <p>{review}</p>

            {/* Rating Display (Stars) */}
            <div className='rating'>
                {
                
                    // Algorithm: Render 5 stars based on the rating value
                    // For each index from 1 to 5, check if the current index is less than or equal to the rating
                    [...Array(5).map((_, index) => {
                    const ratingValue = index + 1;

                    return (
                        <Star
                            key={index}
                            size={18}
                            fill={ratingValue <= rating ? "gold" : "none"}
                            stroke={ratingValue <= rating ? "gold" : "currentColor"}
                            style={{ marginRight: '5px' }}
                        />
                    );
                })]}
            </div>

            {/* Display the creation date of the review */}
            <p><em>{new Date(createdAt).toLocaleDateString()}</em></p>
        </div>
    );
};

export default ReviewCard;