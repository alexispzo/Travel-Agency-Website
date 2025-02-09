/*
Ce fichier permet de gérer notre page réservation, du calcul du prix à l'utilisation du local storage pour stocker le voyage ajouté
*/

// On récupère tous les éléments HTML dont nous avons besoin
const departInput = document.getElementById('date-arrivee');
const retourInput = document.getElementById('date-retour');
const adultesInput = document.querySelector("#nombre-adultes");
const enfantsInput = document.querySelector("#nombre-enfants");
const dejeunerInput = document.getElementById("petitDejeuner");
const prixInfo = document.querySelector(".prix");
const resetButton = document.querySelector(".bouttonReinitialiser");
const container = document.querySelector(".wrapper");
const resaButton = document.querySelector(".submit-button");
const imageFin = document.querySelector(".formImage img");
const ptitDejContainer = document.querySelector(".separationPetitDejeuner");

// On recupère la destination choisie dans le lien : ../HTML/reservations.html?dest="La Destination"
const url = window.location.search;
const urlParams = new URLSearchParams(url);
const destinationParam = urlParams.get("dest");

// On recupère la date d'aujourd'hui et on la passe en minimum de nos dates
const currentDate = new Date().toISOString().split('T')[0];
departInput.min = currentDate;
retourInput.min = currentDate;

// Création de la classe qui permet de gérer le formulaire
class PriceForm {

    constructor(destination) {
        this.prixTotal = 0;
        this.nbEnfants = 0;
        this.nbAdultes = 0;
        this.nbJours = 0;
        this.dejeuner = false;
        this.destination = destination;
    }

    // Méthode permattant de calculer le prix et de l'afficher
    updatePrixTotal() {
        let prixDejeuner = 0;
        if (this.dejeuner) {
            prixDejeuner = 15;
        }
        if (this.nbJours <= 0) {
            this.prixTotal = 0
        }
        else {
            this.prixTotal = this.nbJours * (this.nbAdultes * this.destination.prixAdulte + this.nbEnfants * this.destination.prixEnfant) + this.destination.prixBillet * (this.nbAdultes + this.nbEnfants) + prixDejeuner * (this.nbAdultes + this.nbEnfants) * this.nbJours;
        }
        prixInfo.innerHTML = `<p>Prix : ${isNaN(this.prixTotal) ? 0 : this.prixTotal} €</p>`;
    }

    // Méthode permettant de réinitialiser tputes les données du formulaire
    resetForm() {
        this.prixTotal = 0;
        this.nbEnfants = 0;
        this.nbAdultes = 0;
        this.nbJours = 0;
        this.dejeuner = false;

        departInput.value = '';
        retourInput.value = '';
        adultesInput.value = 0;
        enfantsInput.value = 0;
        dejeunerInput.checked = false;

        prixInfo.innerHTML = `<p>Prix : ${this.prixTotal} €</p>`;
    }

    // Méthode permattant de de calculer le nombre de jours du voyage en fonction des dates de départ et de retour
    calculJour() {
        if (departInput.value && retourInput.value) {
            var diffEnMs = new Date(retourInput.value) - new Date(departInput.value);
            this.nbJours = diffEnMs / (1000 * 60 * 60 * 24);
        }
    }

    // Méthode permettant de réserver un voyage, le stockant dans le local storage avec toutes données nécessaires
    reserver() {
        // si le prix est de 0€, c'est à cause des dates qui sontn invalides, donc on alerte le client
        if (this.prixTotal === 0) {
            alert('Vos dates sont invalides');
            retourInput.value = '';

        }
        else {
            let voyagesExistants = JSON.parse(localStorage.getItem('voyages')) || [];

            // Si le client a déjà réservé un voyage dans une certaine destination, il ne peut pas en réserver un deuxième dans la même destiantion
            if (voyagesExistants.some(voyage => voyage.destination === this.destination.nom)) {
                alert('Vous avez déjà reservé un voyage en ' + this.destination.nom + '.');
                return; 
            }

            // Si le petit déjeuner est inclus, alors on impose this.dejeuner = true
            if (this.destination.petitDejeuner){this.dejeuner = true};

            // On crée un "dictionnaire" contenant toutes les données nécessaires pour notre panier
            let nouveauVoyage = {
                image: this.destination.image3,
                dateArrivee: departInput.value,
                dateRetour: retourInput.value,
                nombreAdultes: this.nbAdultes,
                nombreEnfants: this.nbEnfants,
                petitDejeuner: this.dejeuner,
                destination: this.destination.nom,
                prixTotal: this.prixTotal,
                lien: "conf_panier.html?dest=" + this.destination.nom,
                statut : "A confirmer"
            };
            
            // On ajoute le voyage à la liste de voyage et on le stocke dans le local Storage
            voyagesExistants.push(nouveauVoyage);

            localStorage.setItem('voyages', JSON.stringify(voyagesExistants));
        }
    }
}

/* 
Création de la classe Destination contenant les données nécessaires 
*/
class Destination {
    constructor(nom, lien, image1, image2, image3, image4, description, prixBillet, prixAdulte, prixEnfant,petitDejeuner) {
        this.nom = nom;
        this.lien = lien;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.image4 = image4;
        this.description = description;
        this.prixBillet = prixBillet;
        this.prixEnfant = prixEnfant;
        this.prixAdulte = prixAdulte;
        this.petitDejeuner = petitDejeuner;
    }
}

// Fonction asynchrone permettant de gérer l'affichage de la page
async function main() {
    // On récupère les données JSON
    const response = await fetch('../json/destination.json');
    const data = await response.json();
    const dataReservation = data[destinationParam];

    // On crée une nouvelle instance de la destination récupérée destinationParam
    const dest = new Destination(dataReservation.name, dataReservation.link, dataReservation.image1, dataReservation.image2, dataReservation.image3, dataReservation.image4, dataReservation.description, dataReservation.prixBillet, dataReservation.prixAdulte, dataReservation.prixEnfant, dataReservation.petitDejeuner);

    let clone = document.getElementById("template").content.cloneNode(true);

    nouveaucontenu = clone.firstElementChild.innerHTML
            .replace(/{{lien}}/g, dest.lien)
            .replace(/location.png/g, dest.image2)
            .replace(/voyage_60.jpg/g, dest.image3)
            .replace(/voyage.jpg/g, dest.image4)
            .replace(/{{nom}}/g, dest.nom)
            .replace(/{{descr}}/g, dest.description);

    if (dest.petitDejeuner) {
        console.log(dest.petitDejeuner);
        ptitDejContainer.innerHTML = "<p>Petit-dejeuner : Inclus</p>";
    }

    imageFin.setAttribute('src', '../images/'+dest.image1);

    clone.firstElementChild.innerHTML = nouveaucontenu;
    container.appendChild(clone);

    const priceForm = new PriceForm(dest);

    // A chaque événement sur nos input, on met à jour le prix total
    departInput.addEventListener("change", () => {
        priceForm.calculJour();
        priceForm.updatePrixTotal();
    });
    
    retourInput.addEventListener("change", () => {
        priceForm.calculJour();
        priceForm.updatePrixTotal();
    });
    
    adultesInput.addEventListener("input", () => {
        priceForm.nbAdultes = parseInt(adultesInput.value); 
        priceForm.updatePrixTotal(); 
    });
    
    enfantsInput.addEventListener("input", () => {
        priceForm.nbEnfants = parseInt(enfantsInput.value); 
        priceForm.updatePrixTotal();      
    });

    dejeunerInput.addEventListener("change", () => {
        priceForm.dejeuner = dejeunerInput.checked;
        priceForm.updatePrixTotal();
    });

    resetButton.addEventListener("click", () => {
        priceForm.resetForm();
    });

    resaButton.addEventListener("click", () => {
        priceForm.reserver();
    });

}

main();