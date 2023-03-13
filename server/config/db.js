const mongoose = require('mongoose');
// remove some unwanted warning
mongoose.set('strictQuery',false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected : ${conn.connection.host} `);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;