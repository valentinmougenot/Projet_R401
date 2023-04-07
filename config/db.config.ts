import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "2609",
    DB: "fimu",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

export default dbConfig;