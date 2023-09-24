import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import private_key from '../auth/private_key.js'

const loginUser = asyncHandler(async (req,res)=>{
    try {
        const remoteUser = JSON.parse(req.params.logs)
        const user = await User.findOne({email:remoteUser.email})
        if(!user){
            console.log(`Can't find user ${remoteUser.email}`)
            return res.status(404).json({
                message:`Can't find user ${remoteUser.email}`
            })
        }
        const isPasswordValid = await bcrypt.compare(remoteUser.password,user.password)
        //const isPasswordValid = remoteUser.password == user.password

        if(!isPasswordValid){
            console.log(`Incorrect password`)
            return res.status(401).json({
                message:`Incorrect password`
            })   
        }

        const token = jwt.sign(
            {idUser:user._id, uName: user.email},
            private_key,
            {expiresIn:'24h'}
        )

        return res.status(200).json({
            message:`Success`,
            data:user,
            token
        })
    } catch (error) {
        console.error()
        console.log(error.message)
        return res.status(500).json({
            message:`Error during connexion`,
            data:error
        })
    }
})

export {loginUser}