const express = require('express');
const app = express();

const path = require('path');


app.set("view engine","ejs");



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
  


app.use("/libs",(req,res,next) => {next();},express.static(path.join(__dirname,"node_modules")));
app.use("/static",(req,res,next) => {next();},express.static(path.join(__dirname,"public")));
const calculator = require('./routers/calculator');

app.get('/',calculator);

app.listen(200, () => {
  console.log('Server is running on port 200');
});