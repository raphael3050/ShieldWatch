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
                    // Vérifier si une règle avec le même pattern et le même scope existe déjà (rien ne sert de créer une règle en double)
                    const existingRule = await Rule.findOne({ 
                        pattern: input.pattern, 
                        scope: input.scope 
                    });
        
                    if (existingRule) {
                        return existingRule; // Retourner la règle existante
                    }
        
                    // Créer une nouvelle règle si aucune duplication n'est trouvée
                    const newRule = new Rule({
                        name: input.name,
                        description: input.description,
                        scope: input.scope,
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
            } else {
                throw new ApolloError("Le pattern n'est pas une expression régulière valide");
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

        deleteAllRules: async () => {
            try {
                const rules = await Rule.find(); // Récupérer toutes les règles existantes
                await Rule.deleteMany(); // Supprimer toutes les règles
                return rules; // Retourner la liste des règles supprimées
            } catch (error) {
                throw new ApolloError('Erreur lors de la suppression de toutes les règles');
            }
        }
    }

};