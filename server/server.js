require("dotenv").config()
const { connectToMongoDB } = require("./database");
const helmet = require("helmet");
const express = require("express");
const cors = require('cors');
const path = require('path');


const app = express();

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com", "https://accounts.google.com/gsi/client"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://*.paypal.com"],
        imgSrc: ["'self'", "data:", "https://*.paypal.com", "https://*.paypalobjects.com"],
        connectSrc: ["'self'", "https://*.paypal.com"],
        fontSrc: ["'self'", "https://*.paypalobjects.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        frameSrc: ["'self'", "https://maps.google.com"],
        imgSrc: ["'self'", "data:", "https://*.paypal.com", "https://*.paypalobjects.com", "https://lh3.googleusercontent.com"],
    }
}));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const userRoutes = require('./routes/userRoutes');
const quotationRoutes = require('./routes/requestQuotationsRoutes');
const payPalRoutes = require('./routes/paypalRoutes');

app.use('/api', inventoryRoutes);
app.use('/api', ordersRoutes);
app.use('/api', userRoutes);
app.use('/api', quotationRoutes);
app.use('/api', payPalRoutes);


app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  
const port = process.env.PORT || 5000;
async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server is Listening in port ${port}`);
    });
}

startServer();