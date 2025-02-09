// Ce fichier permet d'afficher le header et le footer grâce à jQuery. On a veillé à relier chaque page à ce fichier.

$(document).ready(function(){
    $("#headerContainer").load("../html/header.html"); 
    $("#footerContainer").load("../html/footer.html");
 });