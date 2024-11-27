import React, { useState } from 'react';
import { GoogleLogin} from '@react-oauth/google';
import '../css/LoginPage.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const clientId = process.env.clientId;
    const navigate = useNavigate();

    const setUserWithExpiry = (paramuser, ttl) => {
        const now = new Date();
        // console.log(paramuser.id);
        localStorage.setItem('user', JSON.stringify({
            id: paramuser.id,
            email: paramuser.email,
            name: paramuser.name,
            picture: paramuser.picture,
            familyName: paramuser.family_name,
            givenName: paramuser.given_name,
            expiry: now.getTime() + ttl,
            isAdmin: paramuser.isAdmin,
        }));
    }

    const responseGoogle = (response) => {
        if (response) {
            console.log("Logged in successfully!")
            const decoded = jwtDecode(response?.credential);
            // console.log(decoded);
            // console.log(decoded.email);
            fetch(`/api/users/${decoded.email}`)
                .then(response => response.json())
                .then(data => {
                    const id = data._id;
                    decoded.id = id;
                    setUserWithExpiry(decoded, 60 * 60 * 1000);
                })
                .catch(error => {
                    console.error('Failed to fetch user ID', error);
                });
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    decoded,
                    isGoogle: true,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Failed to make the POST request', error);
                });
            navigate('/'); 
        } else {
            console.error('Failed to log in');
        }
    }
    
    const handleLogin = async (e) => {
        e.preventDefault(); 
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password , isGoogle : false}),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            // console.log(data);
            const newUser = {
                id: data._id,
                email: data.email,
                name: data.fullname,
                picture: data.picture,
                family_name: data.fullname,
                given_name: data.fullname,
                isAdmin: data.isAdmin,
            }
            setUserWithExpiry(newUser, 60 * 60 * 1000);
            navigate('/'); 
        } catch (error) {
            console.error('Failed to login:', error);

        }
    };

    const handleLoginFailure = (response) => {
        console.error('Failed to log in', response);
        setUser(null);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

return (
    <div className="login">
        <div className="loginhero">
            <div className='loginheroleft'>
                <h1>Hello, welcome!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input className="input" type="email" value={email} onChange={handleEmailChange} placeholder='Email Address' required />
                    </div>
                    <br />
                    <div className="input-field">
                        <input className="input" type="password" value={password} onChange={handlePasswordChange} placeholder='Password' required />
                    </div>
                    <br />
                    <button className="login-button" type="submit" onClick={handleLogin}>Login</button>
                    
                    <div className="google-login">
                    <GoogleLogin
                        clientId={clientId}
                        buttonText="Login with Google"
                        onSuccess={responseGoogle}
                        onFailure={handleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    </div>
                </form>   
                  
            </div>
            <div className='loginheroright'/>
        </div>
    </div>
);
}

export default LoginPage;