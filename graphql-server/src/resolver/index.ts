import { prisma } from "../db.js";
import { DateTimeScalar } from "graphql-date-scalars";
interface createFragranceInput {
    fragrance: {
        name: string,
        description: string,
        category: string,
        image_url: string
    }
}

interface updateFragranceInput {
    fragrance: {
        id: string,
        name: string,
        description: string,
        category: string,
        image_url: string
    }
}

export const resolvers = {
    DateTime: DateTimeScalar,
    Query: {
        listFragrances: async (_parent: any, _args: any) => {
            return await prisma.fragrance.findMany()
        },
        getFragrance: async (_parent: any, args: {id: string}) => {
            const { id } = args
            return await prisma.fragrance.findUnique({where: { id }})
        }
    },
    Mutation: {
        createFragrance: async (_parent: any, args: createFragranceInput) => {
            const { name, description, category, image_url } = args.fragrance
            const fragrance = await prisma.fragrance.create({
                data: {
                    name,
                    description,
                    category,
                    image_url,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            })
            return fragrance
        },
        updateFragrance: async (_parent: any, args: updateFragranceInput) => {
            const { id, name, description, category, image_url } = args.fragrance
            return await prisma.fragrance.update({
                where: { id },
                data: {
                    name,
                    description,
                    category,
                    image_url,
                    updated_at: new Date()
                }
            })
        },
        deleteFragrance: async (_parent: any, args: {id: string}) => {
            const { id } = args
            return await prisma.fragrance.delete({
                where: { id }
            })
        }
    }
}