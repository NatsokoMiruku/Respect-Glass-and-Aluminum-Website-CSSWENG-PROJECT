const express = require('express');
const router = express.Router();
const { getConnectedClient } = require("../database");
const {ObjectId} = require("mongodb");

const getCart = () => { // Ron edit this function
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("item");
    return collection;
}

router.get("/shoppingCart", (req, res) => {
    try{

    } catch (err){
        res.status(500).json({msg: "Internal Server Error"});
    }
});

