import mongoose from 'mongoose'

const flightSchema = mongoose.Schema({
    idFlight: {type: String, require: true},
    plane: {type: String, require: true},
    pilote: {type: String, require: true},
    aerodrome: {type: String, require: true},
    seats: {type: Number, require: true},
    seatsAvailable: {type: Number, require: true},
    date: {type: String, require: true},
    duration: {type: String, require: true},
    price: {type: Number, require: true},
    disableSeats: {type: Number, require: true}
})

const Flight = mongoose.model('Flight', flightSchema)
export default Flight