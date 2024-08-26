import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        // Validar se o user existe
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        // Chamar o repository para buscar as transações
        const transaction =
            await this.getTransactionsByUserIdRepository.execute(userId)

        return transaction
    }
}
