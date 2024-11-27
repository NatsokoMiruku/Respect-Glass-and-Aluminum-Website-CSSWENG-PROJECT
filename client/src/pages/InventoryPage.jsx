import { useEffect, useState } from "react";
import InventoryItem from '../components/InventoryItem';
import ItemForm from '../components/ItemForm';
import Modal from '../components/Modal';
import Deleteitem from '../components/Deleteitem';
import Sidebar from '../components/Sidebar';
import '../css/InventoryPage.css';

export default function App() {
  const [originalInventory, setOriginalInventory] = useState([]); 
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteForm, setDeleteForm] = useState(false);

  const getInventory = async() => {
    try { 
      const res = await fetch("/api/inventory");
      const data = await res.json();

      if (Array.isArray(data)) {
        setOriginalInventory(data);
        setFilteredInventory(data); 
      } else {
        console.log("Fetched Inventory is not an array");
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    }
  }

  useEffect(() => {
    getInventory();
  }, []);

  const handleFilter = (type) => {
    const newFilter = type === 'A' ? originalInventory : originalInventory.filter(item => item.type === type);
    setFilteredInventory(newFilter);
  };

  const handleAddItem = (newItem) => {
    const updatedInventory = [...originalInventory, newItem];
    setOriginalInventory(updatedInventory);
    setFilteredInventory(updatedInventory);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const toggleDeleteVisibility = () => {
    setDeleteForm(!showDeleteForm);
  }

  return (
    <div className="container">
      <Sidebar />
      <h1 className="title">Inventory</h1>
      <div className="button-container">
        <button onClick={toggleFormVisibility}>
          {showForm ? 'Hide Form' : 'Create New Item'}
        </button>
        <button onClick={toggleDeleteVisibility}>
          {showDeleteForm ? 'Hide Form' : 'Delete Item'}
        </button>
        <label htmlFor="types">Filter:</label>
        <select id="types" onChange={(e) => handleFilter(e.target.value)}>
          <option value="A">All</option>
          <option value="Aluminum">Aluminum</option>
          <option value="Glass">Glass</option>
          <option value="Frame">Frame</option>
          <option value="Bolt">Bolt</option>
        </select>
      </div>
      <div className="inventory-wrapper">
        <div className="inventory-header">
          <div className="invName"><h4>Name</h4></div>
          <div className="invQty"><h4>#</h4></div>
          <div className="invUsed"><h4>Used</h4></div>
          <div className="invRming"><h4>Remaining</h4></div>
          <div className="invPPU"><h4>Price per Unit</h4></div>
          <div className="invTotal"><h4>Total</h4></div>
        </div>
        <div className="inventory-body">
          {filteredInventory.length > 0 && filteredInventory.map((item) => (
            <InventoryItem key={item._id} item={item} />
          ))}
        </div>
      </div>
      {showForm && (
        <Modal onClose={toggleFormVisibility}>
          <div className="modal-content">
            <ItemForm onAddItem={handleAddItem} />
          </div>
        </Modal>
      )}
      {showDeleteForm && (
        <Modal onClose={toggleDeleteVisibility}>
          <div className="modal-content">
            <Deleteitem item={filteredInventory} updateInventory={getInventory} />
          </div>
        </Modal>
      )}
    </div>
  );
}
