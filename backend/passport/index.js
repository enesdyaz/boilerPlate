const passport = require('passport')
const local = require('./local')
const db = require('../models/')

module.exports = () => {
    passport.serializeUser((user, done)=>{
        return done(null, user.id)   // 에러, 성공, 실패
    })
    passport.deserializeUser( async (id, done)=>{    // login후 모든 request들은 이쪽으로 와서 사용자 정보를 전해준다.
        try{
            const user = await db.User.findOne({ 
                where: { id },
                attributes: ['id', 'username']
            })
            return done(null, user)   // req.user 로 넣어줌,  req.isAuthenticated()  = true 로 만들어줌
        }catch(err){
            console.log(err)
            return done(err)
        }
        
    })

    local()
}

