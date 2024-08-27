import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUseByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUseByIdRepository = getUseByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createTransactionsParams) {
        // Validar se o usuário existe
        const userId = createTransactionsParams.user_id

        const user = await this.getUseByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        // Gerar ID da transação
        const transactionId = this.idGeneratorAdapter.generate()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionsParams,
            id: transactionId,
        })

        return transaction
    }
}
