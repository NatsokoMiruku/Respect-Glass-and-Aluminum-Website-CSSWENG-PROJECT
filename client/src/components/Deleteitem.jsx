import React, { useState, useEffect } from 'react';

const DeleteForm = ({updateInventory}) => {
    const [items, setItems] = useState([]);

    const updateItems = async () => {
        try {
            const res = await fetch('/api/inventory');
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Fail to get items', err);
        }
    };

    useEffect(() => {
        updateItems();
    }, []);

    const handleDeleteItem = async (event) => {
        event.preventDefault();
        const selectItemId = event.target.deleteSelectedItem.value;
        try {
            const res = await fetch(`/api/inventory/${selectItemId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                console.log('Item deleted successfully');
                updateItems();
                updateInventory();
            } else {
                const errorData = await res.json();
                console.error('Failed to delete item', errorData);
            }
        } catch (err) {
            console.error('Error', err);
        }
    };

    return (
        <>
            <h1>Delete an item?</h1>
            <form onSubmit={handleDeleteItem}>
                <select name="deleteSelectedItem" id="deleteSelectedItem">
                    {items.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">Delete Item</button>
            </form>
        </>
    );
};

export default DeleteForm;