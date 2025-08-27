"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const questions_1 = __importDefault(require("./questions"));
const sessions_1 = __importDefault(require("./sessions"));
const dashboard_1 = __importDefault(require("./dashboard"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/questions', questions_1.default);
router.use('/sessions', sessions_1.default);
router.use('/dashboard', dashboard_1.default);
exports.default = router;
