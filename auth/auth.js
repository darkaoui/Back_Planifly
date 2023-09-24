import jwt from 'jsonwebtoken'

import private_key from './private_key.js'

const authMdlr = (req,res,next)=>{
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({
            message:`Vous devez disposer d'un token pour acceder aux ressources de l'api`
        })
    }

    jwt.verify(token,private_key,(error,decodedToken)=>{
        if(error){
            return res.status(401).json({
                message:`Vous devez disposer d'un token valide pour acceder aux ressources de l'api`,
                data:error
            })
        }

        const userId = decodedToken.userId
        if(req.body.userId && req.body.userId !== userId){
            return res.status(401).json({
                message:`Vous devez disposer d'un token valide pour acceder aux ressources de l'api - ID`
            })
        } else {
            next()
        }
    })
}

module.exports = authMdlr