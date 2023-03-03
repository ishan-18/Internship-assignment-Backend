"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql_1 = __importDefault(require("mysql"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: './config/config.env'
});
var app = (0, express_1.default)();
app.use(express_1.default.json());
var connectionDB = mysql_1.default.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: '',
    database: process.env.database
});
connectionDB.connect(function (err) {
    if (err) {
        console.error("Error: ".concat(err.stack));
    }
    console.log("Database Connected...");
});
var PORT = process.env.PORT || 5001;
console.log("Server Listening at http://localhost:".concat(PORT));
