import React from 'react';
import EditModal from './EditItem'; //edited inv name for the put UI

const InventoryItem = ({ item }) => {
  return (
    <>
      <div className="invName"> {item.name} <EditModal item= {item}> </EditModal> </div> 
      <div className="invQty">{item.qty}</div>
      <div className="invUsed">{item.used}</div>
      <div className="invRming">{item.remaining}</div>
      <div className="invPPU">{item.price}</div>
      <div className="invTotal">{item.price * item.qty}</div>
      
    </>
  );
};


export default InventoryItem;
