import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('elections');
  const [positions, setPositions] = useState([]);
  const [post, setPost] = useState([]);
  const [elections, setElections] = useState([]);
  const [nop, setNOP] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);    
  const [newName, setNewName] = useState('');
  const [newElectionName, setNewElectionName] = useState('');
  const [newCandidateName, setNewCandidateName] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      const { data, error } = await supabase.from('elections').select('*');
      if (!error) setElections(data);
    };
    fetchElections();
    fetchPositions();
  }, [selectedElection]);

  const fetchPositions = async () => {
    if (selectedElection) {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('election_id', selectedElection);
      if (!error) setPositions(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedElection) return;
      if (activeTab === 'positions') {
        const { data, error } = await supabase
          .from('positions')
          .select('*')
          .eq('election_id', selectedElection);
        if (!error) setPositions(data);
      } else if (activeTab === 'candidates') {
        const { data, error } = await supabase
          .from('candidate')
          .select('*, positions(name)')
          .eq('election_id', selectedElection);
        if (!error) setCandidates(data);
        if (error) console.error(error);
        //console.log(selectedElection, data);
      }
    };
    fetchData();
  }, [activeTab, selectedElection]);

  const handleCreatePosition = async () => {
    if (!selectedElection) {
      alert('Please select an election first.');
      return;
    }
    const { error } = await supabase.from('positions').insert({ name: newName, election_id: selectedElection });
    if (!error) {
      setPositions([...positions, { name: newName, election_id: selectedElection }]);
      setNewName('');
    }
  };

  const handleCreateElection = async () => {
    setNOP(nop);
    const { error } = await supabase.from('elections').insert({ name: newElectionName, NOP: nop });
    if (!error) {
      setElections([...elections, { name: newElectionName }]);
      setNewElectionName('');
      setNOP('');
    }else{
      console.log(error);
    }
  };

  const handleCreateCandidate = async () => {
    if (!selectedElection) {
      alert('Please select an election first.');
      return;
    }
    if (selectedElection && selectedPosition) {
      const { error } = await supabase.from('candidates').insert({
        name: newCandidateName,
        election_id: selectedElection,
        position_id: selectedPosition,
      });
      if (!error) {
        setCandidates([...candidates, {
          name: newCandidateName,
          election_id: selectedElection,
          position_id: selectedPosition,
        }]);
        setNewCandidateName('');
        setSelectedPosition(null);
      }
    }
  };

  return(
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebarD">
        <h2>Dashboard</h2>
        <ul>
          <li onClick={() => setActiveTab('elections')}>Manage Elections</li>
          <li onClick={() => setActiveTab('positions')}>Manage Positions</li>
          <li onClick={() => setActiveTab('candidates')}>Manage Candidates</li>
          <li onClick={() => setActiveTab('statistics')}>Vote Statistics</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">
        {activeTab !== 'elections' && (
          <div className="selectElection">
            <label htmlFor="election-select">Select Election:</label>
            <select
              id="election-select"
              value={selectedElection || ''}
              onChange={(e) => setSelectedElection(e.target.value)}
            >
              <option value="" disabled>Select an election</option>
              {elections.map((election) => (
                <option key={election.id} value={election.id}>{election.name}</option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'elections' && (
          <div>
            <h2>Manage Elections</h2>
            <div className="create">
              <input className='input2'
                type="text"
                placeholder="Election Name"
                value={newElectionName}
                onChange={(e) => setNewElectionName(e.target.value)}
              />
              <input className='input2'
                type="number" 
                placeholder="Number of positions"
                value={nop}
                onChange={(e) => setNOP(e.target.value)}
              />
              <button onClick={handleCreateElection}>Add Election</button>
            </div>
            <ul>
              {elections.map((elec) => (
                <li key={elec.id}>{elec.name}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'positions' && selectedElection && (
          <div>
            <h2>Manage Positions</h2>
           <div className="create">
              <input className='input2'
                type="text"
                placeholder="Position Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleCreatePosition}>Add Position</button>
           </div>
            <ul>
              {positions.map((pos) => (
                <li key={pos.id}>{pos.name}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'candidates' && selectedElection && (
          <div>
            <h2>Manage Candidates</h2>
            <div className="create">
                <input className='input2'
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                />
                <select className="selectPos input2" onChange={(e) => setSelectedPosition(e.target.value)} value={selectedPosition || ''}>
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
                
                <button onClick={handleCreateCandidate}>Add Candidate</button>
            </div>
            <ul>
              {candidates.map((cand) => (
                <li key={cand.id}> {cand.name} - {cand.positions.name} </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div>
            <h2>Vote Statistics</h2>
            <p>Statistics view will go here...</p>
          </div>
        )}
       
      </main>
    </div>
  );
};

export default Dashboard;
