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
function ouvrirModal(film) {
  const urlAffiche = film.poster_path
    ? "https://image.tmdb.org/t/p/w500" + film.poster_path
    : "https://via.placeholder.com/500x750?text=Pas+d'image";

  const synopsis = film.overview && film.overview.trim() !== "" 
    ? film.overview 
    : "Aucun résumé disponible pour ce film.";

  const noteFormatted = film.vote_average ? film.vote_average.toFixed(1) : "N/A";
  const classeCouleur = obtenirCouleurNote(film.vote_average);

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
        <button id="btn-favori" class="btn-fav">
          <i class="fa-regular fa-heart"></i> Ajouter aux favoris
        </button>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  const btnFav = document.getElementById("btn-favori");
  if (btnFav) {
    btnFav.addEventListener("click", () => {
      btnFav.classList.toggle("actif");
      if (btnFav.classList.contains("actif")) {
        btnFav.innerHTML = '<i class="fa-solid fa-heart"></i> Retirer des favoris';
      } else {
        btnFav.innerHTML = '<i class="fa-regular fa-heart"></i> Ajouter aux favoris';
      }
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