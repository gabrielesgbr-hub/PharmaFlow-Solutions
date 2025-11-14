const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const connectPostgres = async () => {
    try {
        await sequelize.authenticate()
        const host = sequelize.options.host
        const database = sequelize.config.database
        console.log(`PostgreSQL Connected: ${host} / DB: ${database}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
};

module.exports = { sequelize, connectPostgres }
