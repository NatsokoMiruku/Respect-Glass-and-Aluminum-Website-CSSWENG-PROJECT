//Creates an edit option under the properties of the object
import React, { useState } from 'react';
import "../css/ProfilePage.css"

export default function EditProfile({currUser}) {

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)

    }

    const submitEdit = async (email, fullname, street, city, province, zip, country, password, rPassword, currUser, picture) => {

        let CorrectPassword = true
        let PutObject = {shippingAddress: {
            street: currUser.shippingAddress.street,
            city: currUser.shippingAddress.city,
            province: currUser.shippingAddress.province,
            zip: currUser.shippingAddress.zip,
            country: currUser.shippingAddress.country
        }};

        if(email != null && email.trim() != ""){PutObject.email = email};
        if(fullname != null && fullname.trim() != ""){PutObject.fullname = fullname};
        if(password != null && password.trim() != "" ){PutObject.password = password};
        if(password != rPassword){CorrectPassword = false};
        if(street != null && street.trim() != ""){PutObject.shippingAddress.street = street};
        if(city != null && city.trim() != ""){PutObject.shippingAddress.city = city};
        if(zip != null && zip.trim() != ""){PutObject.shippingAddress.zip = zip};
        if(province != null && province.trim() != ""){PutObject.shippingAddress.province = province};
        if(country != null && country.trim() != ""){PutObject.shippingAddress.country = country};
        if (CorrectPassword = true){
            try{
                const res = await fetch("api/users/" + currUser._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(PutObject)
                });
                const data = await res.json();
                toggleModal();
                window.location.reload()
    
            } catch(err){
                console.error("Failed to edit user profile", err);
            }
        } else {
            alert("passwords do not match")
            window.location.reload()
        }
    }
    
    const [email, setEmail] = useState(currUser ? currUser.email : null);
    const [fullname, setfullname] = useState(currUser ? currUser.fullname : null);
    const [street, setStreet] = useState(currUser ? currUser.shippingAddress.street : null);
    const [city, setCity] = useState(currUser ? currUser.shippingAddress.city: null);
    const [province, setProvince] = useState(currUser ? currUser.shippingAddress.province : null);
    const [zip, setZip] = useState(currUser ? currUser.shippingAddress.zip : null);
    const [country, setCountry] = useState(currUser ? currUser.shippingAddress.country : null);
    const [picture, setPicture] = useState(currUser ? currUser.picture : null);
    const [password, SetPassword] = useState();
    const [rPassword, SetrPassword] = useState();

    
    
    //change
    return(
        <>
        <button onClick={toggleModal} className='ToggleEdit'>edit</button>
        
        {modal && (           
            <div id='modal'>
                <button id='close' onClick={toggleModal} className='ToggleEdit'>X</button>
                <form id='form'>
                    <div id='formDiv'>
                    Profile Image:
                    <br />
                    <input type="file" accept='image/jpeg, image/png, image/jpg' className='Input' placeholder="picture" id="picture" onChange={(e) => setPicture(e.target.value)}/>
                    Personal info:
                    <br />
                    <input type="text" className='Input' placeholder="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <br />
                    <input type="text" className='Input' placeholder="Full name" id="fullname" value={fullname} onChange={(e) => setfullname(e.target.value)}/>
                    <br />
                    Shipping Adress:
                    <br />
                    <input type="text" className='Input' placeholder="street" id="street" value={street} onChange={(e) => setStreet(e.target.value)}/>
                    <input type="text" className='Input' placeholder="city" id="city" value={city} onChange={(e) => setCity(e.target.value)}/>
                    <input type="text" className='Input' placeholder="province" id="province" value={province} onChange={(e) => setProvince(e.target.value)}/>
                    <input type="text" className='Input' placeholder="zip" id="zip" value={zip} onChange={(e) => setZip(e.target.value)}/>
                    <input type="text" className='Input' placeholder="country" id="country" value={country} onChange={(e) => setCountry(e.target.value)}/>
                    <br />
                    <br />
                    Change password:
                    <br />
                    <input type="password" className='Input' placeholder="password" id="password" value={password} onChange={(e) => SetPassword(e.target.value)}/>
                    <input type="password" className='Input' placeholder="Repeat password" id="rpassword" value={rPassword} onChange={(e) => SetrPassword(e.target.value)}/>
                    <br />
                    <button type='button' id="submitButton" onClick={() => submitEdit(email, fullname, street, city, province, zip, country, password, rPassword, currUser, picture)}>Submit</button>
                    </div>
                </form>
            </div>
        )}
        </>
    )
}
