const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    };
};

const validations = {
    register: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password min 6 characters')
    ],
    login: [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password required')
    ],
    campaign: [
        body('title').notEmpty().withMessage('Title required'),
        body('description').notEmpty().withMessage('Description required'),
        body('target_amount').isNumeric().withMessage('Target amount must be number')
    ],
    donation: [
        body('campaign_id').notEmpty().withMessage('Campaign ID required'),
        body('amount').isNumeric().withMessage('Amount must be number')
    ]
};

module.exports = { validate, validations };
