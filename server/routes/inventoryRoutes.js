const express = require('express');
const router = express.Router();
const { getConnectedClient } = require("../database");
const {ObjectId} = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("item");
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


module.exports = router;