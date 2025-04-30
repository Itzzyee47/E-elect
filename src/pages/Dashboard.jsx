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
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [editType, setEditType] = useState('');    
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
      const button = document.querySelector('#CCbtn');
      button.textContent = 'Loading...';
      button.disabled = true;
      
      const { error, data } = await supabase.from('candidate').insert({
        name: newCandidateName,
        election_id: selectedElection,
        position_id: selectedPosition,
      });
      // console.log(data);
      button.textContent = 'Add Candidate';
      button.disabled = false;

      if (!error) {
        const { data, error } = await supabase
          .from('candidate')
          .select('*, positions(name)')
          .eq('election_id', selectedElection);
        if (!error) setCandidates(data);
        setNewCandidateName('');
        setSelectedPosition(null);
      }
      else{
        alert(error);
      }
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    let error;
    switch (type) {
      case 'election':
        ({ error } = await supabase.from('elections').delete().eq('id', id));
        if (!error) {
          setElections(elections.filter(election => election.id !== id));
        }
        break;
      
      case 'position':
        ({ error } = await supabase.from('positions').delete().eq('id', id));
        if (!error) {
          setPositions(positions.filter(position => position.id !== id));
        }
        break;
      
      case 'candidate':
        ({ error } = await supabase.from('candidate').delete().eq('id', id));
        if (!error) {
          setCandidates(candidates.filter(candidate => candidate.id !== id));
        }
        break;
    }

    if (error) {
      alert(`Error deleting ${type}: ${error.message}`);
    }
  };

  const handleEditClick = (item, type) => {
    setEditData(item);
    setEditType(type);
    setEditDialogVisible(true);
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleEditConfirm = async () => {
    const button = document.querySelector('#editBtn');
    button.textContent = 'loading...';
    button.disabled = true;
    let error;
    switch (editType) {
      case 'election':
        ({ error } = await supabase
          .from('elections')
          .update({ name: editData.name, NOP: editData.NOP })
          .eq('id', editData.id));
        if (!error) {
          setElections(
            elections.map((election) =>
              election.id === editData.id ? editData : election
            )
          );
        }
        break;

      case 'position':
        ({ error } = await supabase
          .from('positions')
          .update({ name: editData.name })
          .eq('id', editData.id));
        if (!error) {
          setPositions(
            positions.map((position) =>
              position.id === editData.id ? editData : position
            )
          );
        }
        break;

      case 'candidate':
        ({ error } = await supabase
          .from('candidate')
          .update({ name: editData.name })
          .eq('id', editData.id));
        if (!error) {
          setCandidates(
            candidates.map((candidate) =>
              candidate.id === editData.id ? editData : candidate
            )
          );
        }
        break;
    }
    button.textContent = 'Confirm';
    button.disabled = false;

    if (error) {
      alert(`Error updating ${editType}: ${error.message}`);
    } else {
      setEditDialogVisible(false);
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
        <table className="elections-table">
          <thead>
          <tr>
            <th>Election Name</th>
            <th>Number of Positions</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {elections.map((elec) => (
            <tr key={elec.id}>
            <td>{elec.name}</td>
            <td>{elec.NOP}</td>
            <td>
              <div className="actions_btn">
                <button className="icon-button" onClick={() => handleEditClick(elec, 'election')}>✏️</button>
                <button className="icon-button" onClick={() => handleDelete(elec.id, 'election')}>🗑️</button>
              </div>
            </td>
            </tr>
          ))}
          </tbody>
        </table>
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
        <table className="positions-table">
          <thead>
          <tr>
            <th>Position Name</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {positions.map((pos) => (
            <tr key={pos.id}>
            <td>{pos.name}</td>
            <td>
              <div className="actions_btn">
                <button className="icon-button" onClick={() => handleEditClick(pos, 'position')}>✏️</button>
                <button className="icon-button" onClick={() => handleDelete(pos.id, 'position')}>🗑️</button>
              </div>
            </td>
            </tr>
          ))}
          </tbody>
        </table>
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
          
          <button id='CCbtn' onClick={handleCreateCandidate}>Add Candidate</button>
        </div>
        <table className="candidates-table">
          <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {candidates.map((cand) => (
            <tr key={cand.id}>
            <td>{cand.name}</td>
            <td>{cand.positions?.name || 'No position'}</td>
            <td>
              <div className="actions_btn">
                <button className="icon-button" onClick={() => handleEditClick(cand, 'candidate')}>✏️</button>
                <button className="icon-button" onClick={() => handleDelete(cand.id, 'candidate')}>🗑️</button>
              </div>
            </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div>
        <h2>Vote Statistics</h2>
        <p>Statistics view will go here...</p>
        </div>
      )}

      </main>
      
      {editDialogVisible && (
          <div className="overlay">
            <div className="edit-dialog">
              <h3>Edit {editType}</h3>
              {editType === 'election' && (
                <>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                    />
                  </label>
                  <label>
                    Number of Positions:
                    <input
                      type="number"
                      value={editData.NOP}
                      onChange={(e) => handleEditChange('NOP', e.target.value)}
                    />
                  </label>
                </>
              )}
              {editType === 'position' && (
                <label>
                  Name:
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </label>
              )}
              {editType === 'candidate' && (
                <label>
                  Name:
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </label>
              )}
              <button id='editBtn' onClick={handleEditConfirm}>Confirm</button>
              <button onClick={() => setEditDialogVisible(false)}>Cancel</button>
            </div>
          </div>
        )}
    </div>
    );
};

export default Dashboard;
