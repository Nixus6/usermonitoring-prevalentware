import type { User } from '@prisma/client'
import * as user from './user.resolver'
import * as scalars from './scalars'
export default  {
    ...scalars,
    Query: {
        users: user.findAll,
        // user: user.findUserByEmail  
    },
    User: user.resolver,
}