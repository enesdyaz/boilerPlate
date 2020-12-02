module.exports = (sequelize, DataTypes) => {
    const Comment  = sequelize.define('Comment', {   // user의 모델
        commentContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {   // user의 설정 부분
        charset: 'utf8mb4', // 한국어, 이모티콘 사용가능
        collate: 'utf8mb4_general_ci',  // 한국어 이모티콘 저장
    })


    Comment.associate = (db) => {
        db.Comment.belongsTo(db.Post)
        db.Comment.belongsTo(db.User)
        // db.Post.hasMany(db.Image)
        // db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'})

    }
    return Comment;
}