import profileImage from '../../media/hjem/Sondre_Caps.jpg'
import assetTigerImage from '../../media/ressurskoordinering/Asset-Tiger.jpg'
import blackMagicImage from '../../media/ressurskoordinering/Black Magic.jpg'
import lagerOneImage from '../../media/ressurskoordinering/Lager 1.jpg'
import lagerTwoImage from '../../media/ressurskoordinering/Lager 2.jpg'
import lagerThreeImage from '../../media/ressurskoordinering/Lager 3.jpg'
import studioImage from '../../media/ressurskoordinering/Lydstudio.jpg'
import unitFourLogo from '../../media/ressurskoordinering/Unit_4_logo.jpg'
import yamahaMixerGuide from '../../media/ressurskoordinering/YAMAHA Lydmikser tilkoblet OBS.png'
import f21Logo from '../../media/pedagogikk/F21.png'
import f21StudioImage from '../../media/pedagogikk/F21 Studio.webp'
import kubenImage from '../../media/pedagogikk/Kuben vgs.jpg'
import oslometImage from '../../media/pedagogikk/oslomet-storbyuniversitetet.webp'
import exhibitionOneImage from '../../media/pedagogikk/Utstilling 1.jpg'
import exhibitionTwoImage from '../../media/pedagogikk/Utstilling 2.jpg'
import exhibitionFiveImage from '../../media/pedagogikk/Utstilling 5.jpg'
import exhibition2025OneImage from '../../media/pedagogikk/Utstilling 2025 1.jpg'
import exhibition2025TwoImage from '../../media/pedagogikk/Utstilling 2025 2.jpg'
import type { PortfolioPage } from '../../types/page'
import {
  teachingResourceCategories,
  teachingResources,
} from '../teachingResources/no'

const titlePage = (
  id: string,
  slug: string,
  navTitle: string,
  path: string,
  parentId?: string,
): PortfolioPage => ({
  id,
  slug,
  path,
  navTitle,
  title: navTitle,
  parentId,
  sections: [{ id: `${id}-title`, type: 'title', heading: navTitle }],
})

export const norwegianPages: PortfolioPage[] = [
  {
    id: 'home',
    slug: 'hjem',
    path: '/',
    navTitle: 'Hjem',
    title: 'Sondre Kile Andersen',
    showInNav: false,
    sections: [
      {
        id: 'home-hero',
        type: 'hero',
        heading: 'Hei, mitt navn er Sondre Kile Andersen',
        imageSrc: profileImage,
        imageAlt: 'Sondre Kile Andersen',
        paragraphs: [
          'Jeg er Sondre, og jeg drives av to ting: å hjelpe andre og å skape noe som faktisk fungerer. Det viktigste for meg er å lage struktur og løsninger som gir folk oversikt, mestring og motivasjon til å gjøre arbeidet sitt bedre.',
          'Jeg jobber ved å organisere kaos, forbedre systemer og utvikle praktiske og kreative løsninger. Det jeg liker best, er å gi andre verktøy de kan bruke videre — tekniske, sosiale eller bare et nytt perspektiv som gjør komplekse utfordringer tydeligere og mer håndterbare.',
        ],
      },
    ],
  },
  titlePage('about', 'om-meg', 'Om meg', '/om-meg'),
  titlePage('development', 'utvikling', 'Utvikling', '/utvikling'),
  {
    id: 'pedagogy',
    slug: 'pedagogikk',
    path: '/pedagogikk',
    navTitle: 'Pedagogikk',
    title: 'Læring som gir noe å bygge videre på',
    sections: [
      {
        id: 'pedagogy-title',
        type: 'title',
        heading: 'Læring som gir noe å bygge videre på',
      },
      {
        id: 'pedagogy-intro',
        type: 'split',
        paragraphs: [
          'Jeg har undervist både på videregående skole og i høyere utdanning. Det viktigste for meg er ikke bare hva elevene og studentene lærer i selve undervisningen, men hva de er i stand til å gjøre videre på egen hånd.',
          'Jeg er særlig opptatt av det første møtet med nye verktøy og fagområder. Det er ofte her man kan miste noen. Derfor prøver jeg å gjøre den første terskelen overkommelig, bygge mestring tidlig og skape en tydelig vei videre.',
          'Målet er at læringen skal få en virkning også etter at undervisningen er avsluttet.',
        ],
        imageSrc: f21StudioImage,
        imageAlt: 'Elev arbeider med kamera under en produksjon i TV-studio',
        caption: 'Praktisk undervisning i medieproduksjon, der elever lærer gjennom å planlegge, produsere og samarbeide.',
        imagePosition: 'right',
      },
      {
        id: 'teaching-experience',
        type: 'text',
        heading: 'Undervisningserfaring',
        paragraphs: [
          'Fra 2022 til 2024 underviste jeg på videregående skole innen informasjonsteknologi og medieproduksjon på Vg1 og Vg2. Jeg startet som faglærer, ble senere kontaktlærer på Vg1 og var deretter kontaktlærer på Vg2.',
          'Fra starten av 2025 til tidlig 2026 underviste jeg i høyere utdanning. Der hadde jeg et vesentlig ansvar for emnene Interaktivitet og design og Kommunikasjon i digitale medier, og underviste også i blant annet medieuttrykk, historiefortelling, digitale verktøy og digitale bilder.',
          'Mine viktigste fagområder er:',
        ],
        items: [
          'grafisk design',
          'interaksjonsdesign',
          'videoredigering',
          'lydproduksjon',
          'Adobe-programmene og Figma',
        ],
      },
      {
        id: 'teaching-institutions',
        type: 'cardGrid',
        cards: [
          {
            id: 'fyrstikkalleen-school',
            title: 'Fyrstikkalleen skole',
            text: 'Undervisning i informasjonsteknologi og medieproduksjon.',
            imageSrc: f21Logo,
            imageAlt: 'Logo for Fyrstikkalleen skole',
          },
          {
            id: 'kuben-school',
            title: 'Kuben videregående skole',
            text: 'Fag- og kontaktlærer på Vg1 og Vg2.',
            imageSrc: kubenImage,
            imageAlt: 'Kuben videregående skole',
          },
          {
            id: 'oslomet',
            title: 'OsloMet',
            text: 'Undervisningsansvar, workshops og utvikling av læringsressurser i høyere utdanning.',
            imageSrc: oslometImage,
            imageAlt: 'Logo for OsloMet – storbyuniversitetet',
          },
        ],
      },
      {
        id: 'mastery-through-structure',
        type: 'text',
        heading: 'Mestring gjennom tydelig struktur',
        paragraphs: [
          'Når jeg introduserer et nytt tema, vurderer jeg om elevene først trenger å forstå helheten eller de enkelte detaljene. Målet er å gi dem nok oversikt til å forstå hvorfor de gjør noe, samtidig som progresjonen er konkret nok til at de kan følge den steg for steg.',
          'I større grupper bruker jeg læringspartnere og ressurser som gjør det mulig å arbeide mer selvstendig. Det gjør at jeg kan bruke mer tid på dem som trenger mest veiledning, uten at de som ønsker å gå videre på egen hånd, må vente.',
          'Veiledningen handler ikke bare om sluttproduktet. Jeg er opptatt av arbeidsprosessen, valgene som er gjort, og hvordan arbeidet kan utvikles videre.',
        ],
      },
      {
        id: 'from-exercise-to-product',
        type: 'gallery',
        heading: 'Fra øvelse til et faktisk produkt',
        paragraphs: [
          'Jeg prøver å lage oppgaver som ligner reelle arbeidsprosesser, og som resulterer i noe eleven eller studenten kan bruke videre.',
          'I et undervisningsforløp med Photoshop, Illustrator og InDesign utviklet studentene blant annet omslag til bøker, CD-er og kassetter. De måtte arbeide med idé, design, typografi og bildebehandling, før produktet ble klargjort for trykk og produsert fysisk.',
          'I andre oppgaver har studentene utviklet prototyper og reklamekampanjer for eksisterende virksomheter. De har måttet forholde seg til en reell visuell profil, målgruppe og avsender, og i enkelte tilfeller kontakte virksomheten de arbeidet med.',
          'Når arbeidet skal møte noen utenfor klasserommet, blir både valgene og læringen mer konkrete.',
        ],
        galleryPosition: 'right',
        images: [
          {
            id: 'exhibition-main',
            src: exhibitionTwoImage,
            alt: 'Utstilling med fysiske bok-, CD- og kassettomslag utviklet av studenter',
            caption: 'Utstilling av fysiske produkter utviklet gjennom et undervisningsforløp i grafisk design og klargjøring til trykk.',
          },
          {
            id: 'exhibition-covers',
            src: exhibitionOneImage,
            alt: 'Bok-, CD- og kassettomslag utviklet av studenter',
            caption: 'Bok-, CD- og kassettomslag utviklet av studentene.',
          },
          {
            id: 'exhibition-identity',
            src: exhibitionFiveImage,
            alt: 'Studentarbeider med omslagsdesign og visuell identitet',
            caption: 'Eksempler på omslagsdesign og visuell identitet.',
          },
          {
            id: 'exhibition-books-2025',
            src: exhibition2025OneImage,
            alt: 'Ferdige bokprodukter fra undervisningsforløp i 2025',
            caption: 'Ferdige bokprodukter fra et senere undervisningsforløp.',
          },
          {
            id: 'exhibition-variety-2025',
            src: exhibition2025TwoImage,
            alt: 'Studentarbeider med variasjon i uttrykk, målgruppe og sjanger',
            caption: 'Variasjon i uttrykk, målgruppe og sjanger.',
          },
        ],
      },
      {
        id: 'arts-method',
        type: 'process',
        heading: 'ARTS-metoden',
        paragraphs: [
          'Jeg har utviklet en egen læringsmetode for medieproduksjon kalt ARTS: Analyze → Reconstruct → Tweak → Sculpt.',
          'Metoden starter med at man analyserer et eksisterende arbeid og forsøker å forstå hvordan det er bygget opp. Deretter rekonstruerer man det, gjør egne tilpasninger og bruker erfaringene til å skape et mer selvstendig produkt.',
          'Metoden kan brukes til å lære et nytt verktøy, utvikle tekniske ferdigheter eller bygge opp en bedre forståelse for visuell og teknisk kvalitet.',
          'En viktig del av ARTS er at kreativitet ikke trenger å være utgangspunktet. Man kan starte med noe konkret, oppleve mestring og gradvis utvikle sitt eget uttrykk.',
        ],
        steps: [
          {
            id: 'analyze',
            label: 'Analyze',
            description: 'Undersøk hvordan et eksisterende uttrykk er bygget opp.',
          },
          {
            id: 'reconstruct',
            label: 'Reconstruct',
            description: 'Gjenskap det for å forstå verktøyene og arbeidsprosessen.',
          },
          {
            id: 'tweak',
            label: 'Tweak',
            description: 'Endre form, innhold eller uttrykk.',
          },
          {
            id: 'sculpt',
            label: 'Sculpt',
            description: 'Bruk erfaringene til å utvikle et selvstendig produkt.',
          },
        ],
      },
      {
        id: 'reusable-learning-resources',
        type: 'text',
        heading: 'Læringsressurser som kan brukes videre',
        paragraphs: [
          'Jeg har utviklet hele undervisningsforløp, årsplaner og strukturer for emner. Dette inkluderer oppgaver, vurderingskriterier, presentasjoner, videoundervisning, maler og øvelsesfiler.',
          'Jeg er opptatt av å dele læringsressurser, slik at de kan justeres og brukes videre av andre. Dette har vært særlig viktig når jeg har undervist kommende yrkesfaglærere. Da skal ressursene både lære dem medieproduksjon og kunne fungere som et utgangspunkt for deres egen undervisning senere.',
          'Jeg har også brukt flipped classroom og utviklet norskspråklige videoressurser i blant annet Premiere Pro og fargekorrigering. Det gjør at studentene kan repetere innholdet i sitt eget tempo, mens tiden sammen kan brukes til produksjon, spørsmål og veiledning.',
        ],
      },
      {
        id: 'purpose-of-learning',
        type: 'text',
        heading: 'Det jeg ønsker at læringen skal føre til',
        paragraphs: [
          'For meg er det viktig at læring fører til at noen faktisk kan skape noe selv.',
          'Det konkrete produktet gir en synlig opplevelse av mestring, men fungerer også som et utgangspunkt for videre arbeid. Det kan bli en del av en portefølje, brukes i en ny arbeidssituasjon eller utvikles videre i en annen undervisningssammenheng.',
          'God undervisning avsluttes ikke nødvendigvis når undervisningstimen er over. Den fortsetter gjennom det elevene og studentene er i stand til å gjøre videre.',
        ],
      },
      {
        id: 'premiere-color-grading-playlist',
        type: 'youtubePlaylist',
        heading: 'Videoundervisning',
        introduction:
          'En spilleliste med norskspråklige videoer om fargekorrigering i Premiere Pro. Se den første videoen her, eller åpne enkeltvideoer og hele spillelisten på YouTube.',
        playlistId: 'PLVcoQA4TE8eg',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLVcoQA4TE8eg',
        iframeTitle: 'Fargekorrigering i Premiere Pro – YouTube-spilleliste',
        firstVideoId: 'YVWBBgC9sBE',
        firstVideoTitle: 'Fargekorrigering i Premiere Pro',
        listHeading: 'Flere videoer',
        videoLabel: 'Video',
        thumbnailAltPrefix: 'Miniatyrbilde for video',
        openPlaylistLabel: 'Åpne hele spillelisten på YouTube',
      },
      {
        id: 'teaching-resources-library',
        type: 'teachingResources',
        heading: 'Undervisningsopplegg',
        introduction:
          'Opplegg, presentasjoner, videoer og andre læringsressurser organisert etter fagområde.',
        categories: teachingResourceCategories,
        resources: teachingResources,
      },
    ],
  },
  {
    id: 'resource-coordination',
    slug: 'ressurskoordinering',
    path: '/ressurskoordinering',
    navTitle: 'Ressurskoordinering',
    title: 'Systemer som gjør hverdagen enklere',
    sections: [
      {
        id: 'resource-coordination-title',
        type: 'title',
        heading: 'Systemer som gjør hverdagen enklere',
      },
      {
        id: 'resource-coordination-intro',
        type: 'text',
        heading: 'Ressurskoordinering, driftsstøtte og pedagogisk tilrettelegging',
        paragraphs: [
          'Jeg trives best med oppgaver der tekniske, praktiske og menneskelige behov må fungere sammen. Arbeidet mitt har ofte handlet om å forstå hvordan en løsning faktisk skal brukes i en travel hverdag, og deretter redusere friksjon gjennom bedre utstyr, tydeligere rutiner og mer gjennomtenkte systemer.',
        ],
      },
      {
        id: 'teaching-studio',
        type: 'gallery',
        heading: 'Lydstudio tilrettelagt for undervisning',
        paragraphs: [
          'På Kuben videregående skole planla og rigget jeg et kombinert lyd- og podkaststudio i forbindelse med utvidelsen av medieproduksjon på Vg2.',
          'Målet var ikke bare å bygge et teknisk godt studio, men å gjøre det enkelt nok til at elever og lærere kunne ta det i bruk uten unødvendige hindringer. Valg av lydkort, PC, høyttalere, mikrofoner, ruting og lytting ble derfor vurdert ut fra både kvalitet og pedagogisk bruk.',
          'Jeg koordinerte arbeidet med lærere, elektriker, drift og ledelse, blant annet rundt strøm, lyddemping og støyreduksjon. Rommet ble også planlagt slik at det senere kunne brukes til flere typer produksjon, som podkast, lydarbeid og filming.',
        ],
        galleryPosition: 'left',
        images: [
          {
            id: 'teaching-studio-overview',
            src: studioImage,
            alt: 'Lyd- og podkaststudio med arbeidsstasjon og mikrofonbord',
            caption: 'Lyd- og podkaststudio planlagt som en mest mulig plug-and-play-løsning for undervisning på Vg2.',
          },
          {
            id: 'yamaha-mixer-guide',
            src: yamahaMixerGuide,
            alt: 'Visuell veiledning for tilkobling og bruk av Yamaha MG12XU lydmikser med OBS',
            caption: 'En visuell brukerveiledning gjorde det enklere å koble Yamaha-mikseren til OBS og kontrollere lydsignalet.',
            imageFit: 'contain',
          },
        ],
      },
      {
        id: 'equipment-loan-gallery',
        type: 'gallery',
        heading: 'Et utlånssystem bygget rundt arbeidshverdagen',
        paragraphs: [
          'Da jeg startet arbeidet med utstyrsutlån, ble mye registrert manuelt i Excel eller på papir. Som tidligere lærer på avdelingen kjente jeg allerede utfordringene: Utlån måtte kunne gjennomføres raskt, samtidig som skolen trengte oversikt, sporbarhet og forsvarlig behandling av elevinformasjon.',
          'Jeg kartla behovene, prøvde ut ulike løsninger og valgte AssetTiger. Deretter gjennomførte jeg inventar, kategoriserte utstyret, laget strekkoder og etablerte en egen utlånsstasjon. Jeg tilpasset også deler av arbeidsflyten i nettleseren for å redusere antall steg lærerne måtte gjennomføre.',
          'Systemet ble brukertestet og justert med ett hovedmål: Utlån skulle ta så kort tid som mulig, uten at det gikk på bekostning av kontroll eller etterprøvbarhet.',
        ],
        galleryPosition: 'right',
        images: [
          {
            id: 'storage-overview',
            src: lagerThreeImage,
            alt: 'Oversikt over organisert utstyrslager med hyller',
            caption: 'Lageret ble organisert for å gi rask oversikt og gjøre det enklere å finne, levere ut og sette tilbake utstyr.',
          },
          {
            id: 'labelled-camera-bags',
            src: lagerTwoImage,
            alt: 'Merkede kameravesker organisert på hyller',
            caption: 'Utstyret ble kategorisert og merket slik at status og plassering var lett å forstå i en travel arbeidshverdag.',
          },
          {
            id: 'loan-station',
            src: lagerOneImage,
            alt: 'Fysisk utlånsstasjon med AssetTiger og strekkodeskanner',
            caption: 'En egen utlånsstasjon samlet registrering, strekkodeskanning og administrasjon på ett sted.',
          },
        ],
      },
      {
        id: 'asset-tiger-workflow',
        type: 'split',
        heading: 'Arbeidsflyt og sporbarhet',
        paragraphs: [
          'Arbeidet omfattet også rutiner for personvern, administrasjon og framtidig overtakelse. Kategoriseringen ble lagt opp slik at systemet senere kunne utvides med blant annet bookingfunksjoner dersom avdelingen fikk behov for det.',
        ],
        imageSrc: assetTigerImage,
        imageAlt: 'Administrasjonsvisning i AssetTiger',
        caption: 'AssetTiger ble konfigurert for avdelingens utstyr, brukere og behov for sporbarhet.',
        imagePosition: 'right',
      },
      {
        id: 'equipment-for-learning',
        type: 'split',
        heading: 'Utstyr valgt ut fra hvordan elevene skulle lære',
        paragraphs: [
          'Ved utvidelsen av medieproduksjon deltok jeg også i vurdering og innkjøp av nytt produksjonsutstyr. Budsjettet måtte fordeles mellom flere behov, og det var derfor viktig å skille mellom utstyr som var interessant, og utstyr som faktisk kunne gi pedagogisk verdi.',
          'Innkjøpene omfattet blant annet Blackmagic-kameraer til livestudio, bærbare LED-lys, trådløst lydutstyr til reportasjer og mer avansert utstyr til film- og lydproduksjon.',
          'Utstyret skulle være tilgjengelig nok til at elevene kunne utforske og lære gjennom praktisk bruk. Samtidig ønsket vi å ha enkelte mer avanserte løsninger som ga elever med høy kompetanse mulighet til å gjennomføre produksjoner på et mer profesjonelt nivå.',
          'Målet var ikke å kjøpe det mest avanserte utstyret, men å velge utstyr som kunne gi best mulig læring innenfor rammene vi hadde.',
        ],
        imageSrc: blackMagicImage,
        imageAlt: 'Elever og lærer arbeider sammen rundt et Blackmagic-kamera',
        caption: 'Blackmagic-kameraet ble valgt både for undervisning i flerkameraproduksjon og for å gi elevene erfaring med profesjonelle arbeidsflyter.',
        imagePosition: 'left',
      },
      {
        id: 'oslomet-purchasing',
        type: 'split',
        heading: 'Innkjøp og arbeidsflyt ved OsloMet',
        paragraphs: [
          'Ved Institutt for estetiske fag på OsloMet hadde jeg i omtrent ett år ansvar for innkjøp gjennom Unit4 UBW. Arbeidet besto av bestillinger, leverandørdialog, nødvendige tilpasninger og oppfølging fram til utstyret var kommet fram til riktig fagmiljø.',
          'Jeg ga også råd om utstyr til nye klipperom, fotostudio og PC-rom.',
          'En sentral del av arbeidet ble å forbedre kommunikasjonen mellom bestilling og levering. Det var ikke tilstrekkelig at en ordre var registrert: Lærerne måtte vite hva som var bestilt, når det kom, og hvordan de skulle kontrollere at leveransen var komplett.',
          'Før jeg avsluttet arbeidet, la jeg derfor vekt på tydeligere rutiner og grundig opplæring av dem som skulle overta.',
          'For meg handler gode innkjøpsrutiner ikke bare om å gjennomføre en bestilling, men om å sikre at hele prosessen fungerer fram til utstyret er på plass og kan tas i bruk.',
        ],
        imageSrc: unitFourLogo,
        imageAlt: 'Unit4-logo',
        caption: 'Unit4 UBW ble brukt til bestillinger og oppfølging av innkjøp ved OsloMet.',
        imagePosition: 'right',
        imageFit: 'contain',
      },
      {
        id: 'resource-coordination-closing',
        type: 'text',
        paragraphs: [
          'På tvers av disse oppgavene har målet vært det samme: å lage løsninger som fungerer for menneskene som faktisk skal bruke dem.',
          'Det innebærer å involvere de berørte fagmiljøene, forstå begrensningene, teste løsningene og sørge for at rutinene kan videreføres av andre.',
          'Jeg ønsker ikke bare å løse oppgaven mens jeg selv er til stede. Jeg ønsker å etterlate en arbeidsprosess som fortsatt er tydelig, effektiv og anvendelig etter at arbeidet mitt er avsluttet.',
        ],
      },
    ],
  },
  titlePage('research', 'forskning', 'Forskning', '/forskning'),
  titlePage('projects', 'prosjekter', 'Prosjekter', '/prosjekter'),
  titlePage(
    'vanvidd',
    'vanvidd',
    'Vanvidd',
    '/prosjekter/vanvidd',
    'projects',
  ),
  titlePage(
    'cosmic-anchor',
    'cosmic-anchor',
    'Cosmic Anchor',
    '/prosjekter/cosmic-anchor',
    'projects',
  ),
  titlePage(
    'these-indie-darlings',
    'these-indie-darlings',
    'These Indie Darlings',
    '/prosjekter/these-indie-darlings',
    'projects',
  ),
  titlePage('interests', 'interesser', 'Interesser', '/interesser'),
]
