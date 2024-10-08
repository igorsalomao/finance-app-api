import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'

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

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: { userId: undefined },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: { userId: 'invalid_user_id' },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when getTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        // act
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when getTransactionsByUserIdUseCase throws generic error', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // act
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: { userId: userId },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
