import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/SignUpPage.css';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setName] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
        // Here you would typically send the form data to your server
        if(fullname == undefined || fullname.trim() == "" || password == undefined || password.trim() == "" || email == undefined || email.trim() == ""){
            alert("incomplete fields")
        } else {
            try{
                let statusR = await fetch("/api/signup", {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        fullname: fullname,
                        password: password
                    })
                })
                let status = await statusR.json()

                if (status.message != null){
                    alert(status.message)
                } else {
                    const now = new Date();
                    localStorage.setItem('user', JSON.stringify({
                        id: status.newUser.id,
                        email: status.newUser.email,
                        name: status.newUser.fullname,
                        picture: status.newUser.picture,
                        familyName: status.newUser.fullname,
                        givenName: status.newUser.fullname,
                        expiry: now.getTime() + 60 * 60 * 1000,
                        isAdmin: status.newUser.isAdmin,
                    }));
                    window.location.replace("/");
                }
    
            } catch(err) {
                alert("Failed to create user");
            }
        }
        
    }

     
    return (
        <div className="signup">
            <div className="Header1">
            <h1>Respect Glass & Aluminum</h1>
             <h4>Witness creation itself. </h4>
             </div>
            <div className="signuphero">
                <div className="signupherocontent">
                    <div className="registerheader">
                    <h2>Registration Form</h2>
                    </div>

                    <form >
                        <div className="input-field">
                        <input type="text" value={fullname} onChange={handleNameChange} placeholder='Enter your Full Name' required />
                        </div>
                        <br />
                        <div className="input-field">
                        <input type="email" value={email} onChange={handleEmailChange} placeholder='Enter your Email Address' required />
                        </div>
                        <br />
                        <div className="input-field">
                        <input type="password" value={password} onChange={handlePasswordChange} placeholder='Password' required />
                        </div>
                    </form>
                    <button className= "signupbtn" onClick={handleSubmit} >Signup</button>
                        <p>Already have an account? Login here!</p>

                    </div>
                </div>
            </div>
            
    );
}

export default SignUpPage;