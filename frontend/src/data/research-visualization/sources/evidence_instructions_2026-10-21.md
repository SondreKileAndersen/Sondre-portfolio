Oppgave til Codex: oppdater evidensinnhold i infoboksene
Bruk infobokser_evidens.json som kurert datakilde for alle 28 kryss mellom fire vurderingsmomenter og syv paratekster. Ikke koble koder til celler gjennom strenglikhet i kategorinavn. Privat kommunikasjon, Direkte kommunikasjon og Direkte kontakt (e-post) beskriver samme relevante kategori, men en kode skal likevel bare vises som primær hvis innholdet gjelder den aktuelle kombinasjonen. aliases er kun for begrepsnormalisering.
Datakontrakt
Hver post i cells har:
- id: stabil celle-ID på formen vurderingsmoment__paratekst (bruk denne til oppslag, ikke tabellposisjon).
- classification: clear = tydelig begrunnet; indirect = indirekte/betinget; none = ingen tilstrekkelig begrunnet forbindelse.
- primaryCodes: kildeparafraser med nær/direkte relevans til cellen. Hvert element har codeId, informant, text, evidenceRole.
- contextCodes: beslektede koder som støtter tolkningen, men ikke automatisk beviser den spesifikke forbindelsen.
- uniquePrimaryInformants: unike A–E-informanter fra primaryCodes; behold Z utenfor tallet.
- caseSection: hvor i masterens praksiskapittel forbindelsen drøftes.
- interpretiveWarning: vis som «Avgrensning/merknad»; må ikke skjules hvis den endrer hva punktet kan bety.
Visningen
1. Vis overskrift «{paratekst} → {vurderingsmoment}: {klassifikasjon}».
2. Vis «Direkte/nært relevante koder fra B5: N (M ulike spillformidlere)». N er antall primærkoder; M er antall unike A–E, ikke antall koder. Ikke kall dette «dokumenterte primærinformanter» uten å forklare at koder er forskerens parafraser.
3. Vis primærkodene etter informant A–E og deretter Z i eget avsnitt. Ingen av kodene er ordrette sitater. Skriv «Kodebokens parafrase» og oppgi kode-ID. Ikke konstruer direkte sitater.
4. Vis contextCodes separat under «Supplerende/kontekstuelle koder», gjerne sammenfoldet. De skal IKKE telles som cellespesifikk direkte dokumentasjon.
5. Vis caseSection og interpretiveWarning under «Praktisk analyse / avgrensning». For clear med tom primaryCodes må det stå «Ingen informantkode i B5 omtaler akkurat denne parateksten direkte. Klassifikasjonen bygger på fortolkning og det praktiske caset», ikke «Ingen dokumentasjon» og ikke et oppfunnet antall.
6. For classification=none: ikke vis en fylt sirkel og helst ingen interaktiv infoboks (alternativt vis hvorfor forbindelsen ikke er markert). Ikke gi nullkoder status som positiv empirisk støtte.
7. Vis Z som «Ekspertinformant Z – supplerende perspektiv», aldri som sjette spillformidler.
8. Ikke bruk farge, sirkelstørrelse, antall koder eller antall informanter som en måling av forbindelsens styrke. Kodeantall er ikke effektstørrelser.
9. Innholdet i text er hentet fra B5 og normalisert for linjeskift; stavemåte beholdes i hovedsak. Hvis originalkoden inneholdt en drøftingsparentes, presenteres denne kun med advarsel, ikke som et utsagn fra informanten.
10. Flere koder kan støtte flere ulike forbindelser. Dedupliser innenfor en celle, men ikke globalt.
Viktige manuelt kvalitetssikrede eksempler
- formidlingsrammer__epost: B5 inneholder langt mer enn bare E sin «10 sekunder» og C sin feil målretting. Ta med koder om feil adressat, masseutsendelser, mottakertilpasning og E sin motvekt om at personlig tilpasning ikke betyr noe for alle. Se også Memo 3.
- prosjektgrunnlag__trailer: A og D beskriver trailer som vurderingskilde; B omtaler trailerbasert nyhet/omtale; C foretrekker video. Ikke bland generelle visuelle vurderinger ukritisk med eksplisitte trailerkoder. Se Memo 4.
- formidlingsrammer__steam: Det finnes ikke et eget kodet sitat «Steam brukes til formidlingsrammer». E beskriver at en relevant sjanger kan føre til videre Steam-sjekk, og D undersøker skjermbilder, beskrivelse og dato. En tydelig forbindelse her bygger på disse kodene og caseanalysen 6.2.2. Ikke vis «0 koder» når relevante eksisterer, men ikke gi dem sterkere semantikk enn kildene gir.
- prosjektgrunnlag__project_site: ingen egen intervjukode for prosjektnettsiden. Funksjonen er tydelig utformet og analysert i 6.2.2. Vis dette som casestøtte, ikke som direkte intervjuuttalelse.
- utviklergrunnlag__activity: svært mange direkte relevante koder om aktivitet/Discord/roadmap/Steam-diskusjoner fra B–E. Men det faktiske caset har foreløpig begrenset synlig aktivitet.
- pressemateriale__presskit: mange ulike informanter og koder om grafikk, faktaark, tilrettelegging og gjenbruk. E bruker selv press kits sjelden, og dette er et viktig negativt/nyanserende funn.
Kjente kildeproblemer
I B5-PDF er noen avsluttende hakeparenteser mangelfulle, blant annet etter E om Kickstarter/itch.io, og etter A om vurderingskriterier, slik at ren regex slår sammen to koder. Datafilen skiller disse to igjen. Det finnes også gjentatte eller nærdupliserte utsagn under flere kodekategorier. Hvis applikasjonen importerer original-PDF på nytt, må parseren håndtere dette i stedet for å bare bruke en naiv \[...\]-regex.
Kildehierarki
1. B5 s. 97–106: kodebok med informantparafraser.
2. B5 s. 107–116: memoer og synteser – tolkninger, ikke nye uavhengige intervjusitater.
3. Hovedmaster kapittel 5–6: fortolkning og konkret case-utforming.
4. Teori og eksterne bransjekilder: kan begrunne casevalg, men må ikke utgis for empiriske intervjufunn.
Vær oppmerksom på at bare de opprinnelige transkripsjonene kan avklare om en parafrase fullt ut gjengir hva informanten sa. Dette er evidenskartlegging av den vedlagte kodeboken, ikke en ny primæranalyse av transkripsjoner.