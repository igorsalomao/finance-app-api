import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction'
describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { createTransactionUseCase, sut }
    }

    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.person.firstName(),
            date: faker.date.anytime().toISOString(),
            type: 'EARNINGS',
            amount: Number(faker.finance.amount()),
        },
    }
    it('should return 201 when creating a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(201)
    })
})
