import * as user from './user.resolver'

export default  {
    Query: {
        users: user.findAll,
    }
}