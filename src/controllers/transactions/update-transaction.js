import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    checkIfAmountIsValid,
    invalidAmountResponse,
    checkIfTypeIsValid,
    invalidTypeResponse,
    ok,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            // Validar se o ID da transação é valido
            const transactionId = httpRequest.params.transactionId

            const isIdValid = checkIfIdIsValid(transactionId)

            if (!isIdValid) {
                return invalidIdResponse()
            }
            // Validar campos obrigatórios
            const params = httpRequest.body

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }
            // Validar se o amount é > 0 e se tem 2 casas decimais
            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }
            // Validar se o type e valido (EARNINGS, EXPENSE, INVESTMENT)
            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }
            // Atualizar transação
            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
                params,
            )
            ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
