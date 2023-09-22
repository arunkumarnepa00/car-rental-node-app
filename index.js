require('dotenv').config();
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const morgan = require('morgan');
const cors=require('cors');

app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());

//database connection
// mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log("connected to database"))
.catch(err=>console.log(err));

//test home route
app.get('/',(req,res)=>{
    console.log("hi");
    res.send("Welcome to Car rental backend app");
});

//routes
const authRoutes=require('./routes/auth');
app.use('/api/v1',authRoutes);
const userRoutes=require('./routes/user');
app.use('/api/v1',userRoutes);
const adminRoutes=require('./routes/admin')
app.use('/api/v1',adminRoutes);
const productRoutes=require('./routes/product');
app.use('/api/v1',productRoutes);

app.listen(process.env.PORT,()=>{
    console.log("car-rental backend app started at port 7701")
});