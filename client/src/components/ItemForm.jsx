import React, { useState } from 'react';

function ItemForm({ onAddItem }) {
  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    used: '',
    remaining: '',
    price: '',
    type: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: formData })
      });
      const newItem = await res.json();
      onAddItem(newItem);
      setFormData({
        name: '',
        qty: '',
        used: '',
        remaining: '',
        price: '',
        type: ''
      });
    } catch (err) {
      console.error("Failed to create new item", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <h1>Create Item:</h1>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="qty">Quantity:</label>
        <input
          type="number"
          id="qty"
          name="qty"
          value={formData.qty}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="used">Used:</label>
        <input
          type="number"
          id="used"
          name="used"
          value={formData.used}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="remaining">Remaining:</label>
        <input
          type="number"
          id="remaining"
          name="remaining"
          value={formData.remaining}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="type">Type:</label>
        <select id="type" name="type" value={formData.type}
          onChange={handleInputChange}
          required>
          <option value="">None</option>
          <option value="Aluminum">Aluminum</option>
          <option value="Glass">Glass</option>
          <option value="Frame">Frame</option>
          <option value="Bolt">Bolt</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ItemForm;
