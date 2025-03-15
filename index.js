const express = require('express');
const app= express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routers = require('./routes/routes');
const port = 5000;


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
// app.use(cors({
//     origin:'*',
//     credentials:true,
//     methods:['GET','POST','PATCH'],
//     allowedHeaders:['Content-Type',"Authorization"]
// }));
async function connectdb() {
    try {
     const db =    await mongoose.connect("mongodb://localhost:27017/node-test")
        console.log(`connected to database ${db.connection.name}`);
        app.listen(port,()=>{
            console.log(`server is running on port ${port}`);
            
        })
        
    } catch (error) {
        console.log(`Error connecting to db ${error}`);
        
    }
    
}
connectdb();

app.use('/api',routers);

app.use((req,res)=>{
    res.status(404).send('404 not found');
})