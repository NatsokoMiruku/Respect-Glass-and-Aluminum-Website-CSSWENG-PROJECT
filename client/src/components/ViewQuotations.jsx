import { useState } from 'react';


export default function ViewQuotations({ quotation , id}) {
    const [name, setName] = useState(quotation.name);
    const [email, setEmail] = useState(quotation.email);
    const [contact, setContact] = useState(quotation.contact);
    const [description, setDescription] = useState(quotation.description);
    const [date, setDate] = useState(quotation.date);

    return (
        <div className='quotation-container'>
            <div className='quotation-details'>
                    <div className = 'quotation-info'>
                        <span className='detail-label' >Name: </span> <span className='quotation-detail' id='name-detail'>{name}</span><br />
                        <span className='detail-label' >Email: </span> <span className='quotation-detail' id='email-detail'>{email}</span><br />
                        <span className='detail-label' >Contact: </span> <span className='quotation-detail' id='contact-detail'>{contact}</span>
                    </div>
                    <span className='quotation-description'>
                        <span className='detail-label' >Date: </span> <span className='quotation-detail' id='date-detail'>{date}</span>
                        <div className='detail-label'>Description </div>
                        <span id='quotation-desc'>{description}</span>
                    </span>
            </div>
        </div>
    );
}
