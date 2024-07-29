import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        // Validar se o user existe
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse()
        }

        // Chamar o repository para buscar as transações
        const transaction =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transaction
    }
}
