export const typeDefs = `
    enum ActionType {
        ALERT
        BLOCK
    }

    enum Scope {
        URL
        IP
        BODY
    }

    type Rule {
        id: ID!
        name: String!
        description: String
        action: ActionType!     # Action à prendre ("ALERT" ou "BLOCK")
        createdAt: String!
        updatedAt: String!
        pattern: String!        # Regex
        scope: Scope!           # Champ à analyser ("URL", "IP" ou "BODY")
    }

    input RuleInput {
        name: String!
        description: String
        action: ActionType!      
        pattern: String!
        scope: Scope!
    }

    type Query {
        rules: [Rule!]
        rule(id: ID!): Rule
    }

    type Mutation {
        createRule(input: RuleInput!): Rule!
        deleteRule(id: ID!): Rule!
    }

`;