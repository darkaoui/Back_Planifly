import dotenv from 'dotenv'
import flights from './data/flight.js'
import Flight from './models/flightModel.js'
import User from './models/userModel.js'
import FlightPassenger from './models/flightPassengerModel.js'
import connectDB from './config/db.js'
import users from './data/user.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {
        await Flight.deleteMany()
        await User.deleteMany()

        //const createdFlights = await Flight.insertMany(flights)
        const createUsers = await User.insertMany(users)

        console.log('Data imported !')
        process.exit()
    } catch(error) {
        console.log(`Import error ${error}`)
        process.exit()
    }
}

const destroyData = async () => {
    try {
        await Flight.deleteMany()
        await User.deleteMany()
        await FlightPassenger.deleteMany()

        console.log('Data destroyed !')
        process.exit()
    } catch(error) {
        console.log(`Destroy error ${error}`)
        process.exit()
    }
}

destroyData()
//importData()