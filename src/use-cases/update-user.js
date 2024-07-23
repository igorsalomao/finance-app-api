import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }
    async execute(userId, updateUserParams) {
        // 1. se o email estiver sendo atualizado, verificar se o email existe
        if (updateUserParams.email) {
            const userWithProviderEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        // 2. se a senha estiver sendo atualizada, criptografar a nova senha
        const user = { ...updateUserParams }

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        // 3. chamar o repository para atualizar o usuário
        const updateUser = await this.updateUserRepository.execute(userId, user)

        return updateUser
    }
}
