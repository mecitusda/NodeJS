const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shop.kenka.mongodb.net/carApp?retryWrites=true&w=majority&appName=Shop`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = connectDB();