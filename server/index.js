const express = require('express');
const path = require('path');

const app = express();

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '../index.html'));
});

const port = process.env.PORT || 4005;
//this will get the port variable from heroku, but if there isnt one assigned, it will use port 4005

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})