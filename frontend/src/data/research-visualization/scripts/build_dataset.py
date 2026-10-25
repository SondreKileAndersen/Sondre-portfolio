#!/usr/bin/env python3
"""Reproducible extraction from the user's PDF and curated research model.
No LLM calls; all interpretation is explicitly recorded below.
"""
from pathlib import Path
import json, re, csv, collections, hashlib, unicodedata
import fitz

ROOT=Path(__file__).resolve().parents[1]
PDF=ROOT/'sources'/'Vedlegg for kodebok og koder.pdf'
DATA=ROOT/'data'
DATA.mkdir(exist_ok=True)

def write(name,data):
    (DATA/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def csv_write(name, rows, cols):
    with (DATA/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=cols,extrasaction='ignore'); w.writeheader(); w.writerows(rows)

def txt_norm(s): return re.sub(r'\s+',' ',s).strip()

def dedup_norm(s):
    s=txt_norm(s).casefold()
    s=re.sub(r'[.!?,;:]+$','',s)
    return s

# Accurate current heading requires tracking across PDF page boundaries.
MAJOR=[('1.1 Spillformidlere som kulturelle mellomledd','praksis_mellomledd'),
('1.2 Spillformidleres innholdsprioritering','praksis_prioritering'),
('2.1 Privat kommunikasjon','privat_kommunikasjon'),
('2.2.1 Prosjektgrunnlag: Offentlig','prosjekt_offentlig'),
('2.2.2 Utviklersignaler','utviklersignaler'),
('2.3 Pressemateriale','pressemateriale'),
('Ekspertinformant Z','ekspert_z')]
SUBS={
'praksis_mellomledd':['Publikum','Kultur','Informativt','Etikk'],
'praksis_prioritering':['Prioritert innhold','Publikum/seerfokus','Innholdstyper','Pre-alpha dekning'],
'privat_kommunikasjon':['Direkte kontakt som oppdagelsesplatform','Grafisk materiale','Tekst','Målrettet tilpasset kontakt','Teknisk negative signaler','Informasjon','Pre-alpha','Avgjørende vurdering'],
'prosjekt_offentlig':['Trailer: Generelt','Trailer: Vurdering','Trailer: Output','Visuelt appelerende','Vurderingskriterier','Paratekster','Tekst','Tidlige prosjekter','Troverdighet','Avgjørende vurdering','AI'],
'utviklersignaler':['Utviklerens identitet og bakgrunn','Synlig aktivitet som tegn på framdrift og gjennomføringsevne','Offentlig kommunikasjon og responsivitet','Redaksjonell risiko og utviklerens kredibilitet'],
'pressemateriale':['Grafikk','Video','Informasjon','Press-kit Generelt'],
'ekspert_z':['Visuelt appelerende','Vurderingskriterier','E-post','AI','Utviklersignaler','Innholdsprioritering','Pressemateriale','Annet:']}

pdf=fitz.open(PDF)
lines=[]
for page_ix in range(11):
    pg=pdf[page_ix]
    for row in pg.get_text(sort=True).splitlines():
        # PDF extraction is fairly stable: each code note begins '[A:' etc.
        lines.append({'pdf_page':page_ix+1,'printed_page':page_ix+97,'line':row.strip()})

section='praksis_mellomledd'; sub='Publikum'
items=[]; pending=None
# NOTE: statements may contain newlines or unclosed brackets; preserve anomalies.
for line in lines:
    t=line['line'].strip().replace('\u200b','').replace('\ufeff','')
    if not t or (t.isdecimal() and 97 <= int(t) <= 118): continue
    matchingmajor=[(h,key) for h,key in MAJOR if t.startswith(h)]
    if matchingmajor:
        section=matchingmajor[0][1]; sub=''; continue
    possible_sub=SUBS.get(section,[])
    if t in possible_sub:
        sub=t; continue
    if section=='ekspert_z' and t == 'Memoer': break
    # some lines include two observations; scan markers and closing bracket per line.
    markers=list(re.finditer(r'\[(A|B|C|D|E|Z|Samlet)\s*:',t))
    if markers:
        if pending is not None:
            pending['flags'].append('missing_closing_bracket')
            pending=None
        for j,m in enumerate(markers):
            end=markers[j+1].start() if j+1<len(markers) else len(t)
            chunk=t[m.start():end].strip()
            # append a continuation via pending when no closing ]
            match_end=chunk.find(']')
            if match_end >= 0:
                chunk=chunk[:match_end+1]
            item={'informant':m.group(1),'text':txt_norm(chunk[m.end()-m.start():].removesuffix(']')),
                  'raw_bracket':chunk, 'code_section':section,'code_subcategory':sub,
                  'pdf_page':line['pdf_page'],'printed_page':line['printed_page'],'flags':[]}
            if match_end<0:
                pending=item
            items.append(item)
    elif pending is not None:
        if re.match(r'^(\d+\.\d+|\d+\.|[A-ZÅØÆ].*:)$',t):
            pending['flags'].append('missing_closing_bracket');pending=None;continue
        pending['text']+=' '+txt_norm(t.split(']')[0]); pending['raw_bracket']+=' '+t
        if ']' in t: pending=None
if pending is not None: pending['flags'].append('missing_closing_bracket')
# Known pdf abnormality: an apparent second observation with no closing bracket.
for k,it in enumerate(items,1):
    it['id']=f'OBS-{k:04d}'
    it['source']={'file':'Vedlegg for kodebok og koder.pdf','pdf_page':it['pdf_page'], 'printed_page':it['printed_page'], 'type':'codebook_paraphrase'}
    it['kind']='codebook_statement' if it['informant']!='Samlet' else 'author_assumption'
    if 'Drøfting:' in it['text']:
        it['flags'].append('contains_embedded_analyst_comment')
    it['text']=txt_norm(it['text'])
    it['text_normalized']=dedup_norm(it['text'])
    it['review_status']='needs_review' if it['flags'] else 'extracted_not_independently_verified'
    it['is_original_interview_quote']=False
    # Explicitly record TWO taxonomies: the original codebook section and the
    # later four-moment analytical organization; never confuse them with a direct edge.
    it['section_based_moment_id']={
        'praksis_mellomledd':'M_FORM','praksis_prioritering':'M_FORM',
        'prosjekt_offentlig':'M_PROJ','utviklersignaler':'M_DEV',
        'pressemateriale':'M_PRESS'}.get(it['code_section'])
    # Candidate entities from LITERAL mention only. Not analyst-reviewed links.
    # These are search/index hints; never turn them directly into diagram edges.
    concept_regex={
       'P_EMAIL':r'\be-post\w*|første kontakt|direkte kontakt|henvendels\w*',
       'P_TRAILER':r'trailer', 'P_STEAM':r'steam',
       'P_PROJECTWEB':r'prosjektnettside',
       'P_DEVELOPERWEB':r'utviklerens nettside|studioets nettside',
       'P_ACTIVITY':r'aktiv utvikling|studio-aktivitet|devlog|roadmap|oppfølging|framdrift|community',
       'P_PRESSKIT':r'press.?kit|pressepakke|branding kit',
       'S_PLAYABLE':r'spillbar|demo', 'S_AI':r'\bAI\b|generativ',
       'S_VISUAL':r'visuell|grafi[sk]|skjermbild|screenshot|kunststil',
       'S_REUSE':r'b-roll|logo|key art|thumbnail|png-element|cover art',
       'S_FORMAT':r'feature|review|opinion|gameplay|nyhet',
       'S_INFO_STUDIO':r'studiohistorie|studioinfo|team-sammensetning',
       'S_GENRE':r'sjanger|publikum|smak|målrett|relevant|kanal'
    }
    it['keyword_matched_concept_ids']=[key for key,rgx in concept_regex.items() if re.search(rgx,it['text'],re.I)]
    it['keyword_match_status']='automated_search_hint_not_validated_link'
    it['informant_role']='expert' if it['informant']=='Z' else 'researcher' if it['informant']=='Samlet' else 'primary'
counts=collections.Counter((it['informant'],it['text_normalized']) for it in items)
for it in items:
    it['duplicate_text_count']=counts[(it['informant'],it['text_normalized'])]
    it['duplicate_group_id']='DUP-'+hashlib.sha1((it['informant']+'|'+it['text_normalized']).encode()).hexdigest()[:9] if it['duplicate_text_count']>1 else None

write('observations.json',items)
csv_write('observations.csv',items,['id','informant','informant_role','code_section','code_subcategory','text','pdf_page','printed_page','kind','review_status','section_based_moment_id','keyword_match_status','duplicate_group_id','duplicate_text_count'])

concepts=[]
def c(id,label,kind,description,**extra):
    concepts.append(dict(id=id,label=label,kind=kind,description=description,**extra))
for id,label,desc in [
('M_FORM','Formidlingsrammer','Passer prosjektet spillformidlerens kanal, publikum, sjanger, plattform og format?'),
('M_PROJ','Prosjektgrunnlag','Hva uttrykkene gjør vurderbart om spillidé, uttrykk, sjanger, gameplay, kvalitet og særpreg.'),
('M_DEV','Utviklergrunnlag','Hva utviklerens kommunikasjon, identitet, aktivitet, historikk og oppfølging signaliserer.'),
('M_PRESS','Pressemateriale','Tilgang til og anvendbarhet av ressurser for produksjon av publiserbart innhold.')]: c(id,label,'assessment_dimension',desc)
for id,label,kind,desc in [
('P_EMAIL','E-post / direkte kontakt','paratext','Privat henvendelse som kan gi første sortering og peke videre.'),
('P_TRAILER','Trailer','paratext','Audiovisuelt uttrykk som kommuniserer deler av spillprosjektet.'),
('P_STEAM','Steam-side','paratext','Offentlig presentasjons- og informasjonsflate.'),
('P_PROJECTWEB','Prosjektnettside','paratext','Nettside for spillprosjektet; kategori fra opprinnelig analysematrise.'),
('P_DEVELOPERWEB','Utviklerside','paratext','Utviklerens nettside eller informasjon om utvikleren.'),
('P_ACTIVITY','Synlig utviklingsaktivitet','signal_cluster','Observerbar aktivitet på tvers av flater; ikke en entydig parateksttype.'),
('P_PRESSKIT','Pressepakke','paratext_collection','Samling av materialer som kan gjøre innholdsproduksjon enklere.'),
('S_VISUAL','Visuell appell','signal','Visuelle særtrekk, tone, stemning og grafisk uttrykk.'),
('S_GAMEPLAY','Gameplay / mekanikk','signal','Forsøk på å synliggjøre forventet faktisk spillopplevelse.'),
('S_GENRE','Sjanger- og kanalrelevans','signal','Om spillet passer aktørens kanal, sjanger og publikum.'),
('S_PLAYABLE','Spillbarhet / demo','signal','Om utviklingen er spillbar i relevante formater.'),
('S_TRUST','Troverdighet / seriøsitet','signal','Forhold som inngår i vurderingen av utviklerens og prosjektets troverdighet.'),
('S_PROGRESS','Framdrift / oppfølging','signal','Spor av faktisk utvikling, aktivitet og konsekvent oppfølging.'),
('S_REUSE','Gjenbrukbart materiale','signal','Bilder, logoer, B-roll, grafikk og tekst for egen innholdsproduksjon.'),
('S_FRICTION','Friksjon / merarbeid','signal','Tid og arbeid ved å finne, hente, tilpasse eller lage ressurser.'),
('S_REP','Representasjonskvalitet','signal','Hvordan materiale muliggjør ønsket og korrekt presentasjon.'),
('S_INFO','Tydelig informasjon og lenker','signal','Informasjon, beskrivelse og lenker som gjør vurdering og oppfølging enklere.'),
('S_RESP','Utviklerrespons / community','signal','Offentlige svar og samhandling med spillere eller følgere.'),
('S_FORMAT','Publiseringsformat','signal','Feature, nyhet, anmeldelse, gameplay og andre formater.'),
('S_RISK','Risiko ved omtale','signal','Mulighet for å knytte publikum og eget omdømme til et uferdig prosjekt.'),
('S_AI','Generativ AI som signal','signal','Ulike informanter vurderer mulig generativ AI ulikt.'),
('S_SEARCH','Søkbare egenskaper','analytical_concept','Observerbare trekk før spillet prøves: visuell stil, sjanger, tittel og liknende.'),
('S_EXPERIENCE','Erfaringsbaserte egenskaper','analytical_concept','Spillflyt, responsivitet, mestring, vanskelighetskurve, mekanisk opplevelse.'),
('S_TARGET','Målrettet kontakt','signal','Om kontakt er relevant, tydelig og egnet for mottakeren.'),
('S_INFO_STUDIO','Studiohistorikk / identitet','signal','Utviklerens bakgrunn og tilgjengelige informasjon.'),
('S_PRESS_ASSETS','B-roll / bilde / grafikk','signal','Konkrete audiovisuelle og grafiske ressurser.'),
]:c(id,label,kind,desc)
write('concepts.json',concepts)
write('informants.json',[
{'id':x,'role':'expert' if x=='Z' else 'primary','label':f'Informant {x}' if x!='Z' else 'Ekspertinformant Z',
 'note':'Ekspertperspektiv fra utvikler/outreach; ikke slå sammen med A–E i standardtall.' if x=='Z' else 'Anonymisert spillformidler. Ingen sikre faste rolletype-kategorier.'}
 for x in 'ABCDEZ'])
contexts=[
('C_FIRST','Første kontakt','stage'),('C_PUBLIC','Offentlig vurdering','stage'),('C_PRODUCTION','Innholdsproduksjon','stage'),
('C_PREALPHA','Pre-alpha / tidlig utviklingsfase','stage_of_game'),('C_DEMO','Demo / spillbar tilgang','playability'),('C_NOTPLAYABLE','Ikke-spillbart spill','playability'),
('C_PRIMARY','Hovedplattform','channel'),('C_SECONDARY','Sekundær / uformell plattform','channel'),
('C_VIDEO','Video / gameplay','publication_format'),('C_NEWS','Nyhet / feature','publication_format'),
('C_REVIEW','Review / anmeldelse','publication_format'),('C_OUTREACH','Outreach / markedsføring','actor_context')]
write('contexts.json',[{'id':id,'label':label,'axis':axis} for id,label,axis in contexts])

# One record for each original MATRIX cell. A black dot is an analytical assessment of
# an evident FUNCTION, not proof of 'directly coded relationship' under evidence rules.
rows=['P_EMAIL','P_TRAILER','P_STEAM','P_PROJECTWEB','P_DEVELOPERWEB','P_ACTIVITY','P_PRESSKIT']
cols=['M_FORM','M_PROJ','M_DEV','M_PRESS']
legend=[['clear','clear','clear','possible'],['possible','clear','possible','clear'],
        ['clear','clear','clear','possible'],['possible','clear','clear','clear'],
        ['none','possible','clear','none'],['none','clear','clear','possible'],
        ['possible','clear','possible','clear']]
mat=[{'id':f'CELL-{i+1:02d}-{j+1}', 'row_id':r,'column_id':cl,'status':legend[i][j],
      'provenance_type':'researcher_original_analysis_matrix',
      'source':'sources/original_paratekst_matrix.png',
      'note':'clear/possible represent interpretive matrix coding, NOT automatic direct-vs-analytical provenance; none means no asserted link, not proven absence.'} for i,r in enumerate(rows) for j,cl in enumerate(cols)]
write('original_matrix.json',mat)
csv_write('original_matrix.csv',mat,['id','row_id','column_id','status','provenance_type','source','note'])

# Manually auditable references to source PDF memo pages. Memo summaries are abbreviated,
# not pseudo-quotations. Refer to the original PDF for the full text and tables.
memos=[
(1,'Kulturelle mellomledd',11,12,'Spillformidlerne kan være selektive kulturelle mellomledd, men rollen varierer og ingen felles typologi følger av materialet.'),
(2,'Innholdsprioritering',12,14,'Sjanger, kanal, format, publikum, smak og spillbarhet varierer; vurderingen gjelder mulig omgjøring til stoff.'),
(3,'Privat kommunikasjon',14,15,'Første kontakt er oppdagelseskanal og mulig første vurderingsbarriere; personlig tilpasning er ikke universelt krav.'),
(4,'Offentlig prosjektgrunnlag',15,16,'Trailer, Steam-side, visuelle og tekstlige signaler gjør ulike sider ved et tidlig prosjekt vurderbare.'),
(5,'Utviklersignaler',16,18,'Troverdighet leses på tvers av kontakt, offentlige spor, aktivitet og utviklerkommunikasjon; ulike terskler.'),
(6,'Pressemateriale',18,20,'Brukbare ressurser reduserer merarbeid og støtter representasjon, men formelt presskit er ikke universelt krav.')]
write('memos.json',[{'id':f'MEMO-{i}','title':title,'source_pdf_pages':list(range(start,end+1)),'printed_pages':list(range(start+96,end+97)),'summary_analytical':summary,'source_file':PDF.name} for i,title,start,end,summary in memos]+[
{'id':'MEMO-SYNTH','title':'Overordnede mønstre: Vurderingsmomenter','source_pdf_pages':[20,21],'printed_pages':[116,117],
'summary_analytical':'Fire delvis overlappende vurderingsmomenter; varierende vekt og rekkefølge. Ikke en universell sjekkliste.', 'source_file':PDF.name}])

# Explicit direct evidence only: substring must be present in an observation.
# Composed FROM->TO pairs where the codebook wording explicitly names both signal and function.
# Non-exhaustive, high-precision seed; additional direct links must be manually reviewed.
DIRECT_RULES=[
('P_EMAIL','M_DEV','utviklerens erfaring gjennom hvordan første kontakt','Avsenderinntrykk fra første kontakt.'),
('P_EMAIL','M_PROJ','e-postkvalitet påvirker inntrykket av spillet','E-post påvirker inntrykk av spillet.'),
('P_EMAIL','M_FORM','avgjør på rundt 10 sekunder om spillet passer','Kontakt sorteres etter passform.'),
('P_EMAIL','M_FORM','ser feil målretting som rødt flagg','Mottakerrelevans i første kontakt.'),
('P_EMAIL','M_PRESS','foretrekker godt strukturert presskit i e-post','E-post kan gi tilgang til arbeidsmateriale.'),
('P_TRAILER','M_PROJ','vurderer teknisk- og generell kvalitet gjennom trailer','Trailer brukes til kvalitetsvurdering.'),
('P_TRAILER','M_PROJ','bruker trailer som informasjonsgrunnlag','Trailer er informasjonsgrunnlag.'),
('P_TRAILER','M_PROJ','vurderer spill ut fra trailer','Trailer i prosjektvurdering.'),
('P_TRAILER','M_FORM','lager feature av mange spill kun ut fra trailer','Trailer kan gi grunnlag for feature-format.'),
('P_TRAILER','M_PRESS','trenger nok informasjon i trailer til å lage innhold','Trailer kan gi materiale for omtale.'),
('P_STEAM','M_PROJ','ufullstendig “About this game” på steam som rødt flagg','Steam-tekst gir signal om prosjekt.'),
('P_STEAM','M_PROJ','ser på spillets steam-side','Steam-side brukes i offentlig prosjektvurdering.'),
('P_STEAM','M_DEV','vurderer abandonware gjennom Steam-tekst','Steam-tekst brukes som pålitelighetssignal.'),
('P_DEVELOPERWEB','M_DEV','sjekker utviklerens sosiale medier og nettside','Utviklerside som kilde til utviklergrunnlag.'),
('P_ACTIVITY','M_DEV','ser etter tegn på aktiv utvikling','Synlig utvikling signaliserer framdrift.'),
('P_ACTIVITY','M_DEV','studio-aktivitet for å vurdere dekning','Synlig aktivitet brukes som vurderingssignal.'),
('P_ACTIVITY','M_DEV','oppfølging av community som indikator på oppfølging av spillets utvikling','Oppfølging ses som utviklersignal.'),
('P_ACTIVITY','M_PROJ','oppfølging av community som indikator på oppfølging av spillets utvikling','Oppfølging ses som prosjektsignal.'),
('P_PRESSKIT','M_PRESS','ser press kits som svært nyttige','Presskit som produksjonsressurs.'),
('P_PRESSKIT','M_PRESS','Konsekvens av mangler i press-kit er merarbeid','Mangel gir produksjonsfriksjon.'),
('P_PRESSKIT','M_PROJ','bruker press kits som informasjonskilde','Presskit som prosjektinformasjon.'),
('P_PRESSKIT','M_DEV','bruker press kit til å forstå hvordan utvikleren vil presentere spillet','Utviklers posisjonering kommuniseres gjennom presskit.'),
('S_AI','M_PROJ','forkaster spill med generativ AI','AI som negativt prosjektsignal hos A.'),
('S_AI','M_PROJ','AI er ikke rødt flagg','AI er ikke universelt eksklusjonskriterium.'),
('S_PLAYABLE','M_FORM','dekker ikke spill uten demo','Dekningskrav varierer med spillbarhet.'),
('S_PLAYABLE','M_FORM','ikke-spillbare spill på hovedplattform','Hovedplattformen har krav til spillbarhet hos E.'),
('S_FORMAT','M_FORM','skiller mellom review og opinion/news','Innholdsformat skaper ulike vurderingsrammer.'),
('S_VISUAL','M_PROJ','vurderer spill gjennom visuelt førsteinntrykk','Visuell kvalitet i prosjektvurdering.'),
('S_VISUAL','M_PROJ','tiltrekkes av spill som er merkelige og visuelt slående','Visuelt særpreg i vurdering.'),
('S_PROGRESS','M_DEV','ønsker roadmap til oppfølging og oppdatering','Planverk som utviklersignal.'),
('S_RESP','M_DEV','bruker utviklersvar som vurderingsgrunnlag','Respons som utviklersignal.'),
('S_INFO_STUDIO','M_DEV','blir mistenksom ved lite studioinfo','Studioinformasjon påvirker kredibilitet.'),
('S_REUSE','M_PRESS','ønsker høyoppløst B-roll','Gjenbrukbart videomateriale etterspørres.'),
('S_FRICTION','M_PRESS','verdsetter materiell som sparer arbeidstid','Materiale kan redusere friksjon.'),
('S_REP','M_PRESS','dårlig muligheter for representasjon','Pressekit og representasjon.'),
('S_TARGET','M_FORM','ser feil målretting som rødt flagg','Mottakertilpasning som utvalgsfaktor.'),
('S_RISK','M_DEV','ser abandonware som risikable å dele','Utvikler/oppfølgingsrisiko.'),
('S_INFO','M_PROJ','leser beskrivelse av spillet','Beskrivelse i prosjektvurdering.'),
]

relations=[]
def rel(src,target,tier,relation,label,obs_ids=None,memo_ids=None,source_ids=None,confidence_note=None,contexts=None,polarity='descriptive',review='curated',source_kind='evidence'):
    relations.append({'id':f'REL-{len(relations)+1:04d}', 'source_id':src,'target_id':target,
    'tier':tier,'predicate':relation,'label':label,'evidence_observation_ids':obs_ids or [],
    'memo_ids':memo_ids or [],'matrix_cell_ids':source_ids or [],
    'context_ids':contexts or [],'polarity':polarity,'provenance_note':confidence_note or '',
    'review_status':review, 'provenance_scope':source_kind,
    'numeric_weight':None})

for src,target,phrase,rationale in DIRECT_RULES:
    hit=[it for it in items if phrase.casefold() in it['text'].casefold()]
    if not hit:
        raise ValueError('Explicit evidence not found for '+phrase)
    # A rule might hit same statement repeated; preserve all copies but counts dedup by unique informant/text.
    derived_contexts=sorted(set({
      'privat_kommunikasjon':'C_FIRST', 'prosjekt_offentlig':'C_PUBLIC',
      'pressemateriale':'C_PRODUCTION'}.get(x['code_section'])
      for x in hit) - {None})
    rel(src,target,'direct','provides_evidence_for',rationale,[x['id'] for x in hit],
        confidence_note='Direct = the paraphrased codebook wording explicitly relates this item to the function, not a verbatim interview quote.',
        contexts=derived_contexts,source_kind='codebook_statement')

# Original matrix: create an ANALYTICAL relation for every nonempty cell, clearly separate
# status ('clear', 'possible') from origin tier ('analytical').
for cell in mat:
    if cell['status']=='none': continue
    rel(cell['row_id'],cell['column_id'],'analytical','may_contribute_to',
        'Original analysematrise: '+ ('tydelig funksjon' if cell['status']=='clear' else 'mulig / indirekte funksjon'),
        memo_ids=['MEMO-SYNTH'],source_ids=[cell['id']],
        confidence_note=f'Assessment from original user matrix. Status={cell["status"]}; NOT automatically direct observational evidence.',
        source_kind='researcher_matrix')

ANALYTIC=[
('P_EMAIL','P_STEAM','links_to','Første henvendelse kan lede videre til Steam-side.',['MEMO-3']),
('P_TRAILER','S_SEARCH','shows','Trailer kan gjøre stil, sjanger og annet raskt observerbart.',['MEMO-4']),
('P_TRAILER','S_EXPERIENCE','signals_partially','Trailer kan signalisere, men ikke bevise, erfaringsbaserte egenskaper.',['MEMO-4']),
('P_ACTIVITY','S_PROGRESS','signals','Synlig aktivitet kan signalisere reell oppfølging over tid.',['MEMO-5']),
('S_PROGRESS','M_DEV','supports_assessment_of','Vedvarende framdrift inngår i vurderingen av gjennomføringsevne.',['MEMO-5']),
('S_GENRE','M_FORM','supports_assessment_of','Sjanger-, kanal- og publikumsfit.',['MEMO-2']),
('S_FORMAT','M_PRESS','conditions','Produksjonsressursene må passe publikasjonens format.',['MEMO-2','MEMO-6']),
('S_FRICTION','M_PRESS','conditions','Ekstraarbeid ved pressemateriale kan påvirke gjennomførbar omtale.',['MEMO-6']),
('S_REUSE','S_FRICTION','may_reduce','Gjenbrukbare ressurser kan redusere merarbeid.',['MEMO-6']),
('S_REP','M_PRESS','supports_assessment_of','Representasjonsmuligheter er del av pressematerialets funksjon.',['MEMO-6']),
('S_TRUST','M_DEV','supports_assessment_of','Troverdighet vurderes gjennom flere spor.',['MEMO-5']),
('S_RISK','M_FORM','conditions','Redaksjonell risiko påvirkes av kanal og publikum.',['MEMO-1','MEMO-2']),
('S_PLAYABLE','M_FORM','conditions','Dekningsmuligheter kan avhenge av spillbarhet og format.',['MEMO-2']),
('S_INFO','P_EMAIL','part_of','Lenker og informasjonsverdi i første henvendelse.',['MEMO-3']),
('S_PRESS_ASSETS','P_PRESSKIT','can_be_part_of','B-roll, bilder, logoer inngår i presskit eller pressmateriale.',['MEMO-6']),
('S_INFO_STUDIO','M_DEV','supports_assessment_of','Historikk og studioinformasjon signaliserer troverdighet.',['MEMO-5']),
]
for src,tgt,predicate,label,mids in ANALYTIC:
    rel(src,tgt,'analytical',predicate,label,memo_ids=mids,
        confidence_note='Researcher synthesis grounded in PDF memo; interpretation, not a new interview observation.',source_kind='memo_synthesis')

# Exploratory layer is intentionally EMPTY of asserted findings. Provide optional EXAMPLES,
# inactive pending review, so turning on exploratory cannot magically claim empirical support.
CANDIDATES=[
('P_DEVELOPERWEB','M_PROJ','Utviklerside kan også vise prosjektinformasjon, men må granskes nærmere.'),
('P_TRAILER','M_DEV','Trailerens profesjonalitet kan tenkes å signalisere utviklerkapasitet; ikke dokumentert som universell relasjon.'),
('P_PRESSKIT','S_TRUST','Strukturert presskit kan tenkes å bidra til tillit; ikke automatisk empirisk funn.'),
('P_PROJECTWEB','S_PROGRESS','Prosjektnettside kan tenkes å vise oppdateringer over tid; gjelder kun hvis innholdet finnes.'),
('P_EMAIL','S_RISK','Dårlig første kontakt kan tenkes å øke opplevd redaksjonell risiko; må underbygges.'),
('S_SEARCH','S_EXPERIENCE','Hvilke observerbare signaler kompenserer best for manglende spillbarhet? Utforskende spørsmål.')]
for src,tgt,note in CANDIDATES:
    rel(src,tgt,'exploratory','hypothesized_relationship',note,
        confidence_note='EXPLORATORY HYPOTHESIS. Not validated as finding; toggle off by default.',
        review='hypothesis_not_validated',source_kind='research_question')
write('relations.json',relations)
csv_write('relations.csv',[{**r,'evidence_observation_ids':'|'.join(r['evidence_observation_ids']),
'memo_ids':'|'.join(r['memo_ids']),'matrix_cell_ids':'|'.join(r['matrix_cell_ids']), 'context_ids':'|'.join(r['context_ids'])} for r in relations],
 ['id','source_id','target_id','tier','predicate','label','polarity','provenance_scope','evidence_observation_ids','memo_ids','matrix_cell_ids','context_ids','review_status','provenance_note','numeric_weight'])

# A conservative manually curated set of standpoints, not a claim of a complete annotation.
STANCES=[
('AI_neg_A','A','S_AI','critical',['forkaster spill med generativ AI','AI som rødt flagg']),
('AI_neg_E','E','S_AI','critical',['forkaster raskt spill med AI','AI som tegn på for lav innsats']),
('AI_B','B','S_AI','does_not_disqualify',['AI er ikke rødt flagg']),
('tailor_C','C','S_TARGET','supports',['ønsker mer skreddersydd kommunikasjon']),
('tailor_E','E','S_TARGET','does_not_require_personalization',['bryr seg ikke om personlig tilpasset e-post']),
('trailer_B','B','P_TRAILER','does_not_require',['mangler trailer og lignende er ikke avgjørende røde flagg']),
('demo_D','D','S_PLAYABLE','requires_for_coverage',['dekker ikke spill uten demo']),
('demo_E','E','S_PLAYABLE','requires_on_primary_channel',['ikke-spillbare spill på hovedplattform']),
('news_B','B','S_FORMAT','allows_news_angle',['omtaler tidlige spill som nyhet heller enn review']),
('early_E','E','S_FORMAT','allows_on_secondary_channel',['deler kun tidlige prosjekter på uformelle sosiale forum']),
('presskit_E','E','P_PRESSKIT','not_required',['bruker sjelden press kits']),
('promo_B','B','P_PRESSKIT','not_disqualifying',['lar ikke manglende promo-materiell styre vurderingen']),
('history_D','D','S_INFO_STUDIO','not_disqualifying',['ser ikke kort studiohistorikk som problem']),
('broll_A','A','S_REUSE','values',['ser B-roll som essensielt for videoomtale']),
('risk_E','E','S_RISK','concern',['ser abandonware som risikable å dele']),
('visual_A','A','S_VISUAL','values',['vektlegger visuell appell høyt']),
('visual_C','C','S_VISUAL','values',['tiltrekkes av spill som er merkelige og visuelt slående']),
('publ_A','A','S_GENRE','audience_oriented',['tilpasser eget perspektiv til bredt publikum']),
('publ_D','D','S_GENRE','taste_oriented',['lar personlig smak styre dekningen']),
('publ_E','E','S_GENRE','taste_oriented',['lar personlig smak styre spill som dekkes']),
]
stances=[]
for id,informant,concept,stance,phrases in STANCES:
    matched=[]
    for phrase in phrases:
        q=[it for it in items if it['informant']==informant and phrase.casefold() in it['text'].casefold()]
        if not q: raise ValueError('stance not found '+id+' '+phrase)
        matched.extend(x['id'] for x in q)
    stances.append({'id':id,'informant_id':informant,'concept_id':concept,'stance':stance,
        'observation_ids':sorted(set(matched)),'method':'manual_non_exhaustive_curated','context_ids':(['C_SECONDARY'] if id=='early_E' else ['C_PRIMARY','C_NOTPLAYABLE'] if id=='demo_E' else ['C_NOTPLAYABLE'] if id=='demo_D' else []),
        'caution':'Standpoints are not comparable numerical scale; blank is uncoded/unknown, not disagreement.'})
write('stances.json',stances)
csv_write('stances.csv',[{**x,'observation_ids':'|'.join(x['observation_ids'])} for x in stances],['id','informant_id','concept_id','stance','observation_ids','method'])


# Comparison grid: observed explicitly curated positions vs UNKNOWN; unknown never means no.
TOPICS=[
('S_AI','Generativ AI'),('S_PLAYABLE','Demo / spillbarhet'),('P_TRAILER','Trailerkrav / bruk'),
('S_VISUAL','Visuell appell'),('S_TARGET','Målrettet kontakt'),
('P_PRESSKIT','Pressekit / produksjonsressurser'),('S_INFO_STUDIO','Studiohistorikk'),
('S_GENRE','Publikums- og sjangerfit'),('S_RISK','Risiko / oppfølging'),
('S_FORMAT','Publiseringsformat')]
comparison=[]
for concept,label in TOPICS:
    for inf in 'ABCDE':
        ss=[s for s in stances if s['informant_id']==inf and s['concept_id']==concept]
        comparison.append({'informant_id':inf,'concept_id':concept,'topic_label':label,
          'status':'documented_position' if ss else 'not_coded_in_this_comparison',
          'positions':[s['stance'] for s in ss],
          'stance_ids':[s['id'] for s in ss],
          'source_observation_ids':sorted(set(id for s in ss for id in s['observation_ids']))})
write('comparison_matrix.json',comparison)
csv_write('comparison_matrix.csv',[{**c,'positions':'|'.join(c['positions']),
'stance_ids':'|'.join(c['stance_ids']),'source_observation_ids':'|'.join(c['source_observation_ids'])} for c in comparison],
['informant_id','concept_id','topic_label','status','positions','stance_ids','source_observation_ids'])

# Source-aligned coverage measures. They are not measures of importance or prevalence.
section_counts=[]
for inf in 'ABCDEZ':
    for sec in sorted(set(x['code_section'] for x in items)):
        subset=[x for x in items if x['informant']==inf and x['code_section']==sec]
        section_counts.append({'informant_id':inf,'code_section':sec,'n_codebook_entries':len(subset),
          'n_distinct_normalized_statements':len({x['text_normalized'] for x in subset}),
          'observation_ids':[x['id'] for x in subset]})
write('section_counts.json',section_counts)
csv_write('section_counts.csv',[{**x,'observation_ids':'|'.join(x['observation_ids'])} for x in section_counts],
['informant_id','code_section','n_codebook_entries','n_distinct_normalized_statements','observation_ids'])

# Process is a BRANCHING possible pathway, NOT an empirical sequence of all interviews.
process={
'model_id':'possible_pathways_v1','tier':'analytical','is_universal_order':False,
'explanation':'Illustrative alternatives synthesized from memos 2–6; no necessary single evaluation order.',
'nodes':[
{'id':'ENTRY','label':'Direkte kontakt eller offentlig oppdagelse','type':'entry'},
{'id':'FIT','label':'Relevans og formidlingsrammer','type':'decision'},
{'id':'PROJECT','label':'Prosjekt og tilgjengelige paratekster','type':'assessment'},
{'id':'DEV','label':'Utvikler og troverdighet','type':'assessment'},
{'id':'ASSET','label':'Tilgjengelig innhold / produksjonsvilkår','type':'assessment'},
{'id':'COVER','label':'Mulig omtale / produksjon','type':'outcome'},
{'id':'WAIT','label':'Vent / følg opp senere','type':'outcome'},
{'id':'SKIP','label':'Ingen omtale nå','type':'outcome'},
{'id':'SECONDARY','label':'Alternativ kanal / annet format','type':'outcome'}],
'edges':[
{'from':'ENTRY','to':'FIT','condition':'Mulig første relevanssjekk','tier':'analytical','memo_ids':['MEMO-2','MEMO-3']},
{'from':'ENTRY','to':'PROJECT','condition':'Prosjekt kan også oppdages gjennom offentlige flater','tier':'analytical','memo_ids':['MEMO-4']},
{'from':'FIT','to':'SKIP','condition':'Dårlig relevans i aktuell kanal/sjanger','tier':'analytical','memo_ids':['MEMO-2','MEMO-3']},
{'from':'FIT','to':'PROJECT','condition':'Aktuelt å undersøke videre','tier':'analytical','memo_ids':['MEMO-2','MEMO-3']},
{'from':'PROJECT','to':'DEV','condition':'Ønske om troverdighetskontroll','tier':'analytical','memo_ids':['MEMO-4','MEMO-5']},
{'from':'DEV','to':'PROJECT','condition':'Ytterligere informasjon kan avklare usikkerhet','tier':'analytical','memo_ids':['MEMO-5']},
{'from':'PROJECT','to':'ASSET','condition':'Nok interesse til å vurdere produksjon','tier':'analytical','memo_ids':['MEMO-4','MEMO-6']},
{'from':'DEV','to':'ASSET','condition':'Tilstrekkelig tillit til prosjekt/utvikler','tier':'analytical','memo_ids':['MEMO-5','MEMO-6']},
{'from':'ASSET','to':'COVER','condition':'Format, spillbarhet og tilgjengelig materiale passer','tier':'analytical','memo_ids':['MEMO-2','MEMO-6']},
{'from':'PROJECT','to':'WAIT','condition':'For tidlig / mer materiale forventes','tier':'analytical','memo_ids':['MEMO-2','MEMO-4']},
{'from':'ASSET','to':'SECONDARY','condition':'Mulig alternativt format eller sekundær kanal','tier':'analytical','memo_ids':['MEMO-2']},
{'from':'ASSET','to':'WAIT','condition':'Ennå ikke tilstrekkelig produksjonsgrunnlag','tier':'analytical','memo_ids':['MEMO-6']},
{'from':'DEV','to':'SKIP','condition':'Betydelige troverdighetsforbehold','tier':'analytical','memo_ids':['MEMO-5']}]
}
write('process_model.json',process)

# Illustrative qualitative-to-design traceability items; decisions must NOT be invented.
write('design_traceability.json',[
{'id':'DT-01','finding':'Tydelig og mottakertilpasset første kontakt kan redusere terskelen for videre vurdering.',
 'memo_ids':['MEMO-3'],'candidate_design_implication':'Konsis pitch med tydelige lenker til mer omfattende materiale.',
 'cosmic_anchor_actual_design_choice':None,'verification_status':'design_not_verified'},
{'id':'DT-02','finding':'Steam-side brukes som et sentralt informasjons- og presentasjonspunkt.',
 'memo_ids':['MEMO-4'],'candidate_design_implication':'Sørg for konsistent tekst og lett vei til Steam-side.',
 'cosmic_anchor_actual_design_choice':None,'verification_status':'design_not_verified'},
{'id':'DT-03','finding':'Brukbar B-roll, logo og bildeinnhold kan redusere produksjonsfriksjon.',
 'memo_ids':['MEMO-6'],'candidate_design_implication':'Tilgjengelige ressurser i format egnet for gjenbruk.',
 'cosmic_anchor_actual_design_choice':None,'verification_status':'design_not_verified'},
{'id':'DT-04','finding':'Troverdighet kan signaliseres ved synlig oppfølging og offentlig informasjon.',
 'memo_ids':['MEMO-5'],'candidate_design_implication':'Synlig prosjekt- og utviklerhistorikk uten krav om å publisere privat identitet.',
 'cosmic_anchor_actual_design_choice':None,'verification_status':'design_not_verified'}])

schema_info={'version':'1.0.0','unit_of_record':'Codebook paraphrases, not transcript segments',
'counting_policy':{'raw_observation_count':'Number of tagged entries in PDF; not interview frequency.',
'primary_distinct_informants':'Distinct A-E in evidence-linked observations, excluding Z and Samlet.',
'deduplication':'Duplicate normalized wording should not inflate distinct claims.',
'missing':'No mention does not imply 0 disagreement or absence.',
'weights':'No numeric strength weights from clear/possible or tier.'},
'filter_defaults':{'direct':True,'analytical':True,'exploratory':False,'include_expert_z':False,
'interpretive_matrix_statuses':['clear','possible']},
'matrix_interpretation':{'clear':'Clear function in the original researcher matrix; analytical coding.',
'possible':'Possible/indirect function in the original researcher matrix; analytical coding.',
'none':'Not asserted by the original matrix; not evidence of impossible relation.'},
'provenance_semantics':{'direct':'Explicit relation in a paraphrased codebook statement; not verbatim interview transcript.',
'analytical':'Researcher matrix or memo synthesis with sources.',
'exploratory':'Unvalidated research hypothesis, not an empirical finding.'}}
write('manifest.json',schema_info)

# Aggregate audit values (not statistical weights).
by=collections.Counter(x['informant'] for x in items)
sections=collections.Counter(x['code_section'] for x in items)
unique_note=len(set((x['informant'],x['text_normalized']) for x in items))
quality={'total_entries':len(items),'counts_by_informant':dict(sorted(by.items())),
 'counts_by_section':dict(sorted(sections.items())),'unique_informant_text_pairs':unique_note,
 'exact_repeated_entries':len(items)-unique_note,'flagged_entries':sum(bool(x['flags']) for x in items),
 'relations_by_tier':dict(collections.Counter(x['tier'] for x in relations)),
 'total_relations':len(relations), 'matrix_cells':len(mat), 'matrix_nonempty':sum(x['status']!='none' for x in mat),
 'num_stances_curated':len(stances)}
write('quality_report.json',quality)
print(json.dumps(quality,ensure_ascii=False,indent=2))

# Apply the explicit user review after rebuilding the historical extraction.
import subprocess
subprocess.run(["node", str(ROOT/"scripts"/"apply_matrix_revision.cjs")], check=True)
