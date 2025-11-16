//Utiliza postgreSQL
// Entidad de productos en PostgreSQL
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_postgres');

const Producto = sequelize.define("Producto", {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    principio_activo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    presentacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: { min: 0.01 }
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "Producto",
    timestamps: false
});

module.exports = Producto;

Producto.associate = (models) => {
    Producto.hasMany(models.Inventario, { foreignKey: 'id_producto', as: 'inventarios' });
};