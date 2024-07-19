import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresUpdateUserRepository {
    async execute(userId, updateParams) {
        const updateFields = [] // ['first_name = $1', 'last_name = $2']
        const updateValues = [] // [Igor, Salomão]

        Object.keys(updateParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateParams[key])
        })

        updateValues.push(userId)

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id = $${updateValues.length}
            RETURNING *
        `

        const updateUser = await PostgresHelper.query(updateQuery, updateValues)

        return updateUser[0]
    }
}
