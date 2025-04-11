const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (request, response)=>{
    response.send('<h1>hello</h1>')
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})