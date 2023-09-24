import mongoose from 'mongoose'

const piloteSchema = mongoose.Schema({
    idFlight: {type: String, require: true},
    idPassenger: {type: String, require: true},
    seatQuantity: {type: Number, require: true},
    disableSeatQuantity: {type: Number, require: true}
})

const Pilote = mongoose.model('Pilote', piloteSchema)
export default Pilote