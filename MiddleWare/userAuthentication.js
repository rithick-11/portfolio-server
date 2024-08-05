import jwt from "jsonwebtoken"

const usetAuthentication = async (req, res, next) => {
    const token = req.headers.authoriaztion.split(" ")[1]
    try{
        const {userId, username} = await jwt.verify(token, "rithick")
        req.body.user = {username, userId}
        next()
    }catch(err){
        res.status(404).json({msg:"invalid token"})
    }

}

export default usetAuthentication