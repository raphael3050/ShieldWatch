import mongoose from 'mongoose';
import {hash} from 'hasha';
import immutablePlugin from 'mongoose-immutable';

// Définir le schéma de log
const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, immutable: true },
    eventType: { type: String, required: true, immutable: true },
    description: { type: String, required: true, immutable: true },
    ipAdress: { type: String, required: true, immutable: true },
    details: { type: Object, default: {}, immutable: true },
    hash: { type: String, required: true, immutable: true }
});

// Ajouter le plugin mongoose-immutable pour rendre les logs immutables
logSchema.plugin(immutablePlugin);

// Hook pour générer un hash avant de sauvegarder le log
logSchema.pre('validate', async function (next) {
    const logData = this.toObject();
    delete logData._id; // Exclure l'ID pour éviter des variations dans le hash
    this.hash = await hash(JSON.stringify(logData), { algorithm: 'sha256' });
    next();
});

// Créer le modèle Log
const Log = mongoose.model('Log', logSchema);

// Fonction pour créer un log
async function addLog({ eventType, description, ipAdress, details = {} }) {
    try {
        const newLog = new Log({ eventType, description, ipAdress, details });
        await newLog.save();
        return { success: true, log: newLog };
    } catch (error) {
        console.error('Erreur lors de la création du log:', error);
        return { success: false, error };
    }
}

// Fonction pour obtenir tous les logs
async function getLogs() {
    try {
        const logs = await Log.find({});
        return { success: true, logs };
    } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error);
        return { success: false, error };
    }
}


async function deleteLogById(id) {
    try {
        const result = await Log.findByIdAndDelete(id);
        if (result) {
            return { success: true, message: `Log avec l'ID ${id} supprimé.` };
        } else {
            return { success: false, message: `Aucun log trouvé avec l'ID ${id}.` };
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression du log avec l'ID ${id}:`, error);
        return { success: false, error };
    }
}

// Fonction pour supprimer tous les logs
async function deleteAllLogs() {
    try {
        const result = await Log.deleteMany({});
        return { success: true, message: `${result.deletedCount} logs supprimés.` };
    } catch (error) {
        console.error('Erreur lors de la suppression de tous les logs:', error);
        return { success: false, error };
    }
}

export { addLog, getLogs, deleteLogById, deleteAllLogs };