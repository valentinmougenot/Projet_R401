# Projet R.401

## Comment installer ce projet

```bash
git clone https://github.com/valentinmougenot/Projet_R401.git
cd Projet_R401
npm install
```

### Créer la base de données

Dans postgresql, créer une base de données nommée `fimu`, ou un nom de votre choix.

Modifier le fichier `config/db.config.ts` pour y mettre le nom de la base de données et vos identifiants.

Décommenter la ligne 390 du fichier `models/index.ts` pour insérer les données dans la base de données.

```bash
npm run build
npm start
```

Ctrl + c

Commenter la ligne 390 du fichier `models/index.ts` pour ne pas insérer les données à chaque démarrage.

```bash
npm run build
npm start
```
