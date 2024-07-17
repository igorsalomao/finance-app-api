import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o email ja esta em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProviderEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProviderEmail) {
            throw new Error('The provider email is already in use.')
        }

        // gerar ID do usuário
        const userId = uuidv4()

        //criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        // inserir o usuário no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório
        // TODO: injetar como dependência no constructor
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
