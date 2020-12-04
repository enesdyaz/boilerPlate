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
    limit: { fileSize: 5 * 1024 * 1024 },
});

// upload 폴더로 바로 복사만 함. 그리고 복사된 파일 이름을 프론트로 전송함
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
    res.json(req.files.map(v => v.filename));
});






//-------------------------------------
// POST text CRUD  , imagepath
//-------------------------------------


router.get('/loadPost', async(req, res, next)=>{   // GET /postLoad?offset=10&limit=10   --get 요청시 사용, 10개 이후 10개를 가져와라 
    try{
        let where = {}   
        if(parseInt(req.query.lastId, 10)){
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)  // less than 6 // req.query.lastId=6 
                }
            }
        }

        const posts = await db.Post.findAll({
            where,
            include: [{  model: db.Comment }, {model: db.User, attributes: ['id', 'username', 'email']}, {model: db.Image}],
            order: [['createdAt', 'DESC'], ['updatedAt','ASC']],
            // offset: parseInt(req.query.offset, 10) ,
            limit: parseInt(req.query.limit, 10) 
            
        })
        res.json(posts)

    }catch(err){
        next(err)
    }
})


// router.post('/createPost', isLoggedIn, async(req, res, next)=>{
//     try{
//         const newPost = await db.Post.create({
//             postContent: req.body.postContent,
//             UserId: req.user.id
//         })
//         const fullPost = await db.Post.findOne({
//             where: { id: newPost.id },
//             include: [{  model: db.Comment }, {model: db.User, attributes: ['id', 'username', 'email']}],
//             order: [['createdAt', 'DESC'], ['updatedAt','ASC']]
//         })
//         res.json(fullPost)
//     }
//     catch(err){
//         next(err)

//     }
// })

router.delete('/delete/:id', async(req, res, next)=>{
    try{
        const removePost = await db.Post.destroy({
            where:{
                id: req.params.id
            }
        })
        res.json('deleted')
    }catch(err){
        next(err)
    }
})








router.post('/createPost', isLoggedIn, async(req, res, next)=>{
    try{
        const newPost = await db.Post.create({
            postContent: req.body.postContent,    
            UserId: req.user.id  
        })    

        const hash = req.body.postContent.match(/#[^\s]+/g)   
        if(hash){    
            const result = await Promise.all(hash.map(tag=> db.Hashtag.findOrCreate({   
                where:{
                    hashtag: tag.slice(1).toLowerCase()   
                }
            })))
            await newPost.addHashtags(result.map(r=>r[0]))                     
        }

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
            include: [
                { model: db.User, attributes: ['id', 'username', 'email']}, 
                { model: db.Image },
                { model: db.Comment } 
            ],
            order: [['createdAt', 'DESC'], ['updatedAt','ASC']]
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
        res.json('deleted')
    }catch(err){
        next(err)
    }
})


router.post('/:id/createComment', isLoggedIn, async(req, res, next)=>{  // id-param
    try{
// POST DB에서 id로 해당 포스트를 찾아서  
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