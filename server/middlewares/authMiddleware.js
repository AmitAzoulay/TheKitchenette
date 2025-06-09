const jwt = require("jsonwebtoken")

function auth(req, res, next){
    try {
        
        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (verified)
        {
            next()
            return;
        }
        else {
            res.status(401).json({errorMessage: "Unauthorized"}) 
        }
            
    } catch (error) {
        console.log(error)
        res.status(401).json({errorMessage: "Unauthorized"})
    }
}
function boolAuth(req, res, next) {
    try {
            const token = req.cookies.token;
            if (!token) return res.json(false);
           
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            
            if(!verified){
                res.json(false);
            }
            else{
                    console.log("yogev")
                    next();
            }
    
            
        } catch (err) {
            res.json(false);
        }
}
module.exports = {auth,boolAuth}