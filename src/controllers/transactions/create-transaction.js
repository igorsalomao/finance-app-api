import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    serverError,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            //TODO: refatorar validação de campos
            const requireFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requireFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            // Verificando se o ID do usuário é valido
            const userIdIsValid = checkIfIdIsValid(params.user.id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            // Verificando se o valor da transação é valido
            if (params.amount <= 0) {
                return badRequest({ message: 'Amount must be greater than 0.' })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'Amount must be a valid currency.',
                })
            }

            // Verificando se o tipo da transação é valido
            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNINGS', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message:
                        'The type must be one of: EARNINGS, EXPENSE or INVESTMENT.',
                })
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
