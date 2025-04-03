import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('Logged in successfully!');
  };

  return (
    <div className='form'>
      
     <form action="">
     <h1>Login</h1>
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
        <div className="forget">
          Forgot password
        </div>
        <br />
        <button className='form_btn' onClick={handleLogin}>Login</button>
     </form>
     <div>
      No account <Link to="/signup">SignUp</Link>
     </div>
    </div>
  );
};

export default LoginPage;
