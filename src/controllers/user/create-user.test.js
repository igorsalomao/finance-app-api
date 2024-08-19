import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'Igor',
                last_name: 'Salomao',
                email: 'igor@gmail.com',
                password: '1234567',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                last_name: 'Salomao',
                email: 'igor@gmail.com',
                password: '1234567',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('First name is required.')
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'Igor',
                email: 'igor@gmail.com',
                password: '1234567',
            },
        }
        // act
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Last name is required.')
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)
        const httpRequest = {
            body: {
                first_name: 'Igor',
                last_name: 'Salomao',
                password: '1234567',
            },
        }
        // act
        const result = await createUserController.execute(httpRequest)
        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('E-mail is required.')
    })
})
