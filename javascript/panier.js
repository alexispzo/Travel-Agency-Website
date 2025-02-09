/*
Fichier permettant de gérer notre page panier, l'affichage des données, la suppresion d'un voayge etc.
*/

const container = document.getElementById("container");

class Voyage {
  constructor(id,image, dateArrivee, dateRetour, nombreAdultes, nombreEnfants, petitDejeuner, destination, prixTotal,lien,statut) {
    this._id = id;
    this._image = image;
    this._dateArrivee = dateArrivee;
    this._dateRetour = dateRetour;
    this._nombreAdultes = nombreAdultes;
    this._nombreEnfants = nombreEnfants;
    this._petitDejeuner = petitDejeuner;
    this._destination = destination;
    this._prixTotal = prixTotal;
    this._lien = lien;
    this._statut = statut;
  }

  isConfirmed() {
    return this._statut === 'Confirmé';
  }
}


// On récupère le voyage ajouté
let vosVoyages = JSON.parse(localStorage.getItem('voyages')) || [];

let idCounter = 0;

let voyageInstances = vosVoyages.map(function(voyage) {
  return new Voyage(
    idCounter++,
    voyage.image,
    voyage.dateArrivee,
    voyage.dateRetour,
    voyage.nombreAdultes,
    voyage.nombreEnfants,
    voyage.petitDejeuner,
    voyage.destination,
    voyage.prixTotal,
    voyage.lien,
    voyage.statut
  );
});

let tmp = document.getElementById("template");

for (let d of voyageInstances) {
  let clone = document.importNode(tmp.content, true);

  let nouveaucontenu = clone.firstElementChild.innerHTML
    .replace(/{{destination}}/g, d._destination)
    .replace(/{{date-arrivee}}/g, d._dateArrivee)
    .replace(/{{date-retour}}/g, d._dateRetour)
    .replace(/{{nombreAdultes}}/g, d._nombreAdultes)
    .replace(/{{nombreEnfants}}/g, d._nombreEnfants)
    .replace(/{{prixTotal}}/g, d._prixTotal + "€")
    .replace('greece1.avif',d._image)
    .replace(/{{lien}}/g,d._lien)
    .replace(/{{id}}/g,d._id)
    .replace(/{{statut}}/g,d._statut)

    if (d._petitDejeuner === true) {
      nouveaucontenu = nouveaucontenu.replace(/{{petitDejeuner}}/g, "Oui");
    } else if(d._petitDejeuner === false){
      nouveaucontenu = nouveaucontenu.replace(/{{petitDejeuner}}/g, "Non");
    }

    
    
  clone.firstElementChild.innerHTML = nouveaucontenu;

  if (d.isConfirmed()) {
    // Si le voyage est confirmé, on remplace les deux bouttons par "Voyage confirmé"
    clone.getElementById("bouttonSupprime").style.display = 'none';
    clone.getElementById("bouttonConfirmation").style.display = 'none';
    clone.getElementById("confirmation").innerHTML = '<label> Voyage confirmé </label>' ;
    clone.getElementById("confirmation").style.fontSize = "20px";
    clone.getElementById("confirmation").style.paddingTop = "7px";
  }

  container.appendChild(clone);
}

// Si il n'y a pas de voyages réservés, on affiche un message
if (vosVoyages.length == 0){
  document.addEventListener("DOMContentLoaded", function() {
    var containerElement = document.getElementById("container");
    containerElement.innerHTML = "<p>Vous n'avez pas encore de voyage dans le panier. Revenez quand ce sera le cas !</p>";
    containerElement.style.fontSize = "34px";
    containerElement.style.fontFamily = "Gabarito, sans-serif";
    containerElement.style.textAlign = "center";
    containerElement.style.width = "100%";
    containerElement.style.display = "flex";
    containerElement.style.justifyContent = "center";
    containerElement.style.alignItems = "center";
    containerElement.style.marginTop = "18.6%";
    containerElement.style.marginBottom = "12.1%";
})}
else if (vosVoyages.length > 0){
  document.addEventListener("DOMContentLoaded", function() {
    var containerElement = document.getElementById("titre");
    containerElement.innerHTML = "<h2>Résumé de vos commandes</h2>";
    containerElement.style.fontSize = "34px";
    containerElement.style.fontFamily = "Gabarito, sans-serif";
    containerElement.style.textAlign = "center";
    containerElement.style.textDecoration = "underline rgb(241, 237, 237)"
})}



//------------------------------------------------------

function supprimer(idVoyage) {

  delete vosVoyages[idVoyage];

  vosVoyages = vosVoyages.filter(voyage => voyage._id !== idVoyage);

  localStorage.setItem('voyages', JSON.stringify(vosVoyages));

  location.reload();

}



