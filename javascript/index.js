// Récupération du conteneur et du template, que l'on utilisera plus tard afin de remplacer les données en fonction des destinations
const container = document.querySelector(".pays");
let tmp = document.getElementById("template");
const apiKey = '4e6866554ca9c394005e4494ba808519';




// Création de la classe Destination pour représenter les objets de destination
class Destination {
    constructor(name, link, image, description, price, animaux, petitDejeuner) {
        this._name = name;
        this._link = link;
        this._image = image;
        this._description = description;
        this._price = price;
        this._animaux = animaux;
        this._petitDejeuner = petitDejeuner;
    }
}

// Fonction pour obtenir les températures des destinations données en utilisant l'API OpenWeatherMap
async function obtenirTemperatures(destinations) {
    const temperatures = [];

    for (const d of destinations) {
        const pays = d._name;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${pays}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const temperature = data.main.temp + " °C";
            temperatures.push(temperature);
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${pays}:`, error);
            temperatures.push(null);
        }
    }

    return temperatures;
}

// Fonction principale qui affiche les destinations au lancement de la page
async function main() {
    // On recupère le json avec fetch
    const response = await fetch('../json/destination.json');
    const data = await response.json();

    // Création d'un tableau d'objets Destination à partir des données JSON
    const tabdestination = Object.values(data).map(destination => new Destination(
        destination.name,
        destination.link,
        destination.image1,
        destination.descriptionPrix,
        destination.price
    ));

    // Appel de la fonction obtenirTemperatures pour récupérer les températures des destinations
    const temperatures = await obtenirTemperatures(tabdestination);

    // On remplace les balises HTML avec les données du tableau 
    for (const [index, d] of tabdestination.entries()) {
        let clone = document.importNode(tmp.content, true);

        const nouveaucontenu = clone.firstElementChild.innerHTML
            .replace(/{{lien}}/g, d._link)
            .replace(/greece1.avif/g, d._image)
            .replace(/{{nom}}/g, d._name)
            .replace(/{{description}}/g, d._description)
            .replace(/{{temperature}}/g, temperatures[index]);

        clone.firstElementChild.innerHTML = nouveaucontenu;
        container.appendChild(clone);
    }
}

// Appel de la fonction principale
main();

// Fonction pour filtrer les destinations en fonction des critères spécifiés
async function filtrer() {
    // Récupération des données de destination depuis le fichier JSON
    const response = await fetch('../json/destination.json');
    const data = await response.json();

    // Création d'un tableau d'objets Destination à partir des données JSON
    const tabdestination = Object.values(data).map(destination => new Destination(
        destination.name,
        destination.link,
        destination.image1,
        destination.descriptionPrix,
        destination.price,
        destination.animaux,
        destination.petitDejeuner
    ));

    // Récupération des valeurs des filtres
    const prixMin = parseFloat(document.getElementById("filtrePrixMin").value) || 0;
    const prixMax = parseFloat(document.getElementById("filtrePrixMax").value) || Infinity;
    const animaux = document.getElementById("filtreAnimaux").checked;
    const petitDejeuner = document.getElementById("filtreDejeuner").checked;

    // On crée un nouveau fragment dans lequel on affichera seulement les destinations qui correspondent au filtre
    const containerFragment = document.createDocumentFragment();
    let destinationsAjoutées = false;

    // Appel de la fonction obtenirTemperatures pour récupérer les températures des destinations
    const temperatures = await obtenirTemperatures(tabdestination);

    // Filtrage des destinations en fonction des critères spécifiés
    for (const [index, d] of tabdestination.entries()) {
        if (
            d._price >= prixMin &&
            d._price <= prixMax &&
            (!animaux || d._animaux) &&
            (!petitDejeuner || d._petitDejeuner)
        ) {
            // Clonage du modèle et remplacement des balises avec les données de destination
            let clone = document.importNode(tmp.content, true);
            const nouveaucontenu = clone.firstElementChild.innerHTML
                .replace(/{{lien}}/g, d._link)
                .replace(/greece1.avif/g, d._image)
                .replace(/{{nom}}/g, d._name)
                .replace(/{{prix}}/g, d._price)
                .replace(/{{description}}/g, d._description)
                .replace(/{{temperature}}/g, temperatures[index] !== null ? temperatures[index] : 'Non disponible');

            // Ajout du clone au fragment de document
            clone.firstElementChild.innerHTML = nouveaucontenu;
            containerFragment.appendChild(clone);
            destinationsAjoutées = true;
        }
    }

    // On efface toutes les destinations affichées et on rajoute le fragment composé des destinations correspondantes au filtre
    container.innerHTML = '';
    container.appendChild(containerFragment);

    // Affichage d'un message si aucune destination n'a été trouvée
    if (!destinationsAjoutées) {
        const noDestinationsMessage = document.createElement('p');
        noDestinationsMessage.textContent = 'Aucune destination trouvée.';
        container.appendChild(noDestinationsMessage);
        container.style.fontSize = '30px';
    }
}



