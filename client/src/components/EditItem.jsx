//Creates an edit option under the properties of the object
import React, { useState } from 'react';
import "../css/EditItem.css"

export default function EditModal({item}) {

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)

    }

    //edits the object
    const  submitEdit = async (name, quantity, used, price, type, item) => {
        try {
                await fetch("api/inventory/" + item._id,{ //edit me later
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    name: name,
                    qty: quantity,
                    used: used,
                    remaining: quantity - used,
                    price: price,
                    type: type,
                })
                
            });
        } catch(err) {
            console.error("Failed to edit item", err);
        }
        window.location.reload()
        toggleModal()
    }

        const [name, setName] = useState(item.name)
        const [qty, setQty] = useState(item.qty)
        const [used, setUsed] = useState(item.used)
        const [price, setPrice] = useState(item.price)
        const [type, setType] = useState(item.type)
        

        return(
            <>
            <button onClick={toggleModal} className='ToggleEdit'>{modal ? 'close' : 'edit'}</button>
           
           {modal && (           
                <div className='modal'>
                    <form>
                        Name:
                        <input className="editInput" type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                        Quantity:
                        <input className="editInput" type="number" name="quantity" id="qty" value={qty} onChange={(e) => setQty(e.target.value)} min={0}/>
                        Used:
                        <input className="editInput" type="number" name="used" id="used" value={used} onChange={(e) => setUsed(e.target.value)} max={qty} min={0}/>
                        Price:
                        <input className="editInput" type="number" name="price" id="price" value={price} onChange={(e) => setPrice(e.target.value)}/>
                        Type: 
                        <input className="editInput" type="text" name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}/>
                        <button type='button' onClick={() => submitEdit(name, qty, used, price, type, item)} id="submitButton">Submit</button>
                    </form>
                </div>
            )}
            </>
        )
}
