export const typeDefs = `
    type Rule {
        id: ID!
        name: String!
        description: String
        severity: Int!         # Niveau de gravité (0-10)
        action: String!        # Action à prendre (ex : "block", "alert", etc.)
        createdAt: String!
        updatedAt: String!
        pattern: String        # Regex
    }

    input RuleInput {
        name: String!
        description: String
        severity: Int!        
        action: String!      
        pattern: String 
    }

    type Query {
        rules: [Rule!]
        rule(id: ID!): Rule
    }

    type Mutation {
        createRule(input: RuleInput!): Rule!
    }

`;