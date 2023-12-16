const express = require('express');
const mongoose = require('mongoose');
const user = require('../models/User');
const task = require('../models/Task');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/gettask', (req, res) => {
    task.find().then((taskdata) => {
        res.json({ data: taskdata })
    }).catch((error) => {
        res.json({ message: error.message })
    })
})

router.get('/gettask/:id', (req, res) => {
    task.findById(req.params.id).then((taskdata) => {
        res.json({ data: taskdata })
    }).catch((error) => {
        res.json({ message: error.message })
    })
})


router.post('/createtask', async (req, res) => {
    try {
        const taskdata = await task.create({
            title: req.body.title,
            description: req.body.description
        });
        res.json({ success: true, data: taskdata })
    } catch (error) {
        console.log(error);
        res.status(404)
    }
})

router.put('/updatetask/:id', (req, res) => {
    const updatedtaskdata = req.body;
    const id = req.params.id
    task.findByIdAndUpdate({ _id: id }, updatedtaskdata).then((newTaskdata) => {
        if (!newTaskdata) {
            return res.status(404).json({ message: "task not found" })
        }
        res.status(200).json({
            message: "task updated successfully",
            data: updatedtaskdata
        })

    }).catch(error => {
        res.status(500).json({
            message: "failed to delete task",
            error: error
        })
    })
})

router.delete('/deletetask/:id', (req, res) => {
    const id = req.params.id
    task.findByIdAndDelete({ _id: id }).then((response) => {
        if (!response) {
            return res.status(404).json({ message: "task not found" })
        }
        res.json({
            message: "task deleted successfully",
            data: response
        });
    }).catch(err => {
        res.status(500).json({
            message: "Failed to delete!",
            data: err
        });
    });
})

router.post('/createuser', async (req, res) => {
    const password = req.body.password
    try {
        const Salt = await bycrypt.genSalt(10);
        const securePassword = await bycrypt.hash(password, Salt);


        const userdata = await user.create({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            password: securePassword
        })
        res.json({ success: true, data: userdata })

    } catch (error) {
        console.log(error);
        res.status(400)
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        let userdata = await user.findOne({ email })
        if (!userdata) {
            return res.status(400).json({ error: "User does not exist" })
        }

        const pwdCompare = bycrypt.compareSync(password, userdata.password);
        if (!pwdCompare) {
            return res.status(400).json({ error: "try logging in with correct credentials" })
        }

        const data = {
            user: {
                id: userdata.id
            }
        }
        const authToken = jwt.sign(data, process.env.SECRET_CODE);
        return res.json({ success: true, authToken, userdata })
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

module.exports = router;
