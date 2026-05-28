import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT 
const server = express()

server.get('/', (req,res)=>{
    res.send({
        success:true,
        message:'Routes are working fine'
    })
})

server.use(express.json())

server.use((req,res)=>{
    res.send({
        success:false,
        message:'Route does not exist'
    })
})

server.listen(PORT,()=>{
    console.log('Live at @'+PORT);
})