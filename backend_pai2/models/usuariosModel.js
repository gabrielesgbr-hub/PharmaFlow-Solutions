//Entidad de usuarios en PostgreSQL
const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/db_postgres')

const Usuario = sequelize.define("Usuario",{
    id_usuario:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_sql: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: "usuario",
    timestamps: false
}
)

module.exports = Usuario