# 🎬 CinéMatch - Application de Recherche de Films

CinéMatch est une Single Page Application (SPA) dynamique développée en HTML5, CSS3 et JavaScript ES6+. Elle permet de consulter les films les plus populaires du moment et de rechercher n'importe quel film en temps réel en utilisant l'API de **TMDB (The Movie Database)**.

---

## 🚀 Fonctionnalités

- *Films populaires* : Chargement automatique des films tendance dès l'ouverture de la page.
- *Recherche en temps réel* : Recherche instantanée de films au fur et à mesure de la saisie.
- *Détails & Synopsis (Modale)* : Clic sur n'importe quel film pour ouvrir une fenêtre pop-up affichant le résumé complet, la date de sortie et un bouton de mise en favoris.
- *Indicateur de note dynamique* : La note du film s'affiche avec une couleur spécifique selon son score (Vert ≥ 7, Orange ≥ 5, Rouge < 5).
- *Design Responsive & Sombre* : Interface moderne optimisée pour ordinateurs, tablettes et téléphones portables.
- *Icônes intégrées* : Utilisation de Font Awesome pour un rendu visuel professionnel.


## 🛠️ Technologies utilisées

- *HTML5* : Structure sémantique (<header>, <main>, <footer>, <dialog>/modal).
- *CSS3* : Flexbox, CSS Grid, Variables CSS, Animations, Media Queries (Responsive Design).
- *JavaScript (ES6+)* : async/await, Fetch API, manipulation du DOM, gestion des événements.
- *API TMDB* : Source des données des films.
- *Font Awesome 6* : Bibliothèque d'icônes vectorielles.
## 📁 Structure du projet

```text
cinematch/
├── index.html      # Structure HTML sémantique et éléments de la modale
├── style.css       # Design sombre, grille CSS responsive et styles de la modale
├── script.js       # Logique applicative (Fetch API, manipulation du DOM, filtres)
└── README.md       # Documentation du projet