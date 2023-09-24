import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import FlightPassenger from '../models/flightPassengerModel.js'
import Flight from '../models/flightModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import private_key from '../auth/private_key.js'
import mailer from "nodemailer"

const getUsers = asyncHandler(async (req,res)=>{
    const users = await User.find({})
    res.json(users)
})

const getUserById = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id)
    if (user) {
        res.json(user)
    } else {
        console.log(`User non existant`)
        res.status(404)
        throw new Error('User non existant')
    }
})

const getFlights = asyncHandler(async (req,res)=>{
    try {
        const idFlights = await FlightPassenger.find({idPassenger:req.params.idUser})
        const flights = await Promise.all(idFlights.map((id)=>{
            const flight = Flight.findOne({idFlight: id.idFlight})
            if(!flight) {
                formData.append("idCard",idCard)
                formData.append("pilotLicense",pilotLicense)
                console.log(`Flight not found : ${id}`)
                res.status(404).json({
                    message:`Flight not found : ${id}`
                })
                throw new Error(`Flight not found : ${id}`)
            }
            return flight
        }))
        res.json(flights)
    } catch (error) {
        console.log(error.message)
    }
})


const signUser = asyncHandler(async (req,res,next)=>{
    if(!req.files) {
        console.log("Cannot download files")
    } else {
        var idCardPath = req.files["idCard"][0].filename
        var pilotLicensePath = req.files["pilotLicense"][0].filename
        try {
            const {firstname, lastname, email,password,role} = req.body
            const userExist = await User.findOne({email:email})

            if(userExist) {
                console.log("User already exist")
                return res.status(400).json({
                    message:`User already exist`
                })
            } else {
                const salt = await bcrypt.genSalt(10)
                const cryptedPassword = await bcrypt.hash(password, salt)
                const user = await User.create({
                    firstname: firstname, 
                    lastname: lastname, 
                    email: email,
                    password: cryptedPassword,
                    role: role,
                    idCard: idCardPath,
                    pilotLicense: pilotLicensePath
                })

                if(user) {
                    const token = jwt.sign(
                        {idUser:user._id, uName: user.email},
                        private_key,
                        {expiresIn:'24h'}
                    )
                    checkUser()
                    return res.status(200).json({
                        message:`Success`,
                        data:user,
                        token
                    })
                } else {
                    console.log(`Invalid user data : : ${firstname} ${lastname} ${email} ${password} ${role}`)
                    return res.status(400).json({
                        message:`Invalid user data`
                    })
                }
            }
        } catch (error) {
            console.error()
            console.log(error.message)
            return res.status(500).json({
                message:`Error during user creation`,
                data:error
            })
        }
    }
    
})

const checkUser = (mail,password) => {
    const transporter = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: "planifly@mail.com",
            pass: password
        }
    })

    const verifLink = "link of verif page"

    const options = {
        from: "planifly@mail.com",
        to: mail,
        subject: "Mail checking",
        html: `<p>Click on the link to confirm your mail address : <a href="${verifLink}"></a></p>`
    }

    transporter.sendMail(mailOptions, (err, info)=> {
        if(err) {
            console.log(err)
        } else {
            console.log(`Mail sent to ${mail}`)
        }
    })
}

export {
    getUsers,
    getUserById,
    signUser,
    getFlights
}