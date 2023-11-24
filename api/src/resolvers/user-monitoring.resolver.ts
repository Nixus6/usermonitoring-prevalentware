import type { PrismaClient, Prisma, Country, UserMonitoring } from '@prisma/client'
import { findUserByEmail } from './user.resolver';

export type ResolverParent = unknown
export type ResolverContext = {
    orm: PrismaClient,
    user: string
}

export async function findAllUserMonitoring(parent: ResolverParent, arg: { email: string, fechaInicial: Date, fechaFinal: Date }, context: ResolverContext): Promise<UserMonitoring[]> {
    try {
        const user = await findUserByEmail(null, { email: `${arg.email}` }, context);
        const userMonitoring = await context.orm.userMonitoring.findMany({
            where: {
                userId: user?.id,
                createdAt: {
                    gte: arg.fechaInicial,
                    lte: arg.fechaFinal,

                },
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return userMonitoring;
    } catch (error) {
        console.error('Error en findAllUserMonitoring resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}
