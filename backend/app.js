//------------------------------------------------//
// BACKEND/FRONT PORT
//------------------------------------------------//
const backPort = '3085'
const frontPort = '3000'


const express = require('express')
const db = require('./models')
const cors = require('cors')
const morgan = require('morgan')

//------------------------------------------------//
// ROUTER REQUIRE
//------------------------------------------------//
const userRouter = require('./routes/user')
// const widgetRouter= require('./routes/widget')
// const imageRouter = require('./routes/image')
// const databaseRouter = require('./routes/database')
// const postRouter = require('./routes/post')
// const loadPostRouter = require('./routes/loadPost')

//------------------------------------------------//
// PASSPORT MODULE
//------------------------------------------------//
const passport = require('passport')
const passportConfig = require('./passport')
const session = require('express-session')
const cookie = require('cookie-parser')
const app = express()
app.use(morgan('dev'))

db.sequelize.sync( ) // db 실행 {force:true}


app.use(express.json()) // express 가 json을 받기 위함
app.use(express.urlencoded( {extended: false})) 
// passport
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ns747800',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))
app.use(cookie('ns747800'))
app.use(passport.initialize())
app.use(passport.session())
passportConfig()



//------------------------------------------------//
// CORS FRONTEND PORT
//------------------------------------------------//

app.use(cors({
    origin: `http://localhost:${frontPort}`,
    credentials: true
}))   

//------------------------------------------------//
// IMAGE STATIC FILES
//------------------------------------------------//

app.use('/', express.static('uploads'));


//------------------------------------------------//
// ROUTER API
//------------------------------------------------//

app.get('/', (req,res)=>{ res.send('hello wizeto') })
app.use('/user', userRouter)  
// app.use('/image', imageRouter)
// app.use('/widget', widgetRouter) 

// app.use('/database', databaseRouter)
// app.use('/post', postRouter)
// app.use('/loadpost', loadPostRouter)





//------------------------------------------------//
// LISTEN
//------------------------------------------------//
app.listen(backPort,()=>{ console.log(`YES backend server is ${backPort}`) })