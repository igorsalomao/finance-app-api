import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            // Verificar se o userId foi passado como parâmetro
            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }
            // Verificar se o userId é um ID válido
            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }
            // Chamar o use case
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId })

            // Retornar resposta http
            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
