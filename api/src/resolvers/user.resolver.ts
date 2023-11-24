import type { User, PrismaClient, Prisma, Session, UserMonitoring } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server'

export type ResolverParent = unknown
export type ResolverContext = {
    orm: PrismaClient,
    user: string
}

interface ErrorResponse {
    message: String
}

async function validateSessionUser(context: ResolverContext) {
    try {
        const session = await context.orm.session.findUnique({
            where: {
                sessionToken: context.user,
            },
            include: {
                user: true,
            },
        })
        console.log("session: ", session);
        if (!session) {
            console.log("entro session false: ");
            return false;
        }

        const user = await context.orm.user.findUnique({
            where: {
                id: session?.user.id,
            },
            include: {
                role: true,
            },
        })

        console.log("ussere ", user);
        return true
    } catch (error) {
        console.error("Error in findIdUserSession: ", error);
        throw new ApolloError('Ocurrió un error ene el servidor', 'CUSTOM_ERROR_CODE', {
            customData: 'Información adicional del error',
        });
    }

}

export async function findAll(parent: ResolverParent, arg: { skip: number, take?: number, where: Prisma.UserWhereInput }, context: ResolverContext): Promise<User[] | ErrorResponse> {
    try {
        const payload = await validateSessionUser(context);
        if (!payload) {
            throw new ApolloError('El usuario no cuenta con los permisos necesarios para realizar esta acción', 'FORBIDDEN_ERROR', { statusCode: 403 });
        }
        const users = await context.orm.user.findMany({ skip: arg.skip, take: arg.take, where: arg.where });
        return users;

    } catch (error) {
        console.error('Error en findAll resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}


export async function findUserByEmail(parent: ResolverParent, args: { email: string }, context: ResolverContext): Promise<User | null> {
    // Validar el formato del correo electrónico (puedes personalizar según tus necesidades)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
        throw new ApolloError('Formato de correo electrónico no válido', 'INVALID_EMAIL_FORMAT');
    }
    const user = await context.orm.user.findUnique({
        where: {
            email: args.email
        }
    })
    if (!user) {
        // Puedes personalizar el mensaje de error según tus necesidades
        throw new ApolloError('Usuario no encontrado', 'USER_NOT_FOUND');
    }
    return user;
}

export async function findUsersInMonitoring(parent: ResolverParent, arg: { fechaInicial: Date, fechaFinal: Date }, context: ResolverContext): Promise<User[] | void> {
    try {
        const userMonitoringCount = await context.orm.userMonitoring.groupBy({
            by: ['userId'],
            where: {
                createdAt: {
                    gte: arg.fechaInicial,
                    lte: arg.fechaFinal,
                },
            },
            orderBy: {
                _count: {
                    userId: 'desc', // Ordenar por el recuento de userId de forma descendente
                },
            },
            take: 3,
        });
        const userPromises: Promise<User | null>[] = userMonitoringCount.map(async (userMonitoring) => {
            const user = await context.orm.user.findUnique({
                where: {
                    id: userMonitoring.userId,
                },
            });
            return user;
        });

        const users = await Promise.all(userPromises);

        // Filtrar para eliminar posibles valores nulos (usuarios no encontrados)
        const filteredUsers = users.filter((user) => user !== null) as User[];

        console.log(filteredUsers);
        return filteredUsers;
    }
    catch (error) {
        console.error('Error en findUsersMonitoring resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}

export async function findMainUsers(parent: ResolverParent, arg: { skip?: number, take?: number, monitoreo: string, idCiudad: string, fechaInicial: Date, fechaFinal: Date }, context: ResolverContext): Promise<User[]> {
    try {
        const result = await context.orm.$queryRaw<User[]>`SELECT DISTINCT u.* FROM "_CountryToUser" c 
       JOIN
        "UserMonitoring" um ON c."B" = um."userId"
             JOIN 
           "User" u ON c."B" = u.id
         WHERE
         um.description = ${arg.monitoreo}
         AND c."A" = ${arg.idCiudad}
         AND um."createdAt" >= ${arg.fechaInicial}
         AND um."createdAt" <= ${arg.fechaFinal} limit 3`;
        return result
    } catch (error) {
        console.error('Error en findUsersMonitoring resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}

export const resolver: Record<keyof User/*(User & {attributes:Attributes})*/, (parent: User /*User & {attributes:Attributes}*/) => unknown> = {
    id: (parent) => parent.id,
    email: (parent) => parent.email,
    emailVerified: (parent) => parent.emailVerified,
    termsAndConditionsAccepted: (parent) => parent.termsAndConditionsAccepted,
    name: (parent) => parent.name,
    image: (parent) => parent.image,
    position: (parent) => parent.position,
    createdAt: (parent) => parent.createdAt,
    updatedAt: (parent) => parent.updatedAt,
    roleId: (parent) => parent.roleId,
}