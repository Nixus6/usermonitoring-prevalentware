import type { PrismaClient, Prisma, Country } from '@prisma/client'

export type ResolverParent = unknown
export type ResolverContext = {
    orm: PrismaClient,
    user: String
}

export async function findAllCountries(parent: ResolverParent, arg: { skip: number, take?: number, where: Prisma.CountryWhereInput }, context: ResolverContext): Promise<Country[]> {
    try {
        const countries = await context.orm.country.findMany({ skip: arg.skip, take: arg.take, where: arg.where });
        return countries;
    } catch (error) {
        console.error('Error en findAllCountries resolver:', error);
        throw error; // Lanzar el error para que se refleje en la respuesta GraphQL
    }
}