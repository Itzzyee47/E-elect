import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import '../styles/LoginPage.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCpassword] = useState('');

  const validatePassword = () => {
    if (password === Cpassword){
        return true;
    }else{
        return false;
    }
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('Logged in successfully!');
  };

  return (
    <div className='form'>
      
     <form action="">
     <h1>SignUp</h1>
      <label for="email">Email</label>
        <input
          type="email"
          placeholder="Enter your email" name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

      <label for="password">Password</label>
        <input
          type="password"
          placeholder="Enter your password" name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

       <label for="Cpassword">Confirm Password</label>
            <input
            type="password"
            placeholder="Re-enter your password" name='password'
            value={password}
            onChange={(e) => setCpassword(e.target.value)}
            />
        <label >Sign up as:</label>
        <div className="select_role">
          <div className="option">
          <input type="radio" name="role" id="op1" value="Admin" /> <label className='opLabel' htmlFor="op1">Admin</label>
          </div>
          <div className="option">
          <input type="radio" name="role" id="op2" value="Voter" /> <label className='opLabel' htmlFor="op2">Voter</label>
          </div>
        </div>
            <br />
        <button className='form_btn' onClick={handleLogin}>SignUp</button>
     </form>
     <div>
      Alredy have an account <Link to="/login">Login</Link>
     </div>
    </div>
  );
};

export default SignUp;
