const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minlength: 11,
        maxlength: 11,
        required: true
    },
    isGold: {
        type: Boolean,
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(20).required,
        isGold: Joi.boolean()
    }

    Joi.validate(customer, schema);
}


exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;