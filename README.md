# READ ME

Projet CocktAIL par Abdoul.

**<span style="color:red">Attention : L'installation du modèle de génération d'images est d'environ 12GB, Vous pouvez désactiver la generation d'image dans .env</span>**

Informations :

```
<!-- Login -->
username: root
password: 123

Lorsque vous êtes connecté, vous n'aurez pas besoin de vous reconnecter. Rafraichissez la page.

<!-- Base de données -->
La base de données est une base de données SQLite, facile a gérer et simple pour un projet simple.

<!-- Modèle IA -->
 - Llama3 est utilisé est un modèle de génération de texte pour les cocktails et un modèle de génération d'images pour les images de cocktails. Un modèle assez avancé et suffisant dans notre cas.

 - StableDiffusion est utilisé pour la génération d'images, modèle opensource et facile à mettre en place.

<!-- Variables d'environnement -->
IMAGE_GENERATION -> False ou True si vous voulez activez la génération d'image
```

1. Pour tester le projet merci de passer les commandes dans l'ordre suivant :

```bash
# Front end
cd frontend
npm install
npm run dev
```
http://localhost:5173

```bash
cd backend
py -m venv .venv
./.venv/Scripts/activate/
# Ou pour linux 
source .venv/bin/activate

pip install -r requirements.txt 
py ./manage.py runserver
# Normalement vous n'avez pas besoin de faire de migrations car la bdd est dans le repository
```

2. Pour deployer le projet sur docker passer les commandes suivantes:

Tout d'abord il faudra faire des modifications : 

Dans `/frontend/vite.config.ts` il faut décommenter les lignes commentées

```bash
docker-compose up --build # A la racine du projet, ca prends environ 5-10 minutes en fonction de votre machine
```

Merci !!
