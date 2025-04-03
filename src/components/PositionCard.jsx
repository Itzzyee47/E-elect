import React from 'react';
import './PositionCard.css';

const PositionCard = ({ position, selectedCandidate, onClick }) => {
    return (
        <div className="position-card" onClick={() => onClick(position.id)}>
            <h3>{position.name}</h3>
            {selectedCandidate && (
                <p className="selected-candidate">Selected: {selectedCandidate}</p>
            )}
        </div>
    );
};

export default PositionCard;