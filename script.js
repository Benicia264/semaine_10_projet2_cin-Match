const CLE_API = "de0baa4e7925bf72821238733f2796df";
const URL_API = `https://api.themoviedb.org/3/movie/popular?api_key=${CLE_API}&language=fr-FR`;
const URL_RECHERCHE = `https://api.themoviedb.org/3/search/movie?api_key=${CLE_API}&language=fr-FR&query=`;

const elLoader = document.getElementById("loader");
const elGrille = document.getElementById("grille-films");
const elErreur = document.getElementById("message-erreur");
const elRecherche = document.getElementById("barre-recherche");

const modal = document.getElementById("modal-film");
const modalBody = document.getElementById("modal-body");
const btnFermer = document.getElementById("bouton-fermer");

// Déterminer la classe de couleur selon la note
function obtenirCouleurNote(note) {
    if (note >= 7) return "note-verte";
    if (note >= 5) return "note-orange";
    return "note-rouge";
}

// Fonction d'affichage des films dans la grille
function afficherFilms(liste) {
    if (!elGrille) return;
    elGrille.innerHTML = "";

    liste.forEach((film) => {
        const { title, poster_path, release_date, vote_average } = film;

        const urlAffiche = poster_path
            ? "https://image.tmdb.org/t/p/w500" + poster_path
            : "https://via.placeholder.com/500x750?text=Pas+d'image";

        const annee = release_date ? release_date.split("-")[0] : "N/A";
        const noteFormatted = vote_average ? vote_average.toFixed(1) : "N/A";
        const classeCouleur = obtenirCouleurNote(vote_average);

        const carte = document.createElement("div");
        carte.classList.add("carte-film");
        carte.innerHTML = `
        <img src="${urlAffiche}" alt="${title}">
        <div class="info-film">
          <h3>${title}</h3>
          <p>
            <span><i class="fa-regular fa-calendar-days"></i> ${annee}</span>
            <span><i class="fa-solid fa-star"></i> <strong class="${classeCouleur}">${noteFormatted}</strong></span>
          </p>
        </div>
    `;

        carte.addEventListener("click", () => ouvrirModal(film));
        elGrille.appendChild(carte);
    });
}

// Fonction d'affichage de la modale de détails
// Fonction d'affichage de la modale de détails avec LocalStorage pour les favoris
function ouvrirModal(film) {
    const urlAffiche = film.poster_path
        ? "https://image.tmdb.org/t/p/w500" + film.poster_path
        : "https://via.placeholder.com/500x750?text=Pas+d'image";

    const synopsis = film.overview && film.overview.trim() !== ""
        ? film.overview
        : "Aucun résumé disponible pour ce film.";

    const noteFormatted = film.vote_average ? film.vote_average.toFixed(1) : "N/A";
    const classeCouleur = obtenirCouleurNote(film.vote_average);

    // 1. Récupérer les favoris existants depuis le LocalStorage
    let favoris = JSON.parse(localStorage.getItem("favoris_films")) || [];

    // 2. Vérifier si ce film est DÉJÀ dans les favoris
    const estFavori = favoris.some((item) => item.id === film.id);

    // 3. Injecter le HTML de la modale
    modalBody.innerHTML = `
    <div class="modal-detail-grid">
      <img src="${urlAffiche}" alt="${film.title}">
      <div class="modal-info">
        <h2>${film.title}</h2>
        <div class="meta">
          <p><i class="fa-regular fa-calendar-days"></i> Sortie : ${film.release_date || "Inconnue"}</p>
          <p><i class="fa-solid fa-star"></i> Note : <strong class="${classeCouleur}">${noteFormatted}/10</strong></p>
        </div>
        <h3>Résumé :</h3>
        <p class="synopsis">${synopsis}</p>
        <button id="btn-favori" class="btn-fav ${estFavori ? 'actif' : ''}">
          <i class="${estFavori ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
          ${estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
      </div>
    </div>
  `;

    modal.style.display = "flex";

    // 4. Gestion du clic sur le bouton Favori avec enregistrement dans le LocalStorage
    const btnFav = document.getElementById("btn-favori");
    if (btnFav) {
        btnFav.addEventListener("click", () => {
            // Re-récupérer la liste à jour
            let listeFavoris = JSON.parse(localStorage.getItem("favoris_films")) || [];
            const index = listeFavoris.findIndex((item) => item.id === film.id);

            if (index !== -1) {
                // Le film y est déjà -> On le retire du LocalStorage
                listeFavoris.splice(index, 1);
                btnFav.classList.remove("actif");
                btnFav.innerHTML = '<i class="fa-regular fa-heart"></i> Ajouter aux favoris';
            } else {
                // Le film n'y est pas -> On l'ajoute au LocalStorage
                listeFavoris.push({
                    id: film.id,
                    title: film.title,
                    poster_path: film.poster_path,
                    vote_average: film.vote_average
                });
                btnFav.classList.add("actif");
                btnFav.innerHTML = '<i class="fa-solid fa-heart"></i> Retirer des favoris';
            }

            // Sauvegarder le tableau mis à jour dans le LocalStorage
            localStorage.setItem("favoris_films", JSON.stringify(listeFavoris));
        });
    }
}

// Fermeture de la modale
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

// Chargement des films populaires
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
        if (elErreur) elErreur.textContent = "Impossible de charger les films.";
        console.error("Détail de l'erreur:", error);
    }
}

// Recherche de films
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

// Écouteur de la recherche
if (elRecherche) {
    elRecherche.addEventListener("input", (e) => {
        rechercherFilms(e.target.value);
    });
}

// Initialisation
chargerFilmsPopulaires();