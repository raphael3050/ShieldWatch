// Des règles insérées par défaut dans la base de données MongoDB en guise d'exemple
export const defaultRules = [
  {
    name: "Block IP",
    description: "Block traffic from a specific IP address",
    action: "BLOCK",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pattern: "^192\\.168\\.1\\.2$",
    scope: "IP",
  },
];
