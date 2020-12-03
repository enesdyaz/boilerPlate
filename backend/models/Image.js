module.exports = (sequelize, DataTypes) => {
    const Image  = sequelize.define('Image', {   // user의 모델
        src: {
            type: DataTypes.STRING(200),
            allowNull: false,
        }
    },
    {   // user의 설정 부분
        charset: 'utf8', // 한국어 사용가능
        collate: 'utf8_general_ci',  // 한국어 저장
    })


    Image.associate = (db) => {
        db.Image.belongsTo(db.Post)
    }
    return Image;
}