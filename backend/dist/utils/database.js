"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: './database/learning_platform.db',
    synchronize: true, // Auto-create tables in development
    logging: false,
    entities: [models_1.User, models_1.Question, models_1.Session, models_1.UserProgress],
    migrations: [],
    subscribers: [],
});
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Database connection established successfully.');
    }
    catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
