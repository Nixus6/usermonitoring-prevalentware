import type { User, PrismaClient, Prisma } from '@prisma/client'


type ResolverCOntext = {
    orm: PrismaClient
}
export function findAll(parent: unknown, arg: { skip?: number, take?: number, where: Prisma.UserWhereInput }, context: ResolverCOntext): Promise<User[]> {
    return context.orm.user.findMany({ skip: arg.skip, take: arg.take, where: arg.where})
}

export function findUserByEmail(parent: unknown, args: { email: String | null }, context: ResolverCOntext): Promise<User | null> {
    return context.orm.user.findUnique({ where: { email: args.email } })
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

// export function createUser(
//     parent: unknown,
//     {
//         data,
//     }:{data:Pick<User, ''>}
// )