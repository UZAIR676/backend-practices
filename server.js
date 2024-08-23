const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./db/db.js');
const dotenv = require('dotenv');
//routes

const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoute.js')
connectDB();
const app = express();
dotenv.config()

//middlewares

PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use("/api/v1",userRoutes);
app.listen(PORT,()=>{
    console.log(`listening on${process.env.DEV_MODE} port   http://localhost:${PORT}`.bgCyan.white);
})