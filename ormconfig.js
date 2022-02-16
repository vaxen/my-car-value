var dbConfig  = {
    synchronize: 'true',
}
console.log('env is ', process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
    case 'dev':
        Object.assign(dbConfig,{
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        });
        break
    case 'test':
        Object.assign(dbConfig,{
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        });
        break
    case 'production':
        Object.assign(dbConfig,{
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnauthorized: false
            }
        });
        break
    default:
        throw new Error('Uknown db environment')
}
module.exports = dbConfig;
