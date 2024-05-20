export const typeDefs = `#graphql
    scalar DateTime
    input createFragranceInput {
        name: String!,
        description: String,
        category: String,
        image_url: String
    }
    input updateFragranceInput {
        id: String!,
        name: String,
        description: String,
        category: String,
        image_url: String
    }

    type Fragrance {
        id: String,
        name: String,
        description: String,
        category: String,
        image_url: String,
        created_at: DateTime,
        updated_at: DateTime
    }

    type Query {
        listFragrances: [Fragrance]
        getFragrance(id: String!): Fragrance
    }

    type Mutation {
        createFragrance(fragrance: createFragranceInput): Fragrance
        updateFragrance(fragrance: updateFragranceInput): Fragrance
        deleteFragrance(id: String!): Fragrance
    }
`;
