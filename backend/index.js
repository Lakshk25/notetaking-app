const express = require('express');
const cors = require('cors')
require('./db');

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.get('/' , (req ,res) =>{
    res.send("hello world")
})

app.listen(port , () =>{
    console.log("iNotebook backend listening at http://localhost: " + port);
})