import type { User, PrismaClient, Prisma } from '@prisma/client'

export type ResolverParent = unknown
export type ResolverContext = {
    orm: PrismaClient,
    //User: Express.User | undefined
}

export function findAll(parent: ResolverParent, arg: {skip:number, take?:number, where:Prisma.UserWhereInput}, context: ResolverContext): Promise<User[]> {
    try {
        console.error('entro try :::::');
        return context.orm.user.findMany({skip:arg.skip, take:arg.take, where:arg.where})
    } catch (error) {
        console.error('Error en findAll resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}

// export function findUserByEmail(parent: unknown, args: { email: String | null }, context: ResolverContext): Promise<User | null>|null {
//     // return context.orm.user.findUnique({ where: { email: args.email } })
//     return null;
// }

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

// export function createUser(
//     parent: unknown,
//     {
//         data,
//     }:{data:Pick<User, ''>}
// )