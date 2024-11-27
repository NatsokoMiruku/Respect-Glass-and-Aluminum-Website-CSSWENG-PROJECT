import { useEffect, useState } from 'react';
import OrderView from '../components/OrderDiv'; //edited inv name for the put UI
import Sidebar from '../components/Sidebar';
import '../css/OrderPage.css';


function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [arrange, setArrange] = useState(false);
    const [filter, setFilter] = useState("A");
    const [sort, setSorted] = useState("date");
    const [userArray, setUserArray] = useState([]);
    const [itemArray, setItemArray] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"))

    const toggleSort = () => {
      filteredOrders.reverse();
      setArrange(!arrange);
    }

    const getUsers = async() => {
      try{ 
        const res = await fetch("/api/users");
        const data = await res.json();
  
          if (Array.isArray(data)){ //remove if does not work
              setUserArray(data);
          } else {
            console.log("Fetched Inventory is not an array");
          }
        } catch (err){
          console.error("Failed to fetch inventory", err);
        }
  }

  useEffect(() => {
      getUsers();
  }, []);

  const getItems = async() => {
    try{ 
      const res = await fetch("/api/inventory");
      const data = await res.json();

        if (Array.isArray(data)){ //remove if does not work
            setItemArray(data);
        } else {
          console.log("Fetched Inventory is not an array");
        }
    } catch (err){
      console.error("Failed to fetch inventory", err);
    }
  }

  useEffect(() => {
      getItems();
  }, []);
  

  const getorders = async() => {
      try{ 
        const res = await fetch("/api/orders");
        const data = await res.json();
  
          if (Array.isArray(data)){ //remove if does not work
              setOrders(data);
              setFilteredOrders(data); 
          } else {
            console.log("Fetched Inventory is not an array");
          }
        } catch (err){
          console.error("Failed to fetch inventory", err);
        }
    }

  useEffect(() => {
  getorders();
  }, []);

  const handleFilter = (type, type2) => {//assumes all product names are capitalized
    let sorted
    let filtered = type === 'A' ? orders : orders.filter(item => item.status === type);

    setFilter(type)
    setSorted(type2)

    sorted = filtered.sort(function(a,b) {
      if(a[type2] < b[type2]) return -1
      else return 1
    })

    setFilteredOrders(sorted);
  };

  
  const currUser = userArray.find((users) => {
    return users._id === user.id;
  });
  
  let isAdmin
  if (currUser == undefined){
    isAdmin = false
  } else {
    isAdmin = currUser.isAdmin
  }

  function DeleteButton({ order }) {
    if (isAdmin == true){
      return(
        <button className='delete-button' onClick={() => DeleteItem(order._id)}>
                          Delete Item
        </button>
      )
    }
  }

    //delete items
    const DeleteItem = async(id) => {
      try{ 
        await fetch("/api/orders/" + id, {method: "DELETE"});
        window.location.reload();
        } catch (err){
          console.error("Failed to delete object", err);
        }
    }
    //edit and display items
    

    return (
      <div className='orders-page'>
      <Sidebar />
      
      <div className='controls'>
          <button className='toggle-sort' onClick={toggleSort}>
              {arrange ? 'Descending' : 'Ascending'}
          </button>
          <label htmlFor="sort-by" className='label'>Sort by:</label>
          <select name="sort by status" id="sort-by" className='sort-select' onChange={(e) => handleFilter(filter, e.target.value)}>
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="totalPrice">Total Price</option>
              <option value="qty">Quantity</option>
              <option value="recipient">Recipient</option>
          </select>
          <label htmlFor="filter-by" className='label'>Filter by status:</label>
          <select name="filter by status" id="filter-by" className='filter-select' onChange={(e) => handleFilter(e.target.value, sort)}>
              <option value="A">All</option>
              <option value="Pending">Pending</option>
              <option value="In transit">In transit</option>
              <option value="Delivered">Delivered</option>
          </select>
      </div>
      <div className='orders-list'>
          {filteredOrders.map((order) => { 
              return (
                  <div key={order._id} className='order-item'> 
                      <DeleteButton order={order}/>
                      <OrderView order={order} userArray={userArray} itemArray={itemArray} isAdmin={isAdmin}/>
                  </div>
              )
          })}
      </div>
  </div>
    )
}
//edit emoji lets u change everything (enum status will be popup) PATCH
//close emoji deletes it DELETE
//Add buttons for changing filters and editing
//Change the object being mapped to either hold filtered or orders
//Changed filtered to either hold one of the filter parameters

export default OrdersPage;