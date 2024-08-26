import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    async crypto(password) {
        await bcrypt.hash(password, 10)
    }
}
