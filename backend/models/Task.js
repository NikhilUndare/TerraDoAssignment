const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    }
});

const task = mongoose.model('task',taskSchema);
module.exports = task;