module.exports = (sequelize, DataTypes) => {
    const User  = sequelize.define('User', {   // user의 모델
        email: {    // 모델의 table
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true, // 중복 금지
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    },
    {   // user의 설정 부분
        charset: 'utf8', // 한국어 사용가능
        collate: 'utf8_general_ci',  // 한국어 저장
    })


    User.associate = (db) => {
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment)
    }
    return User;
}