
Notities, logging, dit later verwerken in verantwoordingsdocument: 
- Wat zijn de limieten van de Spotify API in samenwerking met backend, kan ik gebruik maken van de novi backend met EN zonder spotify API. 
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
- Hoe kan ik gebruiker verwijderen?
- User data aanpassen (username, e-mail, password)
- Automatische e-mail instellen, gaat dat makkelijk? Dit uitzoeken.

Stap 3. Genre is niet mogelijk, welke nieuwe functionaliteit ga ik gebruiken met de spotify api?
- Muziek opzoeken op basis van artiest, nummer, categorie. Goed API nakijken wat mogelijk is.
- Eerst implementeren wat mogelijk is, dus favoriete artiest invoeren en daar muziek van luisteren, favoriete artiest en dan recommendations op basis daarvan. 

Stap ?. Spotify user data koppelen


