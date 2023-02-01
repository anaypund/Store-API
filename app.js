//5:00:00
require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB= require('./db/connect')
const productsRouter= require('./routes/products')
const Product= require('./models/product')
const jsonProduct= require('./products.json')

const notFoundMiddleware =require('./middleware/not-found') 
const errorMiddleware =require('./middleware/error-handler') 


//middleware
app.use(express.json())

//routes

app.get('/',(req,res)=>{
    res.send('<h1>Store api</h1><a href="/api/v1/products">Products routs</a>')
})

app.use('/api/v1/products', productsRouter)

// product routes
app.use(notFoundMiddleware)
app.use(errorMiddleware)


const port= process.env.PORT || 3000
const start=async () =>{
try {
    connectDB(process.env.MONGO_URI)
    console.log('Connected to database!')
    // Product.deleteMany()
    // Product.create(jsonProduct)
    app.listen(port, console.log(`Server listening on ${port}...`))
} catch (error) {
    console.log(error)
}}

start()
