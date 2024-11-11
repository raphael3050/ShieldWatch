# ShieldWatch

## Déploiement

### Prérequis
Pour déployer l'application, vous aurez besoin d'une installation fonctionnelle de Docker et Docker Compose. Vous pouvez les installer en suivant les instructions sur le site officiel de Docker.

Une fois le projet téléchargé, vous devez modifier le fichier `.env` à la racine du projet pour y ajouter les variables d'environnement nécessaires. Vous pouvez vous inspirer du fichier `.env.example` pour connaître les variables à ajouter.


## Tests

Pour lancer les tests d'un microservice, vous pouvez utiliser la commande suivante:

````
docker compose run {service_name} npm test
````
Ou service name est le nom du service (celui présent dans le ficheir docker-compose.yml) que vous voulez tester (auth, notification, ou shieldwatch).


#### Sercice d'authentification

Pour le service d'authentification, vous devez ajouter les variables suivantes:

````
JWT_SECRET=your_secret_key
ADMIN_LOGIN=your_admin_login
ADMIN_PASSWORD=your_admin_password
````

La première variable est la clé secrète utilisée pour générer les tokens JWT. La deuxième et la troisième variables sont les identifiants de l'administrateur de l'application (ce stockage d'identifiants est simplifié en utilisant le fichier .env). Pour générer une clé secrète, vous pouvez utiliser la commande suivante:

````
openssl rand -base64 32
````
ou 
````
node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"
````

#### Service de notification

Pour le service de notification, vous devez ajouter les variables suivantes:

````
SLACK_WEBHOOK_URL=your_slack_webhook_url
````

La variable `SLACK_WEBHOOK_URL` est l'URL du webhook Slack que vous avez créé pour recevoir les notifications. Pour créer un webhook Slack, vous pouvez suivre les instructions sur le site officiel de Slack. Vous devez d'abord créer une application Slack, puis ajouter un webhook à cette application dans les paramètres de l'application.



### Déploiement

Une fois les variables d'environnement ajoutées, vous pouvez déployer l'application en utilisant la commande suivante:

````
sudo docker-compose up --build
````

Cette commande va construire les images Docker nécessaires et démarrer les conteneurs. Attention, il faut attendre quelques instants pour que les conteneurs soient prêts.
Vous verrez cette ligne dans la console quand l'application sera prête:

````
-----------------------------------------------------------
[*] SHIELDWATCH
[*] All services are running, you can now send requests.
[+] The server is running on http://localhost:3005
-----------------------------------------------------------
````

Ensuite, il faut attendre que le client Next.js soit prêt. Vous verrez cette ligne dans la console quand le client sera prêt:

````

 > next-app-template@0.0.1 start
 > next start

   ▲ Next.js 14.2.4
   - Local:        http://localhost:3000

  ✓ Starting...
  ✓ Ready in 645ms
````

Vous pouvez maintenant accéder à l'application en ouvrant votre navigateur et en allant à l'adresse `http://localhost:3000`.