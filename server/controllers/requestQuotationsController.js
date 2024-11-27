const { ObjectId } = require('mongodb');
const Quotation = require('../models/Quotation');
const { getConnectedClient } = require("../database");

const getQuotation = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("quotations");
    return collection;
}


// create an instance of Request Quotation from the user
exports.createRequestQuotation = async (req, res) => {
  try {
    const collection = getQuotation();
    const { name, email, contact, description } = req.body;
    
    // const newQuotation = new Quotation(req.body);
    //await newRequestQuotation.save();

    const newQuotation = new Quotation({
        name,
        email,
        contact,
        description,
    });

    collection.insertOne(newQuotation);

    res.status(201).json({newQuotation});
  } catch (error) {
    res.status(500).json({ message: 'Error submitting request' });
  }
};

// get all of the Request Quotations from all the users
exports.getAllRequestQuotations = async (req, res) => {
  try {
    const collection = getQuotation();
    const requestQuotations = await collection.find({}).toArray();
    res.status(200).json(requestQuotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

exports.deleteRequestQuotation = async (req, res) => {
  try {
    const collection = getQuotation();
    if (!collection) {
      console.error('Collection not found');
      return res.status(500).json({ message: 'Collection not found' });
    }else{
      // console.log("retrieved successfully", collection);
    }

    const { id } = req.params;
    // console.log(`Received ID: ${id}`);
    const quotations = await collection.find({}).toArray();
    // console.log('All quotations:', quotations);

    if (!ObjectId.isValid(id)) {
      console.error('Invalid ID format');
      return res.status(400).json({ message: 'Invalid ID format' });
    } else {
      // console.log("ID is valid");
    }

    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId});
    // console.log(`Delete result: ${JSON.stringify(result)}`);
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Quotation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Quotation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quotation', error });
  }
};