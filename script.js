const CLE_API = "de0baa4e7925bf72821238733f2796df";
const URL_API = `https://api.themoviedb.org/3/movie/popular?api_key=${CLE_API}&language=fr-FR`;
const URL_RECHERCHE = `https://api.themoviedb.org/3/search/movie?api_key=${CLE_API}&language=fr-FR&query=`;

const elLoader = document.getElementById("loader");
const elGrille = document.getElementById("grille-films");
const elErreur = document.getElementById("message-erreur");
const elRecherche = document.getElementById("barre-recherche");
// Éléments de la Modale
const modal = document.getElementById("modal-film");
const modalBody = document.getElementById("modal-body");
const btnFermer = document.getElementById("bouton-fermer");


// Fonction pour remplir et afficher la modale
function ouvrirModal(film) {
    const urlAffiche = film.poster_path
        ? "https://image.tmdb.org/t/p/w500" + film.poster_path
        : "https://via.placeholder.com/500x750?text=Pas+d'image";

    const synopsis = film.overview && film.overview.trim() !== ""
        ? film.overview
        : "Aucun résumé disponible pour ce film.";

    modalBody.innerHTML = `
    <div class="modal-detail-grid">
      <img src="${urlAffiche}" alt="${film.title}">
      <div class="modal-info">
        <h2>${film.title}</h2>
        <div class="meta">
          <span>📅 Sortie : ${film.release_date || "Inconnue"}</span> | 
          <span>⭐ Note : ${film.vote_average ? film.vote_average.toFixed(1) : "N/A"}/10</span>
        </div>
        <h3>Résumé :</h3>
        <p class="synopsis">${synopsis}</p>
      </div>
    </div>
  `;

    modal.style.display = "flex";
}

// Gestion de la fermeture (Bouton X ou clic à l'extérieur)
if (btnFermer) {
    btnFermer.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// --- FONCTION D'AFFICHAGE REUTILISABLE ---
function afficherFilms(liste) {
    if (!elGrille) return;
    elGrille.innerHTML = ""; // On vide la grille

    liste.forEach((film) => {
        const { title, poster_path, release_date, vote_average } = film;

        const urlAffiche = poster_path
            ? "https://image.tmdb.org/t/p/w500" + poster_path
            : "https://via.placeholder.com/500x750?text=Pas+d'image";

        const annee = release_date ? release_date.split("-")[0] : "N/A";
        const note = vote_average ? vote_average.toFixed(1) : "N/A";

        // 1. On crée une div
        const carte = document.createElement("div");
        carte.classList.add("carte-film");
        carte.innerHTML = `
        <img src="${urlAffiche}" alt="${title}">
        <div class="info-film">
          <h3>${title}</h3>
          <p>📅 ${annee} | ⭐ ${note}</p>
        </div>
    `;

        // 2. On écoute le clic sur cette carte
        carte.addEventListener("click", () => ouvrirModal(film));

        // 3. On l'ajoute à la grille
        elGrille.appendChild(carte);
    });
}

// --- CHARGEMENT INITIAL (POPULAIRES) ---
async function chargerFilmsPopulaires() {
    if (elErreur) elErreur.textContent = "";
    try {
        const reponse = await fetch(URL_API);
        if (!reponse.ok) throw new Error(`Erreur réseau: ${reponse.status}`);

        const donnees = await reponse.json();
        if (elLoader) elLoader.style.display = "none";

        afficherFilms(donnees.results);
    } catch (error) {
        if (elLoader) elLoader.style.display = "none";
        if (elErreur) elErreur.textContent = "Impossible de charger les films, vérifie ta clé API!";
        console.error("Détail de l'erreur:", error);
    }
}

// --- RECHERCHE ---
async function rechercherFilms(requete) {
    if (!requete || requete.trim() === "") {
        chargerFilmsPopulaires();
        return;
    }

    try {
        const reponse = await fetch(URL_RECHERCHE + encodeURIComponent(requete));
        if (!reponse.ok) throw new Error("Erreur lors de la recherche");

        const donnees = await reponse.json();

        if (donnees.results.length === 0) {
            if (elErreur) elErreur.textContent = "";
            elGrille.innerHTML = "<p class='aucun-resultat'>Aucun film trouvé 😅</p>";
            return;
        }

        if (elErreur) elErreur.textContent = "";
        afficherFilms(donnees.results);

    } catch (error) {
        if (elErreur) elErreur.textContent = "Erreur lors de la recherche.";
        console.error(error);
    }
}

// Écouteur d'événement
if (elRecherche) {
    elRecherche.addEventListener("input", (e) => {
        rechercherFilms(e.target.value);
    });
}

chargerFilmsPopulaires();