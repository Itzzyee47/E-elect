import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidatePopup from '../components/CandidatePopup';
import { supabase } from '../config/supabase';
import '../styles/VotingPage.css';

const VotingPage = () => {
    const [positions, setPositions] = useState([]);
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [selectedCandidates, setSelectedCandidates] = useState({});
    const [activePosition, setActivePosition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchElections = async (value) => {
            const { data, error } = await supabase.from('elections').select('*')
                .eq('name', value);
                if (!error) {
                    console.log(value, data);
                    setElections(data);
                    //console.log(data[0]['id']);
                    //setSelectedElection(data[0]['id']);
                }else if(error){
                    setMessage(error);
                }
            };
            
    const fetchPositions = async (elections) => {
        const { data, error }= await supabase.from('positions')
        .select('*')
        .eq('election_id', elections[0]['id']);
        if (!error){
            setPositions(data);
            //setElections([]);
            //alert(` There was an error connecting to database ${error}`);
        }else if(data == []){
            setMessage('There was an error', error);
            console.log(data);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidates((prev) => ({
            ...prev,
            [activePosition.id]: [candidate.id, candidate.name],
        }));
        setActivePosition(null); // Close popup
    };

    const handleClosePopup = () => setActivePosition(null);

    const handleSubmitEname = async () => {
        /* if (selectedElection) {
            const { data, error } = await supabase
              .from('positions')
              .select('*')
              .eq('election_id', selectedElection);
            if (!error) setPositions(data);
          } */
        try {
            console.log('Getting election!!');
            fetchElections(selectedElection);
            //console.log(elections);
            
            console.log('Getting positions!!');
            fetchPositions(elections);
            //console.log(positions);
        } catch (error) {
            setMessage(error);
        }
        
    }

    const handleSubmit = async () => {
        // Ensure all positions have a selected candidate
        const unselectedPositions = positions.filter(
            (position) => !selectedCandidates[position.id]
        );

        if (unselectedPositions.length > 0) {
            setMessage('Please select a candidate for all positions.');
            return;
        }
        console.log(selectedCandidates)
        // Prepare data for submission
        const voteData = Object.entries(selectedCandidates).map(([positionId, candidateId]) => ({
            position_id: positionId,
            candidate_id: candidateId[0],
        }));
        console.log(voteData)
        try {
            setLoading(true);
            setMessage('');

            // Insert data into Supabase
            const { data, error } = await supabase.from('votes').insert(voteData);

            if (error) throw error;

            setMessage('Votes submitted successfully!');
            setSelectedCandidates({}); // Clear selected candidates
        } catch (error) {
            setMessage('Error submitting votes. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <> 
        <Header/>
        <div className="voting-page">
            <h1>Vote for Your Leaders</h1>

            <div className="selectElection">
                <label htmlFor="election-select">Enter the name of the Election:</label>
                <input
                id="election-select"
                value={selectedElection || ''}
                onChange={(e) => setSelectedElection(e.target.value)}
                />
                <button onClick={() => handleSubmitEname()}> Search</button>
               
            </div>

            <ul>
                {positions.map((position) => (
                    <li key={position.id} className="post_card">
                        <div>
                            <strong>{position.name}</strong>
                            {selectedCandidates[position.id] && <p>Selected: {selectedCandidates[position.id][1]}</p>}
                        </div>
                        <button onClick={() => setActivePosition(position)}>Select Candidate</button>
                    </li>
                ))}
            </ul>
            {activePosition && (
                <CandidatePopup
                    candidates={activePosition}
                    onSelect={handleSelectCandidate}
                    onClose={handleClosePopup}
                />
            )}
            <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Votes'}
            </button>
            {message && <div className='message' Name="message">{message}</div>}
        </div>
        <Footer/>
        </>
    );
};

export default VotingPage;
