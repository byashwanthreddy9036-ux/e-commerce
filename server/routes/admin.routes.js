import express from 'express'

const adminRoutes = express.Router()

adminRoutes.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'Admin routes are working just fine'
    })
})

adminRoutes.use((req, res) => {
    res.send({
        success: false,
        message: 'Admin route not found'
    })
})

export default adminRoutes