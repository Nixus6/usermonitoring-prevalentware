import type { User, PrismaClient, Prisma, Session } from '@prisma/client'
import { ApolloError, UserInputError } from 'apollo-server'

export type ResolverParent = unknown
export type ResolverContext = {
    orm: PrismaClient,
    user: String
}

interface ErrorResponse {
    message: String
}

async function validateSessionUser(context: ResolverContext) {
    try {
        const session = await context.orm.session.findUnique({
            where: {
                sessionToken: context.user.toString(),
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


export async function findUserByEmail(parent: unknown, args: { email: String }, context: ResolverContext): Promise<User | null> {
    const user = await context.orm.user.findUnique({
        where: {
            email: args.email.toString()
        }
    })
    return user;
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