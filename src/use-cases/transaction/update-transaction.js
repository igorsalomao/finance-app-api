export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(transactionId, params) {
        // Validar se o ID da transação existe
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        return transaction
    }
}
