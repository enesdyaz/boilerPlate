const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();


//----------------------------------------------
// GET 
//----------------------------------------------
router.get('/', isLoggedIn, async(req, res, next)=>{
    const user = await req.user
    res.json(user)
})

//----------------------------------------------
// POST
//----------------------------------------------

// SIGN UP
router.post('/signup', async (req, res, next)=>{  
    try{
        const hash = await bcrypt.hash(req.body.password, 12)
        const exUser  = await db.User.findOne({
            where: {
                email: req.body.email
            }
        })
        if(exUser){
            return res.status(403).json({
                errorCode: 1,
                message: 'The same email is exsit. Pleae check again'
            })
        }else{
        const newUser = await db.User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })

        // and Login
        passport.authenticate('local', (err, user, info)=>{   // done의 역할, 에러, 성공, 실패
            if(err){
                return next(err)
            }
            if(info){
                return res.status(401).send(info.reason)
            }
            return req.login(user, async (err)=>{    // 세션이 저장됨, 어떻게 저장할 것인지는 (serializerUser)로 user, done 매개변수와 함께 넘어감, 
                                                        //이 부분에 Header 임, 보통 user.id로 저장이 됨. 프론트에 쿠키 저장도 같이 해줌. 
                if(err){
                    return next(err)
                }
                return res.json(user)               // 이 부분은 Body 로 따로 들어감
            })
        })(req, res, next)



        return res.status(201).json(newUser)
        }
    } catch(error){
        return next(error)
    }
})


// LOGIN
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{   // done의 역할, 에러, 성공, 실패
        if(err){
            return next(err)
        }
        if(info){
            return res.status(401).send(info.reason)
        }
        return req.login(user, async (err)=>{    // 세션이 저장됨, 어떻게 저장할 것인지는 (serializerUser)로 user, done 매개변수와 함께 넘어감, 
                                                    //이 부분에 Header 임, 보통 user.id로 저장이 됨. 프론트에 쿠키 저장(connect.sid) 도 같이 해줌. 
            if(err){
                return next(err)
            }
            return res.json(user)               // 이 부분은 Body 로 따로 들어감
        })
    })(req, res, next)
})

// LOGOUT
router.post('/logout', isLoggedIn, (req, res)=>{
    if(req.isAuthenticated()){  // 로그인 하였는지 확인
        req.logout()
        req.session.destroy() //선택사항
        return res.status(200).send('successfully logged out')
    }
})

  
  



module.exports = router