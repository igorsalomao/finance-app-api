import validator from 'validator'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, ok, serverError } from './helpers.js'

export class GetUserByController {
    async execute(httpRequest) {
        try {
            const isIdValidD = validator.isUUID(httpRequest.params.userId)
            if (!isIdValidD) {
                return badRequest({
                    message: 'The provider ID is not valid.',
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(isIdValidD)

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
