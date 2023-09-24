import dotenv from 'dotenv'
import express from 'express'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import flightRoutes from './routes/flightRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import signRoutes from './routes/signRoutes.js'
import cors from 'cors'

dotenv.config()
connectDB()
const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}))

app.get('/', (req,res)=>{
    res.send('API is running')
})

app.use('/api/flights', flightRoutes)
app.use('/api/users', userRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/sign', signRoutes)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`server run on http://localhost:${PORT}`))