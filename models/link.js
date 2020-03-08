const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const urlValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 500],
        message: 'Url must not exceed {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isURL',
        message: 'URL must be valid'
    })

];

const tagValidator = [
    // TODO: Make some validations here...
]

// Define the database model
const LinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'URL is required.'],
        unique: true,
        validate: urlValidator
    },
    tag: {
        type: String,
        validate: tagValidator
    },
});

// Use the unique validator plugin
LinkSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Link = module.exports = mongoose.model('link', LinkSchema);
