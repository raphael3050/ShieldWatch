/**
*   Fonction qui vérifie si une regex est valide
*   @param {string} pattern - La regex à vérifier
*   @returns {boolean} - true si la regex est valide, false sinon
*/
export function isValidRegex(pattern) {
    try {
        new RegExp(pattern);
        return true;  // Si aucune erreur n'est levée, la regex est valide
    } catch (e) {
        return false; // Si une erreur est levée, la regex est invalide
    }
}