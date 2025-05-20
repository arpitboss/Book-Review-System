const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

// Importing the database connection function
const connectDB = require('./config/db');
connectDB();

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});