Grupp 9
Felicia, Hannah och Julia

# Formulär Fulköpings Bokmässa: Rapport
## Vi valde att fokusera på tre tillgänglighetsrelaterade problem:
### 1. Ingen placeholder- eller hjälptexter
Etiketterna vid inputfälten ger inte tillräcklig information. Att det saknas placeholdertexter och formatkrav ökar den kognitiva belastningen, särskilt för användare som har svårt med avkodning och språkförståelse. Detta strider mot WCAG:s riktlinjer (3: Begripligt; Inmatningshjälp, Etiketter/instruktioner).
### 2. Inga felmeddelanden eller förslag på rättning
Användaren får varken felmeddelande eller förslag på rättning om ett fält lämnas tomt, om värdet inte uppfyller formatkraven eller om det står i konflikt med värdet i ett annat fält. Det kan skapa förvirring och frustration och i värsta fall hindra användaren från att slutföra formuläret. Detta uppfyller inte WCAG (3: Begriplig; Identifiering av fel, Förslag vid fel).
### 3. Låg färgkontrast
Den låga kontrasten mellan bakgrundsfärg och textfärg gör etiketterna svåra att läsa och att skilja från bakgrunden. För användare med permanent eller tillfällig synnedsättning blir texten svår eller omöjlig att läsa (WCAG 1.4: Möjlig att uppfatta; Urskiljbar, Kontrast).

## Våra ändringar
### Allmänt
**Brist:** Formuläret låg i en div med class och var därför inget riktigt formulär. 
**Åtgärd:** Vi bytte till form så att input-fälten kan valideras. 

## Header 
### Kontrast
**Brist:** H1 och H2 var svårlästa eftersom kontrasten mellan text och bakgrund var för låg. 
**Åtgärd:** Bytt textfärg till vit. Bakgrundsfärgen fick vara kvar eftersom den är en viktig del av bokmässans visuella identitet. 

### Begriplig text
**Brist:** H1 ”Fulköpings bokmässa” sa inte vad sidan handlade om. 
**Åtgärd:** Ändrat till ”Beställning av mat till Fulköpings bokmässa”, som beskriver exakt vad formuläret gäller. 
**Brist:** H2 ”Beställning av specialkost till konferens” var missvisande på två sätt: 
Formuläret gäller inte bara specialkost, eftersom man också fyller i totalt antal deltagare. 
Ordet ”konferens” är ett nytt begrepp för samma evenemang och ökar den kognitiva belastningen. 
**Åtgärd:** H2 ersatt med kontakt till kundtjänst (fulkopingbokmassa@gmail.com), så användaren direkt får veta vart hen kan vända sig för hjälp. 

## Formulär
### Inledning
**Brist:** Det fanns ingen förklaring om vad användaren skulle göra. 
**Åtgärd:** Vi lade till en kort inledande paragraf som beskriver uppgiften och hur lång tid den tar (ca två minuter). 

### Obligatoriska fält
**Brist:** En tidigare version hade asterisker vid alla fält och texten ”Fält märkta med * måste fyllas i”. Eftersom alla fält är obligatoriska var det överflödig information som ökade den kognitiva belastningen. 
**Åtgärd:** Asteriskerna och texten togs bort. Om ett fält lämnas tomt aktiveras inte skicka-knappen och användaren får ett felmeddelande. 

### Kontrast
**Brist:** Kontrasten var låg både mellan text och bakgrund och i ramarna runt input-fälten. 
**Åtgärd:** Alla labels fick svart text och fälten fick en mörkare grå ram. 

## Struktur och ordning
**Brist:** Fälten kom i en ordning som inte följde någon tydlig logik. Antalet fält fick inte ändras, men ordningen fick vi ändra. 
**Åtgärd:** Vi ordnade fälten från det allmänna till det specifika: 
1.Bokmässans datum 
2.Leveransdatum, som utgår från mässans datum 
3.Antal deltagare totalt 
4.Antal vegetariska portioner 
5.Antal veganska portioner 

## Labels
**Brist:** Ett par labels kunde tolkas på olika sätt: 
”Konferensdatum” införde ett nytt begrepp för mässan. 
”Antal deltagare” kunde läsas som antal med specialkost, eller som mässans totala antal besökare. 
**Åtgärd:** Ändrat till ”Bokmässans datum” och ”Antal deltagare totalt”, för att hjälpa användaren undvika misstag. 

## Hjälptexter
**Brist:** Inget fält hade hjälptext. 
**Åtgärd:** 
Fält 2–5 fick förklarande hjälptexter. 
Fält 3–5 fick också instruktioner om formatet. 
Fält 4–5 säger att man fyller i ”0” om inga vegetariska eller veganska portioner behövs. 

## Bekräftelse av rätt ifyllda fält
**Brist:** Användaren såg inte vilka fält som var korrekt ifyllda. 
**Åtgärd:** Ett fält med giltigt värde får en grön ram. Testpersonerna upplevde det som hjälpsamt och positivt. 

## Validering mellan fält
**Brist:** Formuläret kontrollerade inte att värdena i olika fält stämde med varandra. 
**Åtgärd:** Två regler infördes. Om de bryts får användaren ett felmeddelande med instruktioner om hur felet rättas. 
Vegetariska och veganska portioner får tillsammans inte vara fler än antalet deltagare totalt. 
Leveransen måste ske samma dag som mässan eller dagen före, aldrig tidigare och aldrig efter. 

## Regler för sifferfälten
**Brist:** Det fanns inga regler för vilka värden som var giltiga. 
**Åtgärd:** 
Alla sifferfält tar bara emot heltal. 
Fält 4–5 måste fyllas i, även när värdet är 0. 

## Skicka-knapp
**Brist:** Knappen visade inte om formuläret var redo att skickas. 
**Åtgärd:** Knappen är visuellt nedtonad tills alla fält är ifyllda. Då ändras färg och kontrast. Försöker användaren klicka när något fält saknas eller är fel visas ett felmeddelande. 

## Felmeddelanden
**Brist:** Det fanns varken felmeddelanden eller instruktioner om giltiga värden. 
**Åtgärd:** Felmeddelanden visas direkt vid: 
Fel 1: leveransdatumet ligger efter mässan eller mer än en dag före. 
Fel 2: fel format, alltså bokstäver eller decimaltal. 
Fel 3: totalt antal deltagare är mindre än vegetariska och veganska portioner tillsammans. 
Fel 4: klick på skicka-knappen innan alla fält är ifyllda. 
Placering: Felmeddelandet visas både överst i formuläret och vid det fält som ska rättas. Det felaktiga fältet får en röd ram och en förklaring i anslutning till fältet. 

## Ändringar som vi skulle velat göra men inte gjorde

### 1: Radio buttons istället för kalender för val av leveransdag, alternativt en drop down med endast två möjliga val.
#### Varför? 
För att det nu går att välja datum både bakåt i tiden och långt efter konferensdatum. Med bara två valmöjligheter minskar risken för fel och kognitiv belastning. 
#### Varför ändrade vi inte?
Uppgiften medgav inte att vi ersatte inputfält med radio buttons eller drop down. Formuläret är byggt utifrån back-end (möjligheterna att ändra koden är begränsade).

### 2: Automatisk uträkning av totalt antal deltagare istället för manuell input.
#### Varför? 
Enklare för användaren att slippa fylla i, minskar risken för fel. 
#### Varför ändrade vi inte?
Eftersom det visade sig (i möte med "beställaren") att formuläret gällde beställning av mat till alla deltagare i en grupp – inte enbart till de som skulle ha specialkost. Därmed skulle en automatisk uträkning genom summering av antal vegetariska och veganska portioner blivit fel. Med anledning av detta valde vi istället att ändra formulärets rubrik/H1 till "Beställning av mat till Fulköpings bokmässa".

### 3: Ta bort fältet ”Konferensdatum”.
#### Varför?
Bokmässan går av stapeln ett specifikt datum och pågår bara en dag. Man får anta att såväl arrangör som cateringfirma känner till detta datum. Därför är det svårt att motivera att användaren ska behöva specificera detta. Ökar risken för förvirring och misstag.
#### Varför ändrade vi inte?
Se ovan. Uppgiften krävde att vi behöll samtliga fem inputfält.
