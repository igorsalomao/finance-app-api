import { UserNotFoundError } from '../../errors/user'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        // Validar se o ID da transação existe
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const transaction =
            await this.updateTransactionRepository.execute(params)

        return transaction
    }
}
