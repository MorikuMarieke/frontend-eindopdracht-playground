Notities, logging, dit later verwerken in verantwoordingsdocument:

- Wat zijn de limieten van de Spotify API in samenwerking met backend, kan ik gebruik maken van de novi backend met EN
  zonder spotify API.
- Ik moet mijn eigen account hebben om calls te kunnen maken.
- de novi backend kan maximaal 10.000 karakters hebben.

Your X-Api-Key: playground:kpTCrF45XuuluvvATUSC

Add the following to the header of your POST USER request:

Headers: {
'Content-Type': 'application/json',
'X-Api-Key':playground:kpTCrF45XuuluvvATUSC
}

--> Dit is nodig om post requests te kunnen maken die geen registratie van gebruiker zijn.

Stap 1. Sign Out functie maken [done]

Stap 2. Andere user functionaliteiten
~~- Hoe kan ik gebruiker verwijderen? --> Kan niet?~~

- User data aanpassen (username, e-mail, password)
    - Hier een begin aan gemaakt, conditional rendering gemaakt voor de account details card.
    - Het doorgeven van de data lijkt nog niet goed te gaan, hier krijg ik errors,mogelijk kan dit komen omdat je alle
      velden moet meegeven, maar dit is voor mij nog niet duidelijk hoe dit precies zit. Misschien kan ik dit morgen aan
      Nova of Sam vragen. Voor nu lijkt de put request forbidden 403. [done]
- Automatische e-mail instellen, gaat dat makkelijk? Dit uitzoeken.

Stap 3. Genre is niet mogelijk, welke nieuwe functionaliteit ga ik gebruiken met de spotify api?

1. Gekozen categorieën weergeven + verwijderen

2. Zoeken naar playlists:

    - playlist zoeken op basis van algemene search input, kan gelinkt worden aan description van playlist, dan een weergave van naam en description en doorlinken naar pagina waar je de playlist kunt afspelen, mogelijk maken om deze songs toe te voegen aan een eigen playlist (dat moet ik nog uitzoeken hoe het moet, maar dit komt veel later, andere feature) -> **DEZE EERST**
    - playlists op basis van genre met de lijst die ik van github heb.
    - Playlists op basis van categorie weergeven, **ik denk dat ik deze niet ga gebruiken**.

2. Artiest zoeken op basis van naam invoer, informatie weergeven, link naar pagina met muziek, of dit in component
   verwerken dat je artist info weergeeft met de eerste 5 populaire tracks van deze artiest. Of doorlinken naar een
   andere pagina met meer info.

3.

Stap 4. Music player component maken. Zo schrijven dat het een variabele ID verwacht en te gebruiken is met map methode.

Stap 5. Mogelijk maken om tracks toe te voegen aan een eigen gemaakte playlist voor ingelogde gebruikers.

Stap ?. Spotify user data koppelen

IMPLEMENTATIE STRATEGIE VOOR CATEGORIEËN EN GENRE ELEMENTEN

1. localstorage uitlezen op mount (categorieën aanwezig? Dan volgende stap, niet aanwezig? Dan klik hier om categorieën
   te selecteren)
2. categorieën in de state zetten als array
3. mappen -> categorie-elementen weergeven op de pagina (op basis van state)
    4. -> als je op 1 element klikt moet je die uit de state array verwijderen
    5. -> daarna nieuwe array in local storage

- Eerst implementeren wat mogelijk is, dus favoriete artiest invoeren en daar muziek van luisteren, favoriete artiest en
  dan recommendations op basis daarvan. 

