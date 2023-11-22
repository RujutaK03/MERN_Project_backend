const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const adminSchema = require('../schema/adminSchema');

const router = express.Router();
const upload = multer();

router.post("/add-admin-user", upload.none(), async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const exists = adminSchema.findOne({ email });
        if (exists) {
            return res.status(201).send("User with this email is already registered. Please use different email");
        }

        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const adminUser = new adminSchema({ email: email, password: encryptedPassword });
        await adminUser.save();

        res.status(200).send("New Admin User added successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminSchema.findOne({ email });
        if (!admin) {
            res.status(201).send("Invalid email. Please entered registered email");
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            res.status(201).send("Incorrect Password. Please enter again");
        }
        res.status(200).send("Login Successful");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;