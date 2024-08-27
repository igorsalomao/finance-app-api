import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    async crypto(password) {
        return await bcrypt.hash(password, 10)
    }
}
