import type { User } from '@prisma/client'
import * as country from './country.resolver'
import * as user from './user.resolver'
import * as scalars from './scalars'
export default  {
    ...scalars,
    Query: {
        users: user.findAll,
        user: user.findUserByEmail,
        countries: country.findAllCountries, 
    },
    User: user.resolver,
}