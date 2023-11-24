import * as country from './country.resolver'
import * as usermonitoring from './user-monitoring.resolver'
import * as user from './user.resolver'
import * as scalars from './scalars'
export default  {
    ...scalars,
    Query: {
        users: user.findAll,
        user: user.findUserByEmail,
        countries: country.findAllCountries,
        usermonitoring: usermonitoring.findAllUserMonitoring,
        usersinmonitoring: user.findUsersInMonitoring,
        mainUsers:user.findMainUsers,
    },
    User: user.resolver,
}