const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fields: [{
        type: mongoose.Schema.Types.Mixed
      }],
    responses: [{
        type: mongoose.Schema.Types.Mixed
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
