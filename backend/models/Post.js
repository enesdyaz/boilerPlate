module.exports = (sequelize, DataTypes) => {
    const Post  = sequelize.define('Post', {   // user의 모델
        postContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

    },
    {   // user의 설정 부분
        charset: 'utf8mb4', // 한국어, 이모티콘 사용가능
        collate: 'utf8mb4_general_ci',  // 한국어 이모티콘 저장
    })


    Post.associate = (db) => {
        db.Post.belongsTo(db.User)
        db.Post.hasMany(db.Comment)
        // db.Post.hasMany(db.Image)
        // db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'})

    }
    return Post;
}