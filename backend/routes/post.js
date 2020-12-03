const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();



//-------------------------------------
// image - uploads
//-------------------------------------
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
        done(null, 'uploads');
        },
        filename(req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext); // 제로초.png, basename = 제로초, ext = .png
        done(null, basename + Date.now() + ext);
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 },
});

// upload 폴더로 바로 복사만 함. 그리고 복사된 파일 이름을 프론트로 전송함
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
    res.json(req.files.map(v => v.filename));
});

//-------------------------------------
// POST text CRUD  , imagepath
//-------------------------------------

router.get('/loadPost', async(req, res, next)=>{   // GET /postLoad?offset=10&limit=10   --get 요청시 쿼리를 사용할수 있다 
    try{
        const posts = await db.Post.findAll({
            include: [{  model: db.Comment }, {model: db.User, attributes: ['id', 'username', 'email']}],
            // include: [{
            //     model: db.Image
            // }],

            order: [['createdAt', 'DESC'], ['updatedAt','ASC']]
            // limit: req.query.limit,
            // offset: req.query.offset
        })
        console.log('harry-posts', posts)
        res.json(posts)

    }catch(err){
        next(err)
    }
})


router.post('/createPost', isLoggedIn, async(req, res, next)=>{
    try{
        console.log('post-comment', req.body)
        console.log(req.user.id)
        const newPost = await db.Post.create({
            postContent: req.body.postContent,
            UserId: req.user.id
        })
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{  model: db.Comment }, {model: db.User, attributes: ['id', 'username', 'email']}],
            order: [['createdAt', 'DESC'], ['updatedAt','ASC']]
        })
        res.json(fullPost)
    }
    catch(err){
        next(err)

    }
})

router.delete('/delete/:id', async(req, res, next)=>{
    try{
        const removePost = await db.Post.destroy({
            where:{
                id: req.params.id
            }
        })
        console.log(removePost)
        res.json('deleted')
    }catch(err){
        next(err)
    }
})








router.post('/text', isLoggedIn, async(req, res, next)=>{
    try{
        console.log('harry-text', req.body.text)
        console.log('image', req.body.src)
        console.log('harry-id', req.user.id)
// 1. newPost -> Post에 text를 저장한다 login한 user를 저장한다.
        const newPost = await db.Post.create({
            text: req.body.text,     // hashtag가 들어있을 수 있다. 
            UserId: req.user.id   // login이 되면 deserialize 에서 req.user 로 현재 사용자의 아이디를 넣어주고 isAuthenticated를 true로 넣어준다
        })    
        console.log('newPost-harry', newPost)
        
        
        const hash = req.body.text.match(/#[^\s]+/g)   //hashtag = ["#nodejs" , "#vue"]
// 2. hash -> 만약 hash테그가 존재하면 Hashtag 데이터베이스에 저장하고, hashtags 가 belongsToMany로 저장하기 위해 addHashtags를 사용하여 newPost안에 같이 넣어줌
        if(hash){    //     배열 관계에서는 Promise.all을 사용해줘야 함.
            const result = await Promise.all(hash.map(tag=> db.Hashtag.findOrCreate({   // findOrCreate, create와 같음 하지만 이미 내용이 있으면 저장하지 않음. 중복 방지 
                where:{
                    hashtag: tag.slice(1).toLowerCase()    // ["nodejs", "#vue"]  -> ["nodejs", "vue"] 
                }
            })))
            await newPost.addHashtags(result.map(r=>r[0]))   // map으로 배열을 넣을 때 사용해야 함. r[0] = ["nodejs", "vue"]
                                // sequelize 문법중 관계를 정의한 후에  addHashtags, getHashtags, setHashtags(수정), removeHashtags 메서드가 자동으로 생김
                                // 만약 작동이 되지 않으면  db.sequelize.query('SELECT * FROM post') 등으로 직접 설정을 해줘야 한다. 다 sequelize가 할수는 없다.                   
        }
//3. Post안에 있는 User의 로그인된 아이디를 찾아서 그 작성한 사람의 아이디값과 username, email값을 다 받아와서 res로 front단으로 넘겨준다.


        if(req.body.src){
            if(Array.isArray(req.body.src)){
                const imgAddress = await Promise.all(req.body.src.map((i)=>{ 
                    return db.Image.create({
                        src: i,
                        PostId: newPost.id
                    })
                }))
            }else{
                await db.Image.create({
                    src: req.body.image,
                    PostId: newPost.id
                })
            }
        }

        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                    model: db.User,
                    attributes: ['id', 'username', 'email']
                }],
            include: [{
                model: db.Image,
            }]
        })
        return res.json(fullPost)
    }catch(err){
        next(err)
    }
})



//-------------------------------------
// COMMENT
//-------------------------------------

router.get('/:id/loadComment', async (req, res, next) => {
    try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
        return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll({
        where: {
        PostId: req.params.id,
        },
        include: [{
        model: db.User,
        attributes: ['id', 'username'],
        }],
        order: [['createdAt', 'DESC']],
    });
    res.json(comments);
    } catch (err) {
    console.error(err);
    next(err);
    }
});




router.delete('/:id/removeComment', async(req, res, next)=>{
    try{
        const removeComment = await db.Comment.destroy({
            where:{
                id: req.params.id
            }
        })
        console.log(removeComment)
        res.json('deleted')
    }catch(err){
        next(err)
    }
})


router.post('/:id/createComment', isLoggedIn, async(req, res, next)=>{  // id-param
    try{
// POST DB에서 id로 해당 포스트를 찾아서  
        console.log('harry-reqbody', req.body)      
        const post = await db.Post.findOne({
            where: {
                id: req.params.id
            }
        })
        if(!post){
            res.status(404).send('No Post')
        }
// 그 포소트 id와 같이 COMMENT 데이터베이스에 넣어라
        const newComment = await db.Comment.create({
            commentContent: req.body.commentContent,
            PostId: post.id,  //  = await post.addComment(newComment.id) 같은 방법이다. 하지만 서버에 무리를 줈 있음. addComments 는 여러개 파일 입력가능 
            UserId: req.user.id
        })

// 그리고 newComment 데이터와 같이 user의 정보(username이 필요함!) 도 같이 만들어서 프론트에 보내주기
        const resComment = await db.Comment.findOne({
            where: {
                id: newComment.id
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'username']
                }
            ]

        })
        return res.json(resComment)

    }catch(err){
        next(err)
    }
})




module.exports = router;