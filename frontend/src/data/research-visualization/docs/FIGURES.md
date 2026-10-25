# Figure blueprint (1–4 hovedprioritet, 5–6 sekundært)

| Nr | Hovedspørsmål | Type og underlagsfiler | Avgørende metodekrav |
|---|---|---|---|
| 1 | Hva er de fire vurderingsmomentene? | Konseptuell fire-node modell fra `concepts` og memo-syntese | Ingen størrelses-/vektsignal fra rene funn |
| 2 | Hvordan bidrar paratekster til flere vurderingsmomenter? | Todelt nettverk / UpSet / 7×4 matrise fra `relations` og `original_matrix` | Samme adapter; brytere for tiers og matrise-status; forskjell direkte/analytisk |
| 3 | Hvilke likheter og variasjoner finnes hos A–E? | Kvalitativ sammenligningsmatrise fra `stances` og `comparison_matrix` | Ikke kodet != uenig, fremhev kontekst/negative case |
| 4 | Hvordan kan kontakt lede til ulik vurdering/omtale? | Forgrenet modell fra `process_model` | Alternativer/returmuligheter; ingen universell sekvens eller sannsynligheter |
| 5 | Hva kan leses før prøvespilling? | Søkbar–erfaringsbasert forbindelsesmodell `concepts`, relevante `relations` | Observerbare signaler kan antyde, ikke bevise, erfaring |
| 6 | Hva betyr funnene for Cosmic Anchor? | Sporbarhetsmatrise `design_traceability` | Faktiske designvalg er null, ikke funnet i kilder |

## 1: Fire moment
Sentralt diagram og kort definisjon per moment: formidlingsrammer, prosjektgrunnlag, utviklergrunnlag, pressemateriale. Figuren skal kommunisere konseptuelt fellesskap og delvise overlapp uten å implisere at den ene dimensjonen er statistisk dominerende. Bruk fire noder/områder, ikke nødvendigvis fire gjennomgående overlappende sirkler.

## 2: Samme data, tre uttrykk
Ta de 7 opprinnelige matriseradene og de 4 vurderingsmomentene. Kjør alle aktive `relations` og ta med den delmengden som har `source_id` i P-radene og `target_id` i M-momentene. Grupper på paret. Nettverk viser `source -> target`; UpSet beregner setsammensetning for hver av de 7 radene; matrise krysser hver rad og kolonne. Originalmatrisens `none`-celler vises som tomme (ikke umulige). Vær tydelig på at tilleggssignalene S_* ikke nødvendigvis er paratekster og derfor ikke er del av 7×4-kjernen.

## 3: Variation
La en celle vise vedlagte posisjoner og en «vis kilder»-handling. For informant med flere ulike uttalelser må motsetning kunne være synlig. Vis `status=not_coded_in_this_comparison` som «Ikke klassifisert i denne matrisen», ikke «Informanten nevner ikke dette». Ikke utled poengskår. Legg til kildelinser med gjennomført telling merket «kodebokoppføringer».

## 4: Ikke-lineær prosess
Stadier er ikke universelle terskler. La brukeren se alternative spor som første kontakt -> relevans -> prosjekt/utvikler -> materiale -> mulig omtale, men også offentlig oppdagelse, vente, avslutte, alternativ kanal og retur for mer informasjon. `process_model.json` er analytisk-only. Bruk ikke en enkel Sankey-flyt med mengder, siden ingen kvantitative overgangstall foreligger.

## 5: Søkbar / erfaring
Eksempler fra kapittel 5: sjanger, tittel, stil, tone og miljø er lettere å vurdere før spill; spillfølelse, kompleksitet og responsivitet er vanskelige uten erfaring. Paratekster, særlig trailer, kan gi observerbare indirekte tegn. Bruk begrepene som analytisk illustrasjon, ikke som målt fordeling.

## 6: Cosmic Anchor
Kun konseptuelle designimplikasjoner er foreslått. Datamodellens faktiske designbeslutningsfelt er bevisst null til bruker dokumenterer valg. Da kan evidenskjeden bli kodebok -> memo -> funn -> foreslått implikasjon -> faktisk designvalg (verifisert i caset).
