//Entidad de usuarios en PostgreSQL
const {DataTypes} = require('sequelize')
const sequelize = require('../config/db_postgres')

const Inventario = sequelize.define("Inventario", {
    id_inventario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },   
    lote: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {min: 0} //min significa que el valor no puede ser menor a 0
    },
    fecha_ult_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "Inventario",
    timestamps: false
})

module.exports = Inventario

