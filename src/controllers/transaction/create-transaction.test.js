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
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }
    it('should return 201 when creating a transaction successfully (expenses)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating a transaction successfully (earnings)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNINGS',
            },
        })

        // assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 when creating a transaction successfully (investments)', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        })

        // assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type is not EXPENSE, EARNINGS or INVESTMENT', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if CreateTransactionUseCase throws', async () => {
        // arrange
        const { createTransactionUseCase, sut } = makeSut()
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(baseHttpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
