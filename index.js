import 'dotenv/config.js'
import express from 'express'
import {
    CreateUserController,
    GetUserByController,
    UpdateUserController,
    DeleteUserController,
} from './src/controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresGetUserByIdRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
} from './src/repositories/postgres/index.js'
import {
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from './src/use-cases/index.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByController = new GetUserByController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/users', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
)
