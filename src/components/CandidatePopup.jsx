import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import './CandidatePopup.css';

const CandidatePopup = ({ candidates, onSelect, onClose }) => {

    const [ candidatez,setCandidates ]= useState([]);

    useEffect(() => {
        fetchCandidate()
      }, []);
    
      const fetchCandidate = async () => {
        const { data, error }=await supabase.from("candidate").select().eq("position_id",candidates.id);
        if (!error) setCandidates(data);
        if (error){
          alert(` ere was an error connecting to database ${error}`);
        }
      };

    //console.log(candidates.id);

    return (
        <div className="candidate-popup">
            <div className="popup-content">
                <h2 className="h2" >Select a Candidate</h2>
                <ul className="candidate-list">
                    {candidatez.map((candidate) => (
                        <li 
                            key={candidate.id} 
                            className="candidate-item"
                            onClick={() => onSelect(candidate)}
                            tabIndex={0} // Allows keyboard navigation
                            role="button" // Improves accessibility
                            onKeyPress={(e) => e.key === 'Enter' && onSelect(candidate)} // Enter key selects candidate
                        >
                            {candidate.name}
                        </li>
                    ))}
                </ul>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CandidatePopup;
