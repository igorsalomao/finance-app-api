import 'dotenv/config.js'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByController } from './src/controllers/get-user-by-id.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
    const getUserByController = new GetUserByController()

    const { statusCode, body } = await getUserByController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
)
