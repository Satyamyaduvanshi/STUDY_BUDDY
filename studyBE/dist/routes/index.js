"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const router = (0, express_1.Router)();
//* home route
const homeRoutes = (req, res) => {
    try {
        res.status(200).json({
            message: " welcome to the STUDY BUDDY api homepage!!"
        });
    }
    catch (e) {
        res.status(500).json({
            message: "internal server error"
        });
        return;
    }
};
//* user routes
router.use("/api/user", userRoutes_1.default);
router.get("/api/", homeRoutes);
//* rooms routes
exports.default = router;
