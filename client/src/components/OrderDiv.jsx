import { useState } from 'react';
import '../css/ProfilePage.css';

export default function OrderView({ order, userArray, itemArray, isAdmin }) {
    const [productID, setProductID] = useState(order.productID);
    const [totalPrice, setTotalPrice] = useState(order.totalPrice);
    const [date, setDate] = useState(order.date);
    const [recipient, setRecipient] = useState(order.recipient);
    const [status, setStatus] = useState(order.status);
    const [isEdit, setIsEdit] = useState(false);
    let tempIndex

    const toggleIsEdit = () => {
        setIsEdit(!isEdit);

    }

    const submitEdit = async () => {
        try {
            await fetch("api/orders/" + order._id, { // edit me later
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: order.items,
                    totalPrice: totalPrice,
                    date: date,
                    recipient: recipient,
                    status: status
                })
            });
            window.location.reload();
        } catch (err) {
            console.error("Failed to edit Order", err);
        }
    }
    
    const user = userArray.find((users) => {
        return users._id === order.recipient;
    });
    

    function findItem(productId){
        try{
            const object = itemArray.find((items) => {
                return items._id === productId;
            });
            return object;
        } catch (err) {
            console.error("Failed to find orders", err);
        }
    }

    function DeleteButton({  }) {
        if (isAdmin == true){
            return(
                <button className='edit-button' onClick={() => toggleIsEdit()}>⚙️</button>
            ) 
        }
    }

    function EditArray(){
        tempIndex = 0;
        function addItem(e){
            e.preventDefault();
            order.items.push({productId: "", quantity: 0})
            toggleIsEdit()
        }

        return(
            <div className='order-detail'>{order.items.map((item) => { 
                const itemIndex = tempIndex
                tempIndex++;
                
                function DeleteProduct(e){
                    e.preventDefault();
                    order.items.splice(itemIndex, 1)
                    toggleIsEdit()
                }

                return (
                    <div key={item._id}>
                        <input className="edit-input" type="text" placeholder={item.productId} onChange={(e) => item.productId = e.target.value} />
                        <input className="edit-input" min={0} type="number" placeholder={item.quantity} onChange={(e) => item.quantity = e.target.value} />
                        <button onClick={(e) => DeleteProduct(e)}>Delete</button>
                    </div>
                )
            })}
                <button onClick={(e) => addItem(e)}>Add Item +</button>
            </div>
        )
    }


    if (isEdit) {
        return (
            <div className='order-container'>
                <button className='edit-button' onClick={() => toggleIsEdit()}>❌</button>
                <div className='edit-order'>
                    <form className='edit-form'>
                        <EditArray/>
                        <input className="edit-input" type="number" min={0} placeholder={order.totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
                        <input className="edit-input" type="datetime-local" placeholder={order.date} onChange={(e) => setDate(e.target.value)} />
                        <input className="edit-input" type="text" placeholder={(user != undefined ? user.name : 'undefined/new item') + " (insert user ID)"} onChange={(e) => setRecipient(e.target.value)} />
                        <select className='edit-select' onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="In transit">In transit</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </form>
                    <p className='edit-note'>Leave empty if no changes</p>
                </div>
                <button type='button' className='submit-button' onClick={submitEdit}>Submit</button>
            </div>
        );
    } else {
        return (
            <div className='order-container'>
                <DeleteButton />
                <div className='order-details'>
                    <div className='order-header'>
                        <p className='detail-label'>items</p>
                        <p className='detail-label'>Total Price</p>
                        <p className='detail-label'>Date</p>
                        <p className='detail-label'>Recipient</p>
                        <p className='detail-label'>Status</p>
                    </div>
                    <div className='order-detail-row'>  
                        <div className='order-detail'>{order.items.map((item) => { 
                            return (
                                <p key={item._id}><a href={"products/" + item.productId}>{findItem(item.productId) ? findItem(item.productId).name : ""}</a> {": " + item.quantity + "pcs"}</p>
                            )
                        })}</div>
                        <p className='order-detail'>{order.totalPrice}</p>
                        <p className='order-detail'>{order.date}</p>
                        <p className='order-detail'>{user != undefined && user ? user.fullname : "undefined"}</p>
                        <p className='order-detail'>{order.status}</p>
                    </div>
                </div>
            </div>
        );
    }
}