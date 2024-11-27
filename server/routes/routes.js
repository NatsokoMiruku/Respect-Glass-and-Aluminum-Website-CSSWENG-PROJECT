const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();
const { getConnectedClient } = require("../database");
const {ObjectId} = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("item");
    return collection;
}

const getOrders = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("orders");
    return collection;
}
const getUsersCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("users");
    return collection;
}

// GET
router.get("/inventory", async (req,res) => {
    const collection = getCollection();
    const item = await collection.find({}).toArray();

    res.status(200).json(item);
});

// GET
router.get("/inventory/:id", async (req,res) => {
    const id = req.params.id;
    const collection = getCollection();
    const product = await collection.findOne({ _id: new ObjectId(id)});
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// POST
router.post("/inventory", async (req, res) => {
    const collection = getCollection();
    let { item } = req.body;

    if (!item) {
        return res.status(400).json({ msg: "item not found" });
    }
    item = (typeof item === "string") ? JSON.parse(item) : item;

    try {
        const result = await collection.insertOne(item);
        res.status(201).json(item);
    } catch (err) {
        console.error("Failed to insert item", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// DELETE /inventory/:id
router.delete("/inventory/:id", async (req,res) => {
    const collection = getCollection();
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({msg: "Invalid ID format"});
    }

    const _id = new ObjectId(req.params.id);

    try{
        const deletedItem = await collection.deleteOne({_id});

        if (deletedItem.deletedCount === 0){
            return res.status(404).json({msg: "Item not found"});
        }
        res.status(200).json({msg: "Item deleted successfully"});
    }
    catch(err){
        console.error("Failed to delete item", err);
        res.status(500).json({msg: "Internal Server Error"});
    }
});
// PUT /inventory/:id (update)
router.put("/inventory/:id", async (req,res) => {
    const collection = getCollection();
    try{
        const {id} = req.params
        
        const updatedItem = await collection.updateOne({_id: new ObjectId(req.params.id)},{$set: req.body});
        if (!updatedItem){
            return res.status(404).json({message: 'cannot find item with ID ${id}'})
        }
        res.status(200).json(updatedItem)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});


//Orders

//GET
router.get("/orders", async (req,res) => {
    const orders = getOrders();
    const item = await orders.find({}).toArray();

    res.status(200).json(item);
});


//POST
router.post("/orders", async (req, res) => {
    const collection = getOrders();
    let { order } = req.body;
    if (!order) {
        return res.status(400).json({ msg: "order not found" });
    }

    if (!order.date) {
        order.date = new Date()
    }
    
    order = (typeof order === "string") ? JSON.parse(order) : order;
    try {
        const result = await collection.insertOne(order);
        res.status(201).json(order);
    } catch (err) {
        console.error("Failed to add order", err);
    }
});

//DELETE
router.delete("/orders/:id", async (req,res) => {
    const collection = getOrders();
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({msg: "Invalid ID format"});
    }

    const _id = new ObjectId(req.params.id);

    try{
        const deletedOrder = await collection.deleteOne({_id});

        if (deletedOrder.deletedCount === 0){
            return res.status(404).json({msg: "Order not found"});
        }
        res.status(200).json({msg: "Order deleted successfully"});
    }
    catch(err){
        console.error("Failed to delete Order", err);
        res.status(500).json({msg: "Internal Server Error"});
    }
});

//PUT
router.put("/orders/:id", async (req,res) => {
    const collection = getOrders();
    try{

        const updatedOrder = await collection.updateOne({_id: new ObjectId(req.params.id)},{$set: req.body});
        if (!updatedOrder){
            return res.status(404).json({message: 'cannot find order with ID ${id}'})
        }
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});


//Users

//GET
router.get("/users", async (req,res) => {
    const users = getUsers();
    const item = await users.find({}).toArray();

    res.status(200).json(item);
});

//LOGIN (need req body with just email and password)
router.get("/login", async (req,res) => {
    const users = getUsers();
    let { login } = req.body;

    if (!login.email) {
        return res.status(400).json({ msg: "no name found" });
    }
    const user = await users.findOne({email: login.email});
    
    if (!login.password) {
        return res.status(400).json({ msg: "no password found" });
    }
    
    let bool = await bcrypt.compare(login.password, user.password)
    res.status(200).json({"Login": bool});
});

//POST for sign up
router.post("/users", async (req, res) => {
    const collection = getUsers();
    let { users } = req.body;
    if (!users) {
        return res.status(400).json({ msg: "users not found" });
    }

    if (!users.email) {
        return res.status(400).json({ msg: "no email found" });
    }

    const finder = await collection.findOne({email: users.email});//checks if same email exists
    if(finder != null){
        return res.status(400).json({ msg: "email already exists" });
    }

    if (!users.password) {
        return res.status(400).json({ msg: "no password found" });
    }
    //password hashing
    let salt = 10
    let hashedPassword = await bcrypt.hash(users.password, salt)
    users.password = hashedPassword

    console.log(hashedPassword)
    
    users = (typeof users === "string") ? JSON.parse(users) : users;
    try {
        const result = await collection.insertOne(users);
        res.status(201).json(users);
    } catch (err) {
        console.error("Failed to create a users", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

//DELETE
router.delete("/users/:id", async (req,res) => {
    const collection = getUsers();
    if(!ObjectId.isValid(req.params.id)){
        return res.status(400).json({msg: "Invalid ID format"});
    }

    const _id = new ObjectId(req.params.id);

    try{
        const deletedusers = await collection.deleteOne({_id});

        if (deletedusers.deletedCount === 0){
            return res.status(404).json({msg: "User not found"});
        }
        res.status(200).json({msg: "User deleted successfully"});
    }
    catch(err){
        console.error("Failed to delete user", err);
        res.status(500).json({msg: "Internal Server Error"});
    }
});

//PUT
router.put("/users/:id", async (req,res) => {
    const collection = getUsers();
    try{
        if (req.body.password != null){
            let salt = 10
            let hashedPassword = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashedPassword
        }
        const updatedUser = await collection.updateOne({_id: new ObjectId(req.params.id)},{$set: req.body});
        if (!updatedUser){
            return res.status(404).json({message: 'cannot find user with ID ${id}'})
        }
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const collection = getUsersCollection();
    try {
        const user = await collection.findOne({ email });
        if (user) {
            console.log("User logged in");
            return res.status(200).json(user);
        }

        res.status(404).json({text: "User not found"});
    } catch (err) {
        console.error("Failed to create user", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.get("/shoppingCart", (req, res) => {
    try{

    } catch (err){
        res.status(500).json({msg: "Internal Server Error"});
    }
});




module.exports = router;
