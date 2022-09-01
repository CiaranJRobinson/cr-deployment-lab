const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '124d276cb4fd4b78b026d975f719b729',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.use(express.static(path.join(__dirname, '../public')));


const port = process.env.PORT || 4005;
//this will get the port variable from heroku, but if there isnt one assigned, it will use port 4005

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})

const plants = ['Monstera', 'Snake Plant', 'Golden Fern']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    rollbar.log("Accessed HTML successfully");
})

app.get('/api/plants', (req, res) => {
    rollbar.info("Someone got plants info")
    res.status(200).send(plants)
})

app.post('/api/plants', (req, res) => {
   let {name} = req.body

   const index = plants.findIndex(plant => {
       return plant === name
   })

   try {
       if (index === -1 && name !== '') {
           plants.push(name)
           rollbar.log("Plant added successfully", {author: "Ciaran", type: "manual entry"});
           res.status(200).send(plants)
       } else if (name === ''){
            rollbar.error("No plant provided");
           res.status(400).send('You must enter a plantname.')
       } else {
            rollbar.error("Plant already exists");
           res.status(400).send('That plant already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/plants/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    plants.splice(targetIndex, 1)
    rollbar.info("Plant was deleted");
    res.status(200).send(plants)
})

