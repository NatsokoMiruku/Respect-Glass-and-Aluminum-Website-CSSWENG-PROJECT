const express = require('express');
const router = express.Router();
const {ObjectId} = require("mongodb");
const { getConnectedClient } = require("../database");
const OrderSchema = require('../models/Order');

const getOrders = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("orders");
    return collection;
}

//GET
router.get("/orders", async (req,res) => {
    try{
        const item = await getOrders().find({}).toArray();
        res.status(200).json(item);
    } catch(err) {
        res.status(500).json({message: err.message})
    }
    
});

//GET
router.get("/clientOrders", async (req,res) => {
    try {
        const recipient = req.query.userId;
        const query = recipient ? { recipient: ObjectId.createFromHexString(recipient) } : {};
        const items = await getOrders().find(query).toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//gets 1
router.get("/orders/:id", async (req,res) => {
    try{
        const order = await getOrders().findOne({_id: new ObjectId(req.params)});
        if (order == null) {
            return res.status(404).json({ message:"cannot find Order"})
        }
        res.status(200).json(order);
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//POST
router.post("/orders", async (req, res) => {
    const collection = getOrders();

    let order = req.body;
    if (!order) {
        return res.status(400).json({ msg: "order not found" });
    }

    const newOrder = new OrderSchema({
        items: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        })),
        totalPrice: order.totalPrice,
        qty: order.qty,
        date: order.date,
        recipient: order.recipient,
        shippingAddress: order.shippingAddress,
        status: order.status
    });
    try {
        const result = await collection.insertOne(newOrder);
        res.status(201).json(result);
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



module.exports = router;