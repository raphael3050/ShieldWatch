# ShieldWatch

## Déploiement

### Prérequis
Pour déployer l'application, vous aurez besoin d'une installation fonctionnelle de Docker et Docker Compose. Vous pouvez les installer en suivant les instructions sur le site officiel de Docker.

Une fois le projet téléchargé, vous devez modifier le fichier docker-compose.yml pour ajouter les variables d'environnement nécessaires. Il faut nottament configurer le webhook Slack pour recevoir les notifications.

Pour cela, rendez-vous sur le site de Slack et créez un channel. Ensuite, créez une application Slack et ajoutez un webhook pour le channel que vous avez créé. Copiez le lien du webhook et ajoutez-le dans le fichier docker-compose.yml.