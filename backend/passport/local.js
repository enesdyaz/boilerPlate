const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local')
const db = require('../models')
const bcrypt = require('bcrypt')


module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',  // req.body.email
        passwordField: 'password'  //req.body.password
    }, async (email, password, done)=>{
        try{
            const exUser = await db.User.findOne({ where: { email }})
            if(!exUser){
                return done(null, false, {reason: 'no user'})  // 에러, 성공, 실패
            }
            const result = await bcrypt.compare(password, exUser.password)  // true or false
            if(result){
                return done(null, exUser)  // 성공했으니 exUser 정보를 넣어준다.  에러, 성공, 실패
            }else{
                return done(null, false, {reason: 'password was wrong'})
            }
        }
        catch(error){
            console.log(error)
            return done(error)  // 에러가 나니 에러, 성공, 실패중에 첫번째에 error를 넣어준다

        }
        
    }))
}