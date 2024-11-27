const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { getConnectedClient } = require("../database");
const {ObjectId} = require("mongodb");
const User = require('../models/User.js');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');

const getUsers = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("users");
    return collection;
}

//temp
const getCurrUser = async (collection, id) => {
    const currUser = await collection.findOne({_id: id});
    return currUser;
}

//GET
router.get("/user", async (req,res) => {
    try{
        const collection = getUsers();
        const userId = req.query.userId;
        const user = await collection.findOne({_id: ObjectId.createFromHexString(userId)});

        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    } 
});

//GET
router.get("/users", async (req,res) => {
    const users = getUsers();
    const item = await users.find({}).toArray();
    // console.log(item);
    res.status(200).json(item);
});

router.get("/users/:email", async (req,res) => {
    const collection = getUsers();
    // console.log(req.params.email);
    const user = await collection.findOne({email: req.params.email});
    // console.log(user);
    if (user == null) {
        return res.status(404).json({message: "cannot find user"});
    }
    res.status(200).json(user);
});

//POST for sign up *old*
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
    let hashedPassword = await bcryptjs.hash(users.password, salt)
    users.password = hashedPassword

    // console.log(hashedPassword)
    
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
            let hashedPassword = await bcryptjs.hash(req.body.password, salt)
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

// POST
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        // console.log(email);
        // console.log(password);
        const collection = getUsers();
        const existingUser = await collection.findOne({email});
        // console.log("hi");
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = 10; 
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullname: fullname,
            shippingAddress: {
                street: '',
                city: '',
                province: '',
                zip: '',
                country: ''
            },
            shoppingCart: [],
            picture: '/images/default.jpg'
        });
        // await newUser.save();
        collection.insertOne(newUser);
        res.status(201).json({ newUser } );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST 
router.post('/login', async (req, res) => {
    const { email, password, isGoogle, decoded } = req.body;
    if(!isGoogle){
        try {
            const collection = getUsers();
            const user = await collection.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcryptjs.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    else{
        try {
            const collection = getUsers();
            const user = await collection.findOne({ email: decoded.email });
            if(!user){
                const newUser = new User({
                    email: decoded.email,
                    password: '',
                    fullname: decoded.name,
                    shippingAddress: {
                        street: '',
                        city: '',
                        province: '',
                        zip: '',
                        country: ''
                    },
                    shoppingCart: [],
                    picture: decoded.picture,
                    isAdmin: false
                });
                await collection.insertOne(newUser);
                return res.status(201).json({ newUser });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' })
        }
    }
});

//LOGIN
router.get("/login", async (req,res) => {
    let { login } = req.body;

    try {
        const user = await collection.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Optionally, remove the password from the user object before returning it
        delete user.password;

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

//ttt
/*
router.get("/user/:id", async (req, res) => {
    const id = new ObjectId(req.params.id);
    const collection = getUsers();
    const currUser = await collection.findOne({id});



    if(currUser){
        res.status(200).json(currUser);
    } else{
        res.status(404).send("User not found");
    }
});
*/

//do this
router.put("/user/:id", async (req, res) => {
    const collection = getUsers();
    const user = req.body;
    const currUser = await collection.findOne({_id: new ObjectId(req.params.id)});
    console.log(currUser);
    try {
        const {id} = req.params;
        if(user.changePass === true){
            const salt = 10;
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            const userUpdated = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: {
                _id: new ObjectId(req.params.id),
                email: user.email,
                password: hashedPassword,
                fullname: user.fullname,
                shippingAddress: user.shippingAddress,
                shoppingCart: user.shoppingCart,
                picture: '/images/default.jpg',
                isAdmin: user.isAdmin,
            }
            });
            console.log("user updated");
            if(!userUpdated){
                return res.status(404).json({message: "Error: User does not exist"});
            }
            const updatedUser = await collection.findOne({_id: new ObjectId(req.params.id)});
            res.status(200).json({updatedUser});
        } else {
            const userUpdated = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: {
                _id: new ObjectId(req.params.id),
                email: user.email,
                password: currUser.password,
                fullname: user.fullname,
                shippingAddress: user.shippingAddress,
                shoppingCart: user.shoppingCart,
                picture: 'default.jpg'
            }
                
            });
            console.log("user updated");
            if(!userUpdated){
                return res.status(404).json({message: "Error: User does not exist"});
            }
            const updatedUser = await collection.findOne({_id: new ObjectId(req.params.id)});
            res.status(200).json({updatedUser});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({message:err.message});
    }
});

router.get("/tempuser", async (req, res) => {
    const collection = getUsers();
    const tempUser = collection.findOne({_id: new ObjectId("668d682bc0e3e8ee42c3515f")});
    console.log(tempUser);
    res.status(200).json({tempUser});
});

module.exports = router;