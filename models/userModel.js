import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    idCard: {type: String, require: false},
    pilotLicense: {type: String, require: false}
})

const User = mongoose.model('User', userSchema)
export default User