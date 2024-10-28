import Rule from '../model/rule.js';
import { ApolloError } from 'apollo-server-errors'
import { isValidRegex } from '../../regexValidator.js';

export const resolvers = {
    Query: {
        rules: async () => {
            try {
                const rules = await Rule.find();
                return rules;
            } catch (error) {
                throw new ApolloError('Erreur lors de la récupération des règles');
            }
        },
    },

    Mutation: {
        createRule: async (_, { input }) => {
            if (isValidRegex(input.pattern)) {
                try {
                    const newRule = new Rule({
                        name: input.name,
                        description: input.description,
                        severity: input.severity,
                        action: input.action,
                        pattern: input.pattern,
                        createdAt: new Date().toISOString(), // Date de création
                        updatedAt: new Date().toISOString(), // Date de mise à jour
                    });

                    const savedRule = await newRule.save();
                    return savedRule; // Retourner la règle créée
                } catch (error) {
                    throw new ApolloError('Erreur lors de la création de la règle');
                }
            }else{
                throw new ApolloError('Le pattern n\'est pas une expression régulière valide');
            }
        },

        deleteRule: async (_, { id }) => {
            try {
                const rule = await Rule.findByIdAndDelete(id);
                return rule;
            } catch (error) {
                throw new ApolloError('Erreur lors de la suppression de la règle');
            }
        },
    }

};