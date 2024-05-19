import { prisma } from "../db.js";
import { DateTimeScalar } from "graphql-date-scalars";
export const resolvers = {
    DateTime: DateTimeScalar,
    Query: {
        listFragrances: async (_parent, _args) => {
            return await prisma.fragrance.findMany();
        },
        getFragrance: async (_parent, args) => {
            const { id } = args;
            return await prisma.fragrance.findUnique({ where: { id } });
        }
    },
    Mutation: {
        createFragrance: async (_parent, args) => {
            const { name, description, category, image_url } = args.fragrance;
            const fragrance = await prisma.fragrance.create({
                data: {
                    name,
                    description,
                    category,
                    image_url,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
            return fragrance;
        },
        updateFragrance: async (_parent, args) => {
            const { id, name, description, category, image_url } = args.fragrance;
            return await prisma.fragrance.update({
                where: { id },
                data: {
                    name,
                    description,
                    category,
                    image_url,
                    updated_at: new Date()
                }
            });
        },
        deleteFragrance: async (_parent, args) => {
            const { id } = args;
            return await prisma.fragrance.delete({
                where: { id }
            });
        }
    }
};
