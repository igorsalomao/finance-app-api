import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
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
            const hashedPassword = await this.passwordHasherAdapter.crypto(
                updateUserParams.password,
            )

            user.password = hashedPassword
        }

        // 3. chamar o repository para atualizar o usuário
        const updateUser = await this.updateUserRepository.execute(userId, user)

        return updateUser
    }
}
