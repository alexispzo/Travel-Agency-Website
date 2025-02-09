// Fichier qui va nous permettre de changer le statut du voyage

const url = window.location.search;
const urlParams = new URLSearchParams(url);
var destinationParam = urlParams.get("dest");


var voyages = JSON.parse(localStorage.getItem('voyages')) || [];

// Fonction permettant de changer le statut de la destination
function confirmation(destinationParam) {
  var voyage = voyages.find(v => v.destination === destinationParam);

  voyage.statut = "Confirmé";
    
  localStorage.setItem('voyages', JSON.stringify(voyages));
}