import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'

describe('GetTransactionByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.person.firstName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )

        return { sut, getTransactionsByUserIdUseCase }
    }

    it('should return 200 when finding transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })

        // assert
        expect(result.statusCode).toBe(200)
    })
})
