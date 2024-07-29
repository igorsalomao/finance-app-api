import validator from 'validator'
import { badRequest } from './index.js'

export const checkIfAmountIsValid = (amount) => {
    return validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNINGS', 'EXPENSE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = () =>
    badRequest({
        message: 'Amount must be a valid currency.',
    })

export const invalidTypeResponse = () =>
    badRequest({
        message: 'The type must be one of: EARNINGS, EXPENSE or INVESTMENT.',
    })
