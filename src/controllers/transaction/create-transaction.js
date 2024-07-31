import {
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    requiredFieldIsMissingResponse,
    serverError,
    validateRequiredFields,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requireFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requireFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            // Verificando se o ID do usuário é valido
            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            // Verificando se o valor da transação é valido
            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }

            // Verificando se o tipo da transação é valido
            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIfTypeIsValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
            }

            // Criando a transação
            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
