const jwt = require("jsonwebtoken")

function adminAuth(req, res, next){
    try {
        
        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (verified.isAdmin)
        {
            next()
            return;
        }
        else if(verified && !verified.isAdmin){
            res.status(401).json({errorMessage: "Unauthorized logged in user"}) 
        }
        else {
            res.status(401).json({errorMessage: "Unauthorized not logged in user"}) 
        }
            
    } catch (error) {
        console.log(error)
        res.status(401).json({errorMessage: "Unauthorized"})
    }
}
function boolAdminAuth(req,res,next){
    try {
            const token = req.cookies.token;
            if (!token) return res.json(false)
    
            const verified = jwt.verify(token, process.env.JWT_SECRET)
    
          if(verified.isAdmin) {
              
                return res.json(true)
            }
            else {
             
                 res.json(false)
        }
        } catch (err) {
            
            console.error(err);
            return res.json(false)
        }
}

module.exports = {adminAuth,boolAdminAuth}