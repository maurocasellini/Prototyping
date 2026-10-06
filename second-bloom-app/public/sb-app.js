/* Second Bloom – App (Client). Zustand wird im Konto gespeichert (/api/state), in der Demo im Browser. */

/* ---------- Sprache (Übersetzung der Oberfläche: public/i18n.js) ---------- */
const LANG = document.documentElement.dataset.lang || 'de';
const LOC = ({de:'de-CH', en:'en-GB', fr:'fr-CH', es:'es-ES', pt:'pt-PT'})[LANG] || 'de-CH';
const LANG_NAMES = {de:'Deutsch', en:'English', pt:'Português', es:'Español', fr:'Français'};

/* ---------- Content ---------- */
const PHASES = {
  peri:{name:'Perimenopause', desc:'Zyklus wird unregelmässig, erste Beschwerden'},
  meno:{name:'Menopause', desc:'Seit bis zu 12 Monaten keine Periode'},
  post:{name:'Postmenopause', desc:'Letzte Periode liegt über ein Jahr zurück'},
  unsure:{name:'Noch unsicher', desc:'Ich möchte es herausfinden'}
};
const GOALS = ['Mehr Energie','Besser schlafen','Stimmung stabilisieren','Muskeln & Knochen stärken','Gewicht halten','Konzentration im Job','Hitzewallungen lindern','Hormone verstehen'];
const SYMPTOMS = ['Hitzewallungen','Nachtschweiss','Schlafstörung','Reizbarkeit','Stimmungsschwankungen','Dünnhäutigkeit','Kraftlosigkeit','Brain Fog','Unruhe / Angst','Kopfschmerzen','Gelenkschmerzen','Herzklopfen'];
const SCALES = [
  {id:'mood', short:'Stimmung', label:'Stimmung', lo:'sehr tief', hi:'sehr gut'},
  {id:'energy', short:'Energie', label:'Energie', lo:'leer', hi:'viel Energie'},
  {id:'sleep', short:'Schlaf', label:'Schlaf letzte Nacht', lo:'kaum geschlafen', hi:'erholsam'},
  {id:'focus', short:'Fokus', label:'Konzentration', lo:'Nebel', hi:'klar'}
];
const IMPULSES = [
  'Dein Körper baut nicht ab. Er baut um. Du darfst dabei mitbestimmen.',
  'Stärke zeigt sich nicht darin, nie zu wanken. Sie zeigt sich darin, wieder aufzustehen.',
  'Heute reicht „gut genug“. Perfektion ist kein Hormon.',
  'Jede Wiederholung im Training ist eine Investition in die Frau, die du mit 70 sein wirst.',
  'Gefühle sind Wetter, nicht Klima. Auch dieser Sturm zieht weiter.',
  'Du bist nicht „zu empfindlich“. Dein Nervensystem arbeitet gerade unter erschwerten Bedingungen.',
  'Sag heute einmal Nein, ohne dich zu erklären.',
  'Erfahrung ist dein unfairer Vorteil. Niemand im Raum hat so viel gesehen wie du.',
  'Pausen sind kein Leistungsverlust. Sie sind Teil der Leistung.',
  'Was würdest du einer Freundin sagen, die sich gerade so fühlt wie du?',
  'Protein zuerst, dann der Rest. Dein Blutzucker und deine Laune danken es dir.',
  'Die zweite Lebenshälfte ist kein Nachspiel. Sie ist ein eigener Akt.',
  'Kleine Schritte zählen doppelt, wenn die Energie knapp ist.',
  'Du musst heute nichts beweisen. Nur gut für dich sorgen.'
];
const FOODS = [
  {n:'Griechischer Joghurt', a:'200 g', p:20},
  {n:'Magerquark', a:'250 g', p:30},
  {n:'2 Eier', a:'Grösse M', p:13},
  {n:'Lachs', a:'125 g', p:25},
  {n:'Hähnchenbrust', a:'150 g', p:35},
  {n:'Linsen, gekocht', a:'200 g', p:18},
  {n:'Tofu natur', a:'150 g', p:20},
  {n:'Hüttenkäse', a:'200 g', p:24},
  {n:'Proteinshake', a:'1 Portion', p:25},
  {n:'Edamame', a:'100 g', p:11},
  {n:'Hanfsamen', a:'3 EL', p:10},
  {n:'Mandeln', a:'30 g', p:6}
];
/* Recipe library: quantities per person. Categories drive the shopping list. */
const C_G='Gemüse & Obst', C_P='Fleisch, Fisch & Tofu', C_D='Milchprodukte & Eier', C_H='Getreide & Hülsenfrüchte', C_N='Nüsse & Samen', C_V='Vorrat & Konserven', C_X='Sonstiges';
const CATS = [C_G,C_P,C_D,C_H,C_N,C_V,C_X];
const ig = (n,q,u,c) => ({n,q,u,c});
const RECIPES = [
  {id:'bowl', type:'B', diet:'veg', n:'Leinsamen-Quark-Bowl mit Beeren', p:32, min:5, tags:['Phytoöstrogene','Blutzucker stabil'],
   ing:[ig('Magerquark',250,'g',C_D), ig('Leinsamen, geschrotet',1,'EL',C_N), ig('Beeren (frisch oder TK)',100,'g',C_G), ig('Mandelmus',1,'EL',C_N), ig('Zimt',0,'',C_V)],
   steps:['Quark mit einem Schuss Wasser cremig rühren.','Leinsamen und Zimt unterrühren.','Mit Beeren und Mandelmus toppen.'],
   why:'Leinsamen liefern Lignane, pflanzliche Stoffe mit schwach östrogenartiger Wirkung. 30 g Protein am Morgen halten den Blutzucker stabil.'},
  {id:'oats', type:'B', diet:'veg', n:'Overnight Oats mit Skyr & Chia', p:27, min:5, tags:['Ballaststoffe','Meal Prep'],
   ing:[ig('Haferflocken',40,'g',C_H), ig('Chiasamen',1,'EL',C_N), ig('Skyr nature',150,'g',C_D), ig('Milch oder Sojadrink',100,'ml',C_D), ig('Apfel',0.5,'Stk',C_G)],
   steps:['Alles in einem Glas verrühren, den Apfel hineinreiben.','Über Nacht in den Kühlschrank stellen.','Morgens mit ein paar Nüssen toppen.'],
   why:'Hafer und Chia sättigen lange und füttern die Darmflora, die beim Östrogenstoffwechsel mitarbeitet.'},
  {id:'ruehrei', type:'B', diet:'veg', n:'Rührei mit Spinat & Feta', p:30, min:10, tags:['Eiweiss','Calcium'],
   ing:[ig('Eier',3,'Stk',C_D), ig('Blattspinat',60,'g',C_G), ig('Feta',30,'g',C_D), ig('Vollkornbrot',1,'Scheibe',C_H), ig('Olivenöl',0,'',C_V)],
   steps:['Spinat in wenig Öl zusammenfallen lassen.','Verquirlte Eier zugeben und bei mittlerer Hitze stocken lassen.','Feta darüberbröseln, mit Vollkornbrot servieren.'],
   why:'Eier liefern Protein und Cholin fürs Gehirn, Feta und Spinat Calcium für die Knochen.'},
  {id:'scramble', type:'B', diet:'veg', n:'Tofu-Scramble mit Tomaten', p:26, min:10, tags:['Soja-Isoflavone','vegan'],
   ing:[ig('Tofu natur',150,'g',C_P), ig('Cherrytomaten',100,'g',C_G), ig('Frühlingszwiebel',1,'Stk',C_G), ig('Vollkornbrot',1,'Scheibe',C_H), ig('Kurkuma, Pfeffer',0,'',C_V)],
   steps:['Tofu mit der Gabel zerdrücken und in Öl anbraten.','Kurkuma, Pfeffer und halbierte Tomaten zugeben.','Mit Frühlingszwiebeln bestreuen und mit Brot servieren.'],
   why:'Soja enthält Isoflavone, die bei manchen Frauen Hitzewallungen etwas lindern können.'},
  {id:'smoothie', type:'B', diet:'veg', n:'Beeren-Protein-Smoothie mit Hanfsamen', p:25, min:5, tags:['schnell','Omega-3'],
   ing:[ig('Skyr nature',150,'g',C_D), ig('Beeren (frisch oder TK)',80,'g',C_G), ig('Banane',0.5,'Stk',C_G), ig('Hanfsamen',2,'EL',C_N), ig('Haferflocken',20,'g',C_H)],
   steps:['Alle Zutaten mit 100 ml Wasser in den Mixer geben.','30 Sekunden fein pürieren.','Sofort trinken oder in einer Flasche mitnehmen.'],
   why:'Hanfsamen bringen pflanzliches Omega-3 und Protein. Ideal, wenn das Frühstück schnell gehen muss.'},
  {id:'salat', type:'M', diet:'fish', n:'Linsen-Lachs-Salat mit Rucola', p:38, min:20, tags:['Omega-3','Ballaststoffe'],
   ing:[ig('Lachsfilet',125,'g',C_P), ig('Beluga-Linsen',60,'g',C_H), ig('Rucola',40,'g',C_G), ig('Gurke',0.5,'Stk',C_G), ig('Zitrone',0.5,'Stk',C_G), ig('Olivenöl, Senf',0,'',C_V)],
   steps:['Linsen 20 Min. in Wasser garen und abgiessen.','Lachs in der Pfanne 4 Min. pro Seite braten.','Mit Rucola, Gurke und einem Zitronen-Senf-Dressing mischen.'],
   why:'Omega-3 aus Lachs unterstützt Herz und Gehirn, Linsen liefern zusätzlich Protein und Ballaststoffe.'},
  {id:'tofu', type:'M', diet:'veg', n:'Tofu-Gemüse-Pfanne mit Edamame', p:30, min:15, tags:['Soja-Isoflavone','pflanzlich'],
   ing:[ig('Tofu natur',150,'g',C_P), ig('Edamame (TK)',100,'g',C_G), ig('Brokkoli',150,'g',C_G), ig('Paprika',0.5,'Stk',C_G), ig('Ingwer',10,'g',C_G), ig('Sojasauce, Sesamöl',0,'',C_V)],
   steps:['Tofu würfeln und knusprig anbraten.','Brokkoli, Paprika und Edamame 5 Min. mitbraten.','Mit Sojasauce und frischem Ingwer abschmecken.'],
   why:'Isoflavone aus Soja, dazu Brokkoli, der den Östrogenabbau in der Leber unterstützt.'},
  {id:'shak', type:'M', diet:'veg', n:'Shakshuka mit Feta', p:28, min:20, tags:['Eiweiss','Calcium'],
   ing:[ig('Eier',3,'Stk',C_D), ig('Tomaten, gehackt',0.5,'Dose',C_V), ig('Paprika',0.5,'Stk',C_G), ig('Zwiebel',0.5,'Stk',C_G), ig('Feta',40,'g',C_D), ig('Kreuzkümmel, Paprikapulver',0,'',C_V)],
   steps:['Zwiebel und Paprika anschwitzen, Gewürze zugeben.','Tomaten 8 Min. einkochen lassen.','Mulden formen, Eier hineingleiten lassen, zugedeckt stocken lassen. Feta darüber.'],
   why:'Eier liefern hochwertiges Protein, Feta Calcium für die Knochen.'},
  {id:'huhn', type:'M', diet:'meat', n:'Ofen-Hähnchen mit Kichererbsen & Gemüse', p:42, min:35, tags:['viel Protein','ein Blech'],
   ing:[ig('Hähnchenbrust',150,'g',C_P), ig('Kichererbsen',0.5,'Dose',C_V), ig('Zucchini',0.5,'Stk',C_G), ig('Paprika',0.5,'Stk',C_G), ig('Rote Zwiebel',0.5,'Stk',C_G), ig('Olivenöl, Paprikapulver',0,'',C_V)],
   steps:['Ofen auf 200 °C vorheizen. Gemüse und Kichererbsen mit Öl und Gewürzen aufs Blech geben.','Hähnchen darauflegen und 25 Min. backen.','Mit Joghurt oder Zitrone servieren.'],
   why:'Kichererbsen ergänzen das Hähnchen um Ballaststoffe und pflanzliches Protein.'},
  {id:'chili', type:'M', diet:'veg', n:'Linsen-Bohnen-Chili mit Joghurt', p:29, min:30, tags:['Ballaststoffe','Meal Prep'],
   ing:[ig('Rote Linsen',60,'g',C_H), ig('Kidneybohnen',0.5,'Dose',C_V), ig('Tomaten, gehackt',0.5,'Dose',C_V), ig('Zwiebel',0.5,'Stk',C_G), ig('Paprika',0.5,'Stk',C_G), ig('Griechischer Joghurt',80,'g',C_D), ig('Chili, Kreuzkümmel',0,'',C_V)],
   steps:['Zwiebel und Paprika anschwitzen, Gewürze zugeben.','Linsen, Bohnen, Tomaten und 150 ml Wasser 20 Min. köcheln.','Mit einem Klecks Joghurt servieren. Hält 3 Tage im Kühlschrank.'],
   why:'Hülsenfrüchte liefern Protein, Ballaststoffe und Phytoöstrogene. Gut zum Vorkochen.'},
  {id:'quinoa', type:'M', diet:'veg', n:'Quinoa-Bowl mit Hüttenkäse & Avocado', p:31, min:20, tags:['gesunde Fette','kalt'],
   ing:[ig('Quinoa',60,'g',C_H), ig('Hüttenkäse',150,'g',C_D), ig('Avocado',0.5,'Stk',C_G), ig('Gurke',0.5,'Stk',C_G), ig('Kürbiskerne',1,'EL',C_N), ig('Zitrone',0.5,'Stk',C_G)],
   steps:['Quinoa 15 Min. garen und abkühlen lassen.','Gurke und Avocado würfeln.','Mit Hüttenkäse anrichten, mit Kürbiskernen und Zitrone toppen.'],
   why:'Kürbiskerne sind reich an Magnesium und Zink, Avocado liefert gesunde Fette.'},
  {id:'ofenlachs', type:'M', diet:'fish', n:'Ofenlachs mit Brokkoli & Süsskartoffel', p:35, min:30, tags:['Omega-3','ein Blech'],
   ing:[ig('Lachsfilet',140,'g',C_P), ig('Brokkoli',150,'g',C_G), ig('Süsskartoffel',150,'g',C_G), ig('Zitrone',0.5,'Stk',C_G), ig('Olivenöl',0,'',C_V)],
   steps:['Süsskartoffel würfeln und mit Öl 10 Min. bei 200 °C backen.','Brokkoli und Lachs dazulegen, weitere 15 Min. backen.','Mit Zitrone beträufeln.'],
   why:'Omega-3 für Stimmung und Gehirn, komplexe Kohlenhydrate für ruhige Energie am Abend.'},
  {id:'pasta', type:'M', diet:'fish', n:'Linsenpasta mit Tomaten-Thunfisch-Sauce', p:40, min:15, tags:['schnell','viel Protein'],
   ing:[ig('Linsenpasta',80,'g',C_H), ig('Thunfisch im eigenen Saft',0.5,'Dose',C_V), ig('Tomaten, gehackt',0.5,'Dose',C_V), ig('Rucola',30,'g',C_G), ig('Knoblauch, Kapern',0,'',C_V)],
   steps:['Pasta nach Packungsangabe kochen.','Knoblauch anbraten, Tomaten und Kapern 5 Min. köcheln, Thunfisch unterheben.','Mit der Pasta mischen und mit Rucola servieren.'],
   why:'Linsenpasta hat etwa doppelt so viel Protein wie Weizenpasta und hält den Blutzucker ruhiger.'},
  {id:'curry', type:'M', diet:'veg', n:'Kichererbsen-Spinat-Curry mit Tofu', p:27, min:25, tags:['wärmend','pflanzlich'],
   ing:[ig('Kichererbsen',0.5,'Dose',C_V), ig('Tofu natur',100,'g',C_P), ig('Blattspinat',80,'g',C_G), ig('Kokosmilch light',100,'ml',C_V), ig('Naturreis',50,'g',C_H), ig('Currypaste',0,'',C_V)],
   steps:['Reis aufsetzen. Currypaste in einem Topf kurz anrösten.','Kokosmilch, Kichererbsen und Tofuwürfel 10 Min. köcheln.','Spinat unterrühren, bis er zusammenfällt. Mit Reis servieren.'],
   why:'Hülsenfrüchte und Soja zusammen, dazu Spinat für Magnesium und Folat.'},
  {id:'rind', type:'M', diet:'meat', n:'Rindsgeschnetzeltes mit Pilzen & Kartoffeln', p:38, min:25, tags:['Eisen','Klassiker'],
   ing:[ig('Rindfleisch, geschnetzelt',130,'g',C_P), ig('Champignons',150,'g',C_G), ig('Kartoffeln',150,'g',C_G), ig('Zwiebel',0.5,'Stk',C_G), ig('Halbrahm oder Joghurt',50,'ml',C_D)],
   steps:['Kartoffeln kochen.','Fleisch scharf anbraten und herausnehmen. Zwiebel und Pilze braten.','Mit Rahm oder Joghurt ablöschen, Fleisch zurück in die Pfanne geben, kurz ziehen lassen.'],
   why:'Rindfleisch liefert gut verfügbares Eisen und B12, wichtig bei starken Blutungen in der Perimenopause.'}
];
const DIETS = [['all','Alles'],['pesc','Pescetarisch'],['veg','Vegetarisch']];
const MEALS = {B:'Morgen', L:'Mittag', D:'Abend'};
// Wochentage in der Sprache der Oberfläche (1.1.2024 war ein Montag)
const WD = [1,2,3,4,5,6,7].map(i => { const w = new Date(Date.UTC(2024,0,i)).toLocaleDateString(LOC,{weekday:'long', timeZone:'UTC'}); return w.charAt(0).toUpperCase() + w.slice(1); });
const PICKS = ['Eier','Magerquark','Skyr','Feta','Tofu','Linsen','Kichererbsen','Lachs','Hähnchen','Spinat','Brokkoli','Tomaten','Paprika','Zucchini','Haferflocken','Quinoa'];

const WORKOUTS = {
  A:{n:'Ganzkörper Kraft A', min:40, focus:'Beine, Rücken, Rumpf', ex:[
    {n:'Goblet Squat', v:'goblet_squat', how:["Füsse etwas breiter als hüftbreit, Zehen leicht nach aussen. Kurzhantel senkrecht vor der Brust halten.", "Hüfte nach hinten und unten schieben, Knie zeigen in Richtung Zehen, Brust bleibt aufrecht.", "So tief, wie es mit geradem Rücken geht. Über die ganze Fusssohle nach oben drücken, oben Gesäss anspannen."], s:3, r:'10', cue:'Kurzhantel vor der Brust, Knie folgen den Zehen.'},
    {n:'Rumänisches Kreuzheben', v:'rdl', how:["Hüftbreit stehen, Kurzhanteln vor den Oberschenkeln, Knie ganz leicht gebeugt.", "Hüfte nach hinten schieben, Hanteln nah an den Beinen nach unten gleiten lassen, Rücken bleibt lang.", "Wenn die Rückseite der Beine deutlich zieht, über die Hüfte wieder aufrichten. Nicht ins Hohlkreuz."], s:3, r:'10', cue:'Hüfte nach hinten schieben, Rücken lang.'},
    {n:'Liegestütz erhöht', v:'incline_pushup', how:["Hände etwas breiter als schulterbreit auf eine Bank, einen Tisch oder die Küchenablage.", "Körper von Kopf bis Ferse in einer Linie, Bauch und Gesäss leicht anspannen.", "Brust kontrolliert zur Kante senken, Ellbogen etwa 45 Grad vom Körper, dann kraftvoll wegdrücken. Je höher die Ablage, desto leichter."], s:3, r:'8', cue:'Hände auf Bank oder Tisch, Körper in einer Linie.'},
    {n:'Einarmiges Rudern', v:'one_arm_row', how:["Eine Hand und ein Knie auf der Bank abstützen oder mit Ausfallschritt an einen Stuhl lehnen. Rücken gerade.", "Kurzhantel hängt unter der Schulter. Ellbogen nah am Körper Richtung Hüfte ziehen.", "Oben kurz das Schulterblatt zur Wirbelsäule ziehen, langsam ablassen. Seite wechseln."], s:3, r:'10 / Seite', cue:'Ellbogen nah am Körper zur Hüfte ziehen.'},
    {n:'Unterarmstütz', v:'plank', how:["Unterarme unter den Schultern, Beine gestreckt, auf den Zehen.", "Körper in einer Linie, Gesäss weder hoch noch durchhängend. Beckenboden und Bauch sanft aktivieren.", "Ruhig weiteratmen. Zu schwer? Knie am Boden lassen."], s:3, r:'30 s', cue:'Beckenboden sanft aktivieren, ruhig atmen.'}]},
  B:{n:'Ganzkörper Kraft B', min:40, focus:'Gesäss, Schultern, Rumpf', ex:[
    {n:'Hip Thrust', v:'hip_thrust', how:["Schulterblätter an eine Bank oder ein Sofa, Füsse hüftbreit flach am Boden, Gewicht auf der Hüfte.", "Über die Fersen das Becken heben, bis Oberschenkel und Oberkörper eine Linie bilden. Kinn leicht zur Brust.", "Oben 2 Sekunden das Gesäss anspannen, kontrolliert absenken."], s:3, r:'12', cue:'Schultern auf der Bank, oben 2 s halten.'},
    {n:'Ausfallschritt rückwärts', v:'reverse_lunge', how:["Hüftbreit stehen, bei Bedarf an einer Wand festhalten.", "Einen grossen Schritt nach hinten, beide Knie beugen, bis das hintere Knie knapp über dem Boden ist.", "Vorderes Knie bleibt über dem Fuss. Über die vordere Ferse zurück in den Stand drücken. Seite wechseln."], s:3, r:'8 / Seite', cue:'Oberkörper aufrecht, vorderes Knie stabil.'},
    {n:'Schulterdrücken sitzend', v:'seated_press', how:["Aufrecht auf eine Bank oder einen stabilen Stuhl setzen, Kurzhanteln auf Schulterhöhe.", "Rippen unten halten, Bauch leicht anspannen, Hanteln nach oben drücken, bis die Arme fast gestreckt sind.", "Langsam zurück auf Schulterhöhe. Nicht ins Hohlkreuz ausweichen."], s:3, r:'10', cue:'Rippen unten lassen, nicht ins Hohlkreuz.'},
    {n:'Latzug mit Band', v:'band_pulldown', how:["Widerstandsband oben an einer Tür oder Stange befestigen, kniend oder sitzend greifen.", "Schultern zuerst nach unten ziehen, dann die Ellbogen Richtung Hüfte führen.", "Unten kurz halten, Band kontrolliert zurücklassen."], s:3, r:'12', cue:'Schulterblätter nach unten ziehen.'},
    {n:'Dead Bug', v:'dead_bug', how:["Rückenlage, Arme zur Decke, Beine angewinkelt in der Luft (Knie über der Hüfte).", "Lendenwirbelsäule sanft in den Boden drücken. Gegengleich einen Arm nach hinten und das andere Bein nach vorne strecken.", "Nur so weit, wie der Rücken am Boden bleibt. Zurück zur Mitte, Seite wechseln, dabei ausatmen."], s:3, r:'10', cue:'Lendenwirbelsäule bleibt am Boden.'}]},
  C:{n:'Kraft & Knochenimpuls', min:35, focus:'Kraft plus Stossbelastung für die Knochen', ex:[
    {n:'Step-ups', v:'step_up', how:["Vor eine stabile Stufe oder Bank stellen, ganzen Fuss daraufsetzen.", "Über die Ferse des oberen Beins hochdrücken, ohne mit dem unteren Bein abzustossen.", "Oben aufrecht stehen, kontrolliert wieder absteigen. Seite wechseln. Mit Hanteln schwerer machen."], s:3, r:'10 / Seite', cue:'Ganzen Fuss auf die Stufe setzen.'},
    {n:'Kettlebell-Kreuzheben', v:'kb_deadlift', how:["Kettlebell zwischen den Füssen, etwas breiter als hüftbreit stehen.", "Hüfte nach hinten, Knie leicht beugen, Griff fassen, Rücken lang, Schultern über der Kugel.", "Aus Beinen und Hüfte aufstehen, oben Gesäss anspannen, mit geradem Rücken wieder abstellen."], s:3, r:'10', cue:'Gewicht aus der Hüfte heben, nicht aus dem Rücken.'},
    {n:'Kurzhantel-Bankdrücken', v:'db_bench', how:["Rücklings auf eine Bank (oder den Boden), Füsse fest am Boden, Hanteln über der Brust.", "Hanteln kontrolliert seitlich zur Brust senken, Ellbogen etwa 45 Grad vom Körper.", "In 2 Sekunden ablassen, kraftvoll nach oben drücken."], s:3, r:'10', cue:'Kontrolliert ablassen, 2 s nach unten.'},
    {n:'Farmer’s Walk', v:'farmers_walk', how:["Zwei schwere Kurzhanteln oder Taschen seitlich greifen.", "Aufrecht stehen, Schultern weg von den Ohren, Bauch fest.", "Mit kurzen, ruhigen Schritten gehen. Stärkt Griff, Rumpf und Haltung."], s:3, r:'40 m', cue:'Schwere Gewichte, aufrechter Gang.'},
    {n:'Kleine Sprünge', v:'jumps', how:["Hüftbreit stehen, leicht in die Knie gehen.", "Kleine, federnde Sprünge auf dem Vorfuss, weich landen. Der kurze Stoss setzt einen Reiz für die Knochen.", "Bei Beckenboden- oder Gelenkbeschwerden stattdessen Fersenfallen: auf die Zehenspitzen gehen und die Fersen fallen lassen."], s:3, r:'10', cue:'Weich landen. Bei Beckenbodenbeschwerden durch Fersenfallen ersetzen.'}]},
  M:{n:'Mobilität & Beckenboden', min:20, focus:'Beweglichkeit, Haltung, Beckenboden', ex:[
    {n:'Katze-Kuh', v:'cat_cow', how:["Vierfüsslerstand, Hände unter den Schultern, Knie unter der Hüfte.", "Ausatmen: Rücken rund machen, Kinn zur Brust.", "Einatmen: Brustbein nach vorne schieben, Blick leicht nach vorne. Langsam im Atemrhythmus wechseln."], s:2, r:'10', cue:'Mit dem Atem bewegen.'},
    {n:'Hüftbeuger-Dehnung', v:'hip_flexor', how:["Halber Kniestand, ein Knie am Boden (Kissen unterlegen), anderer Fuss vorne.", "Becken leicht aufrichten (Schambein Richtung Bauchnabel), Gesäss des hinteren Beins anspannen.", "Leicht nach vorne schieben, bis es vorne in der Hüfte zieht. Halten, ruhig atmen, Seite wechseln."], s:2, r:'45 s / Seite', cue:'Becken leicht aufrichten.'},
    {n:'Beckenboden-Aktivierung', v:'pelvic_floor', how:["Bequem liegen oder sitzen, Atem fliessen lassen.", "Beim Ausatmen den Beckenboden sanft nach innen und oben ziehen, als würdest du Wasser halten. Gesäss und Bauch bleiben locker.", "5 Sekunden halten, dann bewusst vollständig lösen. Das Loslassen ist genauso wichtig wie das Anspannen."], s:3, r:'8 × 5 s', cue:'Beim Ausatmen sanft nach innen-oben ziehen, vollständig lösen.'},
    {n:'Brustwirbelsäule rotieren', v:'thoracic_rotation', how:["Seitlage, Knie angewinkelt, Arme gestreckt übereinander vor der Brust.", "Oberen Arm wie ein Buch nach hinten öffnen, Blick folgt der Hand, Knie bleiben zusammen.", "Kurz halten, ausatmen, zurückführen. Seite wechseln."], s:2, r:'8 / Seite', cue:'In Seitlage, Blick folgt der Hand.'}]}
};
const WEEKPLAN = {1:'A',2:'M',3:'B',4:'walk',5:'C',6:'walk',0:'rest'};
const DAYNAMES = [7,1,2,3,4,5,6].map(i => new Date(Date.UTC(2024,0,i)).toLocaleDateString(LOC,{weekday:'short', timeZone:'UTC'}).replace('.','').slice(0,3));
const EXERCISES = {
  box:{n:'Box-Atmung', v:'box_breathing', min:4, for:'Akuter Stress, vor Meetings, bei einer Hitzewelle', breath:[['Einatmen',4],['Halten',4],['Ausatmen',4],['Halten',4]], cycles:6,
    intro:'Ein gleichmässiger Rhythmus beruhigt das Nervensystem in wenigen Minuten. Atme durch die Nase, lass die Schultern sinken.'},
  478:{n:'4-7-8-Atmung', v:'breathing_478', min:3, for:'Einschlafen, nächtliches Aufwachen', breath:[['Einatmen',4],['Halten',7],['Ausatmen',8]], cycles:4,
    intro:'Das lange Ausatmen aktiviert den Parasympathikus, den „Ruhenerv“. Ideal im Bett oder wenn du nachts wach liegst.'},
  stopp:{n:'STOPP-Technik', v:'stopp', min:2, for:'Reizbarkeit, wenn es hochkocht',
    intro:'Für Momente, in denen die Reaktion schneller ist als du. Je öfter du übst, desto früher greift sie.',
    steps:[['S','Stopp. Halte inne, bevor du antwortest.'],['T','Tief durchatmen. Einmal langsam ein und noch langsamer aus.'],['O','Observieren. Was fühle ich gerade? Was denke ich? Wo spüre ich es im Körper?'],['P','Perspektive. Wie wichtig ist das in einer Woche? Spielt Müdigkeit oder Hormonlage mit?'],['P','Passend handeln. Was ist jetzt die hilfreichste Reaktion für mich?']]},
  erdung:{n:'5-4-3-2-1 Erdung', v:'grounding', min:3, for:'Unruhe, Gedankenkarussell, Herzklopfen',
    intro:'Holt dich über die Sinne zurück ins Hier und Jetzt.',
    steps:[['5','Dinge, die du sehen kannst. Benenne sie leise.'],['4','Dinge, die du fühlen kannst: Stuhl, Kleidung, Füsse am Boden.'],['3','Geräusche, die du hören kannst.'],['2','Dinge, die du riechen kannst.'],['1','Eine Sache, die du schmecken kannst, oder ein freundlicher Satz an dich selbst.']]},
  scan:{n:'Mini-Körperscan', v:'body_scan', min:3, for:'Erschöpfung, Mittagstief, Anspannung',
    intro:'Wandere mit der Aufmerksamkeit durch den Körper, ohne etwas verändern zu müssen.',
    steps:[['1','Füsse und Beine: Wo liegen sie auf, wo ist Spannung?'],['2','Bauch und Becken: Lass den Bauch beim Einatmen weich werden.'],['3','Schultern und Kiefer: Bewusst lösen, Zunge vom Gaumen nehmen.'],['4','Gesicht und Stirn: Glätten, als würdest du lächeln wollen.'],['5','Ein ganzer Atemzug für den ganzen Körper.']]}
};
const PROGRAMS = {
  emotion:{n:'Emotionen regulieren', sub:'Bei Stimmungsschwankungen und Dünnhäutigkeit', c:'t-accent', lessons:[
    ['Was in dir passiert','Schwankendes Östrogen und sinkendes Progesteron beeinflussen Serotonin und GABA, die Botenstoffe für Ausgeglichenheit und Ruhe. Deine Reaktionen sind nicht „zu viel“. Sie haben eine körperliche Ursache.','Notiere heute einen Moment, in dem du gereizt warst, und was direkt davor passiert ist.'],
    ['Auslöser erkennen','Häufige Verstärker sind Schlafmangel, Hunger, Lärm, Zeitdruck und Zyklusphase. Wer die Muster kennt, kann vorbeugen.','Halte drei Tage lang fest: Situation, Gefühl von 1 bis 10, Schlaf der Nacht davor.'],
    ['Die STOPP-Technik','Zwischen Reiz und Reaktion liegt ein Raum. STOPP hilft dir, ihn zu finden, bevor Worte fallen, die du bereust.','Wende STOPP heute einmal bewusst an. Die Übung findest du unter Mental.'],
    ['Reden nach einem Ausbruch','Reparatur ist wichtiger als Perfektion. Ein kurzer, ehrlicher Satz entlastet dich und dein Umfeld.','Formuliere einen Satz für Familie oder Team, z. B.: „Ich bin gerade schneller gereizt. Das liegt nicht an dir, und ich arbeite daran.“']]},
  fokus:{n:'Fokus & Klarheit', sub:'Gegen Brain Fog und Konzentrationsschwäche', c:'t-sky', lessons:[
    ['Brain Fog verstehen','Wortfindungsstörungen und Vergesslichkeit sind in der Perimenopause häufig und meist vorübergehend. Schlaf, Bewegung und stabiler Blutzucker haben grossen Einfluss.','Beobachte heute, zu welcher Tageszeit dein Kopf am klarsten ist.'],
    ['Eine Sache zur Zeit','Multitasking kostet in dieser Phase besonders viel Energie. Arbeite in 25-Minuten-Blöcken an genau einer Aufgabe.','Plane morgen zwei Fokusblöcke in deinem Kalender ein.'],
    ['Externes Gedächtnis','Entlaste dein Arbeitsgedächtnis: feste Ablageorte, eine einzige Aufgabenliste, Notizen direkt im Gespräch.','Richte dir eine einzige Liste für alle offenen Punkte ein.'],
    ['Energie-Fenster nutzen','Lege anspruchsvolle Aufgaben in dein klarstes Zeitfenster, Routine in die Tiefs.','Verschiebe eine wichtige Aufgabe dieser Woche in dein bestes Zeitfenster.']]},
  job:{n:'Stark im Job', sub:'Leistungsfähigkeit, Grenzen, Gespräche', c:'t-sun', lessons:[
    ['Dein Energie-Kalender','Leistung hängt nicht nur von Disziplin ab, sondern von Energie. Plane nach Energie, nicht nur nach Zeit.','Markiere in deinem Kalender für nächste Woche die Termine, die Energie geben, und die, die Energie kosten.'],
    ['Grenzen ohne Rechtfertigung','Ein klares Nein schützt deine Ressourcen. Du musst es nicht begründen.','Übe den Satz: „Das schaffe ich diese Woche nicht. Ich kann es bis Donnerstag übernehmen.“'],
    ['Das Gespräch mit der Führungskraft','Du musst keine Details teilen. Konkrete Bedürfnisse genügen, etwa flexible Zeiten, ein kühlerer Arbeitsplatz oder Fokuszeit.','Schreibe auf, welche zwei Anpassungen dir am meisten helfen würden.'],
    ['Erfahrung als Stärke','Urteilsvermögen, Menschenkenntnis und Gelassenheit wachsen mit den Jahren. Mach sie sichtbar.','Notiere drei Situationen, in denen deine Erfahrung im Team den Unterschied gemacht hat.']]},
  selbst:{n:'Selbstmitgefühl & Resilienz', sub:'Freundlicher mit dir selbst werden', c:'t-sage', lessons:[
    ['Der innere Kritiker','Gerade in Umbruchphasen wird die innere Stimme oft lauter. Sie will schützen, schadet aber meist.','Schreibe einen typischen Satz deines inneren Kritikers auf.'],
    ['Wie mit einer Freundin','Sprich mit dir, wie du mit einer guten Freundin sprechen würdest. Das senkt nachweislich Stress.','Formuliere den Kritiker-Satz von gestern so um, wie eine Freundin ihn sagen würde.'],
    ['Annehmen, was ist','Aus der Akzeptanz- und Commitment-Therapie (ACT): Gefühle dürfen da sein, ohne dass sie das Steuer übernehmen.','Sag dir bei einem schwierigen Gefühl: „Ich bemerke, dass ich gerade … fühle.“'],
    ['Werte als Kompass','Die zweite Lebenshälfte ist eine Chance, neu zu sortieren: Was ist dir wirklich wichtig?','Notiere drei Werte, nach denen du die nächsten Jahre leben willst.']]},
  schlaf:{n:'Besser schlafen', sub:'Bei Ein- und Durchschlafproblemen', c:'t-sky', lessons:[
    ['Die 60-Minuten-Abendroutine','Eine Stunde vor dem Schlafen: Licht dimmen, Bildschirme weg, etwas Ruhiges tun. Der Körper lernt das Signal.','Lege heute eine feste Uhrzeit fest, ab der Bildschirme aus sind.'],
    ['Wenn du nachts aufwachst','Nicht auf die Uhr schauen. 4-7-8-Atmung. Wenn du nach 20 Minuten noch wach bist, kurz aufstehen und im Dämmerlicht lesen.','Probiere die 4-7-8-Atmung heute Abend einmal aus.'],
    ['Kühle und Nachtschweiss','Ideal sind 16 bis 18 °C im Schlafzimmer, atmungsaktive Bettwäsche und ein Wechselshirt griffbereit. Alkohol am Abend verstärkt Nachtschweiss.','Lege dir heute alles für eine kühle Nacht bereit.'],
    ['Gedanken parken','Schreibe vor dem Schlafen auf, was dich beschäftigt, und den nächsten kleinen Schritt dazu. Dann darf es bis morgen warten.','Leg dir Block und Stift neben das Bett.']]}
};
const FAQ = [
  ['Warum bin ich gerade so dünnhäutig?','Schwankende Hormone wirken direkt auf Botenstoffe wie Serotonin und GABA. Dazu kommen oft Schlafmangel und eine hohe Alltagslast. Das ist keine Charakterschwäche. Bewegung, Schlaf, Protein und gezielte Übungen können spürbar helfen.'],
  ['Ist das die Menopause oder eine Depression?','Die Beschwerden überschneiden sich, und beides kann gleichzeitig auftreten. Wenn gedrückte Stimmung, Freudlosigkeit oder Hoffnungslosigkeit länger als zwei Wochen anhalten, sprich bitte mit deiner Ärztin oder deinem Arzt.'],
  ['Warum kann ich mich so schlecht konzentrieren?','„Brain Fog“ betrifft viele Frauen in der Perimenopause und ist meist vorübergehend. Schlafqualität, regelmässige Bewegung, stabiler Blutzucker und weniger Multitasking haben grossen Einfluss.'],
  ['Warum bin ich kraftlos, obwohl ich genug schlafe?','Neben den Hormonen können Eisenmangel, die Schilddrüse oder ein niedriger Vitamin-D-Spiegel dahinterstecken. Lass diese Werte ärztlich prüfen. Krafttraining und ausreichend Protein bauen Energie langfristig wieder auf.'],
  ['Wie spreche ich das Thema im Job an?','Sachlich und lösungsorientiert. Du musst keine medizinischen Details nennen. Konkrete Bedürfnisse wie flexible Zeiten, Fokuszeiten oder ein kühlerer Platz genügen. Das Programm „Stark im Job“ hilft bei der Vorbereitung.'],
  ['Werde ich wieder so leistungsfähig wie früher?','Viele Frauen erleben nach der Übergangsphase wieder mehr Stabilität. Mit Training, Schlaf und gegebenenfalls ärztlicher Behandlung lässt sich viel zurückgewinnen, oft mit mehr Klarheit darüber, wofür man seine Energie einsetzt.']
];
const SUPPS = [
  {id:'d3k2', n:'Vitamin D3 + K2', for:'Knochen, Muskeln, Immunsystem, Stimmung', dose:'häufig 1000–2000 IE D3 täglich', note:'Spiegel (25-OH-D) bestimmen lassen, um die passende Menge zu finden.', phases:['peri','meno','post','unsure']},
  {id:'mag', n:'Magnesium', for:'Muskeln, Schlaf, Nerven, Wadenkrämpfe', dose:'200–400 mg am Abend, z. B. als Bisglycinat', note:'Bei Nierenerkrankungen nur nach Rücksprache.', phases:['peri','meno','post','unsure']},
  {id:'omega3', n:'Omega-3 (EPA/DHA)', for:'Herz, Gehirn, Stimmung, Entzündungsprozesse', dose:'ca. 1–2 g EPA+DHA täglich', note:'Alternative: zweimal pro Woche fetter Fisch. Bei Blutverdünnern Rücksprache halten.', phases:['peri','meno','post','unsure']},
  {id:'kreatin', n:'Kreatin-Monohydrat', for:'Muskelkraft, Trainingserfolg, erste Hinweise auf Nutzen fürs Gehirn', dose:'3–5 g täglich, Zeitpunkt egal', note:'Gut untersucht. Ausreichend trinken.', phases:['peri','meno','post','unsure']},
  {id:'calcium', n:'Calcium', for:'Knochendichte', dose:'Ziel ca. 1000 mg pro Tag, vorrangig über die Ernährung', note:'Nur ergänzen, wenn die Ernährung nicht reicht. Mit Vitamin D kombinieren.', phases:['meno','post']},
  {id:'b12', n:'Vitamin B12', for:'Energie, Nerven, Blutbildung', dose:'nach Blutwert', note:'Besonders relevant bei pflanzlicher Ernährung oder Magensäureblockern.', phases:['peri','meno','post','unsure']},
  {id:'eisen', n:'Eisen', for:'Energie bei starken oder häufigen Blutungen', dose:'nur nach Ferritin-Messung', note:'Nicht auf Verdacht einnehmen. Überdosierung ist schädlich.', phases:['peri','unsure']},
  {id:'isoflavone', n:'Soja-Isoflavone', for:'Hitzewallungen', dose:'siehe Evidenz', note:'Wirkung bescheiden und individuell. Bei Brustkrebs in der Vorgeschichte ärztlich abklären.', phases:['peri','meno','post']},
  {id:'traubensilberkerze', n:'Traubensilberkerze', for:'Hitzewallungen', dose:'siehe Evidenz', note:'Studienlage uneinheitlich. Selten Leberprobleme beschrieben.', phases:['peri','meno','post']}
];
// Evidenz: Schlüssel je Mittel in /evidence.json (geprüfte Quellen aus PubMed, Leitlinien und Behörden)
const EVID_KEYS = {d3k2:['vitd','k2'], mag:['magnesium'], omega3:['omega3'], kreatin:['creatine'], calcium:['calcium'], b12:['b12'], eisen:['iron'], isoflavone:['isoflavones'], traubensilberkerze:['black_cohosh']};
let EVID = null;
// Evidenz je Sprache (evidence.en.json …), sonst Deutsch
async function loadEvidence(){ if(EVID) return EVID; for(const f of LANG==='de' ? ['/evidence.json'] : ['/evidence.'+LANG+'.json','/evidence.json']){ try{ const r = await fetch(f); if(r.ok){ EVID = await r.json(); break; } }catch(e){} } return EVID; }
const LEVEL = {hoch:['Hoch','ev-hoch'], moderat:['Moderat','ev-moderat'], niedrig:['Niedrig','ev-niedrig'], unzureichend:['Unzureichend','ev-unzureichend']};
const lvl = (e) => { const x = LEVEL[e] || ['Offen','ev-unzureichend']; return `<span class="tag ${x[1]}">${x[0]}</span>`; };
function srcList(list){
  return `<ol class="srcs">${(list||[]).map(q => `<li><span class="tag t-src">${esc(q.type||'Quelle')}</span> <span translate="no">${esc(q.authors||'')}${q.year ? ' ('+esc(q.year)+')' : ''}. <i>${esc(q.title||'')}</i>. ${esc(q.journal||'')}.</span>
    ${q.pmid ? `<a href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(q.pmid)}/" target="_blank" rel="noopener">PubMed ${esc(q.pmid)}</a>` : ''}
    ${q.doi ? ` · <a href="https://doi.org/${encodeURI(q.doi)}" target="_blank" rel="noopener">DOI</a>` : ''}
    ${!q.pmid && !q.doi && q.url ? `<a href="${esc(q.url)}" target="_blank" rel="noopener">Quelle öffnen</a>` : ''}</li>`).join('')}</ol>`;
}
function evidenceBlock(e){
  return `<div class="card" style="gap:10px">
    <div class="row between wrap"><h3 translate="no">${esc(e.name)}</h3></div>
    <div class="list">${(e.claims||[]).map(c => `<div class="li small"><div class="grow" translate="no">${esc(c.claim_de)}</div>${lvl(c.evidence)}</div>`).join('')}</div>
    <p class="small" translate="no">${esc(e.summary_de||'')}</p>
    ${e.dose_de ? `<div class="small"><span class="eyebrow">Dosis laut Studien und Fachstellen</span><p translate="no">${esc(e.dose_de)}</p></div>` : ''}
    ${e.safety_de ? `<div class="small"><span class="eyebrow">Sicherheit</span><p translate="no">${esc(e.safety_de)}</p></div>` : ''}
    <details class="faq"><summary>Quellen (${(e.sources||[]).length})</summary>${srcList(e.sources)}</details>
  </div>`;
}
const HRT = [
  ['Was ist eine Hormonersatztherapie?','Sie ersetzt das sinkende Östrogen. Frauen mit Gebärmutter erhalten zusätzlich ein Gestagen, meist mikronisiertes Progesteron, zum Schutz der Gebärmutterschleimhaut. Fachlich heisst sie auch Menopausale Hormontherapie (MHT).'],
  ['Welche Formen gibt es?','Östrogen über die Haut als Gel, Pflaster oder Spray, oder als Tablette. Bei Scheidentrockenheit gibt es lokale vaginale Östrogene in niedriger Dosis. Die Form beeinflusst das Risikoprofil, etwa für Thrombosen.'],
  ['Wobei kann sie helfen?','Sie ist die wirksamste Behandlung gegen Hitzewallungen und Nachtschweiss, schützt die Knochen und kann Schlaf, Stimmung und Scheidentrockenheit verbessern.'],
  ['Was muss ärztlich geklärt werden?','Deine persönliche Vorgeschichte, zum Beispiel Brustkrebs in der Familie, Thrombosen, Lebererkrankungen oder Migräne mit Aura. Ausserdem der Zeitpunkt: Das Nutzen-Risiko-Verhältnis ist meist am günstigsten bei Beginn vor 60 oder innerhalb von 10 Jahren nach der Menopause.'],
  ['Ist sie nicht gefährlich?','Eine grosse Studie aus dem Jahr 2002 hat viele Frauen verunsichert. Spätere Auswertungen zeigen ein differenzierteres Bild: Das Risiko hängt stark von Alter, Präparat, Form und Vorerkrankungen ab. Genau deshalb gehört die Entscheidung in ein ärztliches Gespräch.']
];

/* ---------- State ---------- */
const BOOT = (() => { try{ return JSON.parse(document.getElementById('sb-boot').dataset.boot); }catch(e){ return {mode:'demo', wear:null, ai:false}; } })();
const USER = BOOT.mode === 'user';
const KEY = 'second-bloom.demo.v2';
const fresh = () => ({profile:null, checkins:{}, food:{}, water:{}, supps:{}, mySupps:['d3k2','mag','omega3','kreatin'], workouts:{}, journal:[], lessons:{}, mental:{}, tab:'heute', foodTab:'heute', household:2, diet:'all', prefs:{avoid:[], dislike:[], like:[]}, plan:null, shop:[], coach:{}});
let S = (()=>{
  if(USER) return Object.assign(fresh(), BOOT.state || {});
  try{ const s = localStorage.getItem(KEY); return s ? Object.assign(fresh(), JSON.parse(s)) : fresh(); }catch(e){ return fresh(); }
})();
let WEAR = BOOT.wear || null;
// Speichern: Demo im Browser, Konto auf dem Server (gebündelt, 0,8 s nach der letzten Änderung)
function save(){
  if(!USER){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} return; }
  clearTimeout(save._t); save._t = setTimeout(pushState, 800);
}
async function pushState(){
  save._t = null;
  try{
    const r = await fetch('/api/state', {method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(S)});
    if(r.status === 401){ location.href = '/login'; return; }
    if(!r.ok) throw new Error();
  }catch(e){ toast('Nicht gespeichert. Prüfe die Verbindung, ich versuche es gleich nochmals.'); save._t = setTimeout(pushState, 8000); }
}
window.addEventListener('pagehide', () => {
  if(USER && save._t){ clearTimeout(save._t); save._t = null; try{ navigator.sendBeacon('/api/state', new Blob([JSON.stringify(S)], {type:'application/json'})); }catch(e){} }
});
async function refreshWear(){
  if(!USER) return;
  try{ const r = await fetch('/api/wear'); if(r.ok){ WEAR = await r.json(); render(); } }catch(e){}
}

const z = n => String(n).padStart(2,'0');
const dkey = d => d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());
const today = () => dkey(new Date());
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate()-n); return d; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt1 = n => n.toFixed(1).replace('.', ',');
const shortDate = d => z(d.getDate())+'.'+z(d.getMonth()+1)+'.';
const uid = () => Math.random().toString(36).slice(2,9);
const R = id => RECIPES.find(r=>r.id===id) || RECIPES[0];

// Phase aus dem Alter vorschlagen (Menopause im Mittel um 51); eine selbst gewählte Phase bleibt
const phaseForAge = (a) => a < 40 ? 'unsure' : a < 50 ? 'peri' : a < 53 ? 'meno' : 'post';
// BMI nur als grober Indikator (unterscheidet nicht zwischen Muskeln und Fett), neutral formuliert
const bmiOf = (w, h) => (w && h) ? Math.round(w / ((h/100) ** 2) * 10) / 10 : null;
const bmiNote = (b) => b == null ? '' : b < 18.5 ? 'unter dem Richtbereich (18,5–24,9)' : b < 25 ? 'im Richtbereich (18,5–24,9)' : b < 30 ? 'etwas über dem Richtbereich (18,5–24,9)' : 'über dem Richtbereich (18,5–24,9)';
const BMI_HINT = 'Nur ein grober Richtwert: Er unterscheidet nicht zwischen Muskeln und Fett. Ab der Lebensmitte sagt der Taillenumfang mehr aus.';
const bmiNum = (b) => String(b).replace('.', LANG === 'en' ? '.' : ',');
const MUSCLE_HINT = 'Bei viel Muskelmasse ist ein höherer BMI häufig unbedenklich. Aussagekräftiger ist der Taillenumfang.';
// Taille-zu-Grösse-Verhältnis (WHtR), Richtwerte nach NICE 2022: unter 0,5 günstig, 0,5–0,59 erhöht, ab 0,6 deutlich erhöht
const whtrOf = (waist, h) => (waist && h) ? Math.round(waist / h * 100) / 100 : null;
const whtrNote = (r) => r < 0.5 ? 'günstig (Taille unter der halben Körpergrösse)' : r < 0.6 ? 'erhöht (Richtwert unter 0,5)' : 'deutlich erhöht (Richtwert unter 0,5)';
const bmiHint = (b, muscular) => muscular && b >= 25 ? MUSCLE_HINT : BMI_HINT;
const bmiLine = (w, h, muscular, waist) => {
  const b = bmiOf(w, h); if(b == null) return '';
  const r = whtrOf(waist, h);
  return `<span>BMI ${bmiNum(b)}:</span> <span>${bmiNote(b)}</span>. <span>${bmiHint(b, muscular)}</span>`
    + (r ? `<br><span>Taille zu Grösse ${bmiNum(r)}:</span> <span>${whtrNote(r)}</span>.` : '');
};
let ob = {step:0, phaseManual:false, height:166, waist:null, muscular:false, name:(BOOT.user && BOOT.user.name) || 'Sandra', age:49, weight:68, household:2, phase:'peri', goals:['Besser schlafen','Stimmung stabilisieren','Konzentration im Job'], agree:false};
let draft = null, wDraft = null, breathTimer = null, sheetRender = null, confirmReset = false, recN = 2;
let cook = {photo:null, photoUrl:'', text:'', picks:[], servings:null, meal:'Abend', time:30, busy:false, result:null, err:'', note:'', ctl:null};
let planWish = '', planBusy = false;

/* ---------- KI über den eigenen Server (Haiku für Text, Sonnet nur für Fotos) ---------- */
let sampleFn = BOOT.ai ? true : null, imgOK = Boolean(BOOT.ai);
async function api(task, body, signal){
  const r = await fetch('/api/ai/' + task, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body), signal});
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw {status: r.status, message: j.error || 'Das hat nicht geklappt. Bitte nochmals versuchen.'};
  return j;
}
// Foto vor dem Senden verkleinern (max. 1024 px, JPEG): spart Tokens und Upload-Zeit
function shrink(file){
  return new Promise((res, rej) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1024 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', 0.8).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('Foto nicht lesbar')); };
    img.src = u;
  });
}

/* ---------- Icons ---------- */
const I = {
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/></svg>',
  dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12"/></svg>',
  mind:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/><path d="M9 12h1.5l1-2 1.5 4 1-2H15"/></svg>',
  body:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-6 4 4 5-7 4 5"/><path d="M3 21h18"/></svg>',
  pill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="m10 8.3 4.6 6.8"/></svg>',
  hormone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/></svg>',
  pot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  mark:'<img src="/frauenraum.webp?v=1" alt="" aria-hidden="true" class="mark" width="30" height="40">'
};

/* ---------- Helpers ---------- */
const proteinGoal = () => Math.round((S.profile?.weight || 68) * 1.4);
const proteinToday = () => (S.food[today()] || []).reduce((a,f)=>a+f.p, 0);
const tagClass = t => ({Training:'t-sage', Ernährung:'t-sun', Mental:'t-accent', Fokus:'t-sky', Schlaf:'t-sky', Körper:'t-sun', 'Check-in':'t-accent'})[t] || 't-sage';
const chip = (a, v, on, label) => `<button class="chip ${on?'on':''}" data-a="${a}" data-v="${esc(v)}">${esc(label ?? v)}</button>`;
const stepper = (name, val, label) => `<div class="stepper"><button data-a="step" data-v="${name}:-1" aria-label="${label||'Weniger'}: weniger">−</button><span class="val num">${val}</span><button data-a="step" data-v="${name}:1" aria-label="${label||'Mehr'}: mehr">+</button></div>`;
function ring(pct, text, color){
  const c = 2*Math.PI*26, off = c*(1-Math.min(1,pct));
  return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="bgc" cx="32" cy="32" r="26"/><circle cx="32" cy="32" r="26" style="stroke:${color}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle">${text}</text></svg>`;
}
function fmtQty(q, u){
  if(!q) return u || '';
  if(u==='g' || u==='ml'){
    const r = q>=100 ? Math.round(q/10)*10 : Math.max(5, Math.round(q/5)*5);
    return r>=1000 ? fmt1(r/1000).replace(',0','')+(u==='g'?' kg':' l') : r+' '+u;
  }
  const r = Math.max(0.5, Math.round(q*2)/2);
  const s = r%1 ? (r<1 ? '½' : Math.floor(r)+'½') : String(r);
  return s+' '+u;
}
const todayIdx = () => (new Date().getDay()+6)%7;
function todaysWorkout(){ const plan = WEEKPLAN[new Date().getDay()]; return WORKOUTS[plan] ? plan : null; }
const wt = () => (WEAR && WEAR.today && !WEAR.today.stale) ? WEAR.today : null;
const lowRecovery = () => { const t = wt(); return Boolean(t && t.recovery != null && t.recovery < 45); };
function lowDay(c){ return (c && (c.energy<=2 || c.sleep<=2)) || lowRecovery(); }
function lowMoodStreak(){ let n = 0; for(let i=0;i<7;i++){ const c = S.checkins[dkey(daysAgo(i))]; if(c && c.mood<=2) n++; } return n >= 4; }
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ t.hidden = true; }, 2400);
}
function copyText(text, onFail){
  try{ navigator.clipboard.writeText(text).then(()=>toast('Kopiert'), onFail); }catch(err){ onFail(); }
}

/* ---------- Plan & shopping list ---------- */
/* Unverträglichkeiten und Vorlieben: wirken auf Wochenplan, Tauschen, Rezepte, Einkaufsliste und KI */
const INTOL = {
  laktose:{n:'Laktose', re:/quark|skyr|joghurt|feta|hüttenkäse|milch|rahm/i, swap:(n)=>n.replace(/ \(.*\)$/,'') + ' (laktosefrei)', hint:'Laktosefreie Milchprodukte passen in alle Rezepte.'},
  gluten:{n:'Gluten', re:/haferflocken|vollkornbrot/i, swap:(n)=>/brot/i.test(n) ? 'Glutenfreies Brot' : n + ' (glutenfrei)', hint:'Brot und Haferflocken werden durch glutenfreie Varianten ersetzt.'},
  nuesse:{n:'Nüsse', re:/mandel|nuss|nüsse/i},
  soja:{n:'Soja', re:/tofu|edamame|soja/i},
  ei:{n:'Ei', re:/\beier\b/i},
  fisch:{n:'Fisch', re:/lachs|thunfisch|fisch/i},
  sesam:{n:'Sesam', re:/sesam/i},
  huelsen:{n:'Hülsenfrüchte', re:/linsen|kichererbsen|bohnen|edamame/i},
  histamin:{n:'Histamin', re:/feta|thunfisch|tomaten|spinat|avocado|sojasauce/i},
};
const prefs = () => (S.prefs ||= {avoid:[], dislike:[], like:[]});
const termHit = (terms, text) => terms.some(t => t.length >= 3 && text.toLowerCase().includes(t.toLowerCase()));
function prefsOK(r){
  const p = prefs(), text = r.n + ' ' + r.ing.map(i=>i.n).join(' ');
  for(const k of p.avoid){ const x = INTOL[k]; if(x && !x.swap && x.re.test(text)) return false; }
  return !termHit(p.dislike, text);
}
function dietOnly(r){ return S.diet==='veg' ? r.diet==='veg' : S.diet==='pesc' ? r.diet!=='meat' : true; }
function dietOK(r){ return dietOnly(r) && prefsOK(r); }
const liked = (r) => termHit(prefs().like, r.n + ' ' + r.ing.map(i=>i.n).join(' '));
// Zutat anpassen (laktosefrei, glutenfrei)
function ingName(n){ for(const k of prefs().avoid){ const x = INTOL[k]; if(x && x.swap && x.re.test(n)) return x.swap(n); } return n; }
function prefsSummary(){
  const p = prefs(), parts = [];
  if(p.avoid.length) parts.push('Ohne ' + p.avoid.map(k=>INTOL[k]?.n).filter(Boolean).join(', '));
  if(p.dislike.length) parts.push('nicht: ' + p.dislike.join(', '));
  if(p.like.length) parts.push('gern: ' + p.like.join(', '));
  return parts.join(' · ');
}
function aiPrefs(){ const p = prefs(); return {avoid: p.avoid.map(k=>INTOL[k]?.n).filter(Boolean), dislike: p.dislike, like: p.like}; }
function openBody(){
  const p = S.profile;
  openSheet('Körpermasse', () => `
    <div class="row">
      <label class="f" style="flex:1">Alter<input type="number" id="body-age" min="18" max="100" value="${p.age||''}"></label>
      <label class="f" style="flex:1">Grösse (cm)<input type="number" id="body-height" min="120" max="220" value="${p.height||''}"></label>
      <label class="f" style="flex:1">Gewicht (kg)<input type="number" id="body-weight" min="35" max="250" value="${p.weight||''}"></label>
    </div>
    <label class="f">Taillenumfang in cm (optional)<input type="number" id="body-waist" min="50" max="160" value="${p.waist||''}" placeholder="auf Nabelhöhe gemessen"></label>
    <label class="check"><input type="checkbox" id="body-muscular" ${p.muscular?'checked':''}> <span>Ich trainiere regelmässig Kraft oder bin muskulös</span></label>
    <p class="small muted" id="body-bmi">${bmiLine(p.weight, p.height, p.muscular, p.waist)}</p>
    <button class="btn accent block" data-a="body-save">Speichern</button>`);
}
function openPrefs(){
  openSheet('Unverträglichkeiten & Vorlieben', () => { const p = prefs(); return `
    <p class="small muted">Gilt für Wochenplan, Rezeptvorschläge, Kochen mit dem, was da ist, und die Einkaufsliste.</p>
    <div class="stack" style="gap:8px"><b>Ich vertrage nicht oder esse nicht</b>
      <div class="chips">${Object.entries(INTOL).map(([k,x])=>chip('pref-avoid', k, p.avoid.includes(k), x.n)).join('')}</div>
      ${p.avoid.filter(k=>INTOL[k].hint).map(k=>`<p class="small muted">${INTOL[k].hint}</p>`).join('')}
    </div>
    <label class="f">Mag ich nicht (mit Komma trennen)<input type="text" id="pref-dislike" value="${esc(p.dislike.join(', '))}" placeholder="z. B. Pilze, Koriander, Avocado"></label>
    <label class="f">Esse ich gern (mit Komma trennen)<input type="text" id="pref-like" value="${esc(p.like.join(', '))}" placeholder="z. B. Lachs, Linsen, Beeren"></label>
    <button class="btn accent block" data-a="pref-save">Speichern und Plan anpassen</button>`; });
}
function shuffle(a){ a = [...a]; for(let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function generatePlan(){
  const pick = (t) => { let x = RECIPES.filter(r=>r.type===t && dietOK(r)); if(x.length < (t==='M' ? 2 : 1)) { x = RECIPES.filter(r=>r.type===t && dietOnly(r)); generatePlan.relaxed = true; } return shuffle(x).sort((a,b)=>liked(b)-liked(a)); };
  generatePlan.relaxed = false;
  const B = pick('B'), M = pick('M');
  S.plan = {days:[...Array(7)].map((_,i)=>({B:B[i%B.length].id, L:M[(2*i)%M.length].id, D:M[(2*i+1)%M.length].id})), note:''};
}
function swapMeal(i, k){
  const d = S.plan.days[i], type = k==='B' ? 'B' : 'M';
  const opts = RECIPES.filter(r=>r.type===type && dietOK(r) && !Object.values(d).includes(r.id));
  if(opts.length) d[k] = opts[Math.floor(Math.random()*opts.length)].id;
}
function addToShop(items){
  items.forEach(x=>{
    const hit = S.shop.find(s=>!s.done && s.name===x.name && s.unit===x.unit && s.src===(x.src||'manual'));
    if(hit && x.qty) hit.qty += x.qty;
    else if(!hit) S.shop.push({id:uid(), name:x.name, qty:x.qty||0, unit:x.unit||'', cat:x.cat||C_X, done:false, src:x.src||'manual'});
  });
}
function buildShop(){
  const n = S.household, m = {};
  S.plan.days.forEach(d=>['B','L','D'].forEach(k=>R(d[k]).ing.forEach(i=>{
    const nm = ingName(i.n), key = nm+'|'+i.u;
    m[key] = m[key] || {name:nm, qty:0, unit:i.u, cat:i.c, src:'plan'};
    m[key].qty += i.q*n;
  })));
  S.shop = S.shop.filter(x=>x.src!=='plan');
  addToShop(Object.values(m));
}
function shopText(){
  const cats = [...CATS, ...new Set(S.shop.map(x=>x.cat).filter(c=>!CATS.includes(c)))];
  return 'Einkaufsliste · Second Bloom\n' + cats.map(c=>{
    const items = S.shop.filter(x=>x.cat===c && !x.done);
    return items.length ? '\n'+c+'\n'+items.map(x=>'- '+x.name+(fmtQty(x.qty,x.unit)?' ('+fmtQty(x.qty,x.unit)+')':'')).join('\n') : '';
  }).join('\n');
}

/* ---------- Recommendations ---------- */
function recommendations(){
  const c = S.checkins[today()], s = c ? c.symptoms : [], r = [];
  if(!c) r.push({tag:'Check-in', t:'Wie geht es dir heute?', x:'Eine Minute Check-in, danach passe ich Training, Ernährung und Übungen an deinen Tag an.', go:'checkin', cta:'Starten'});
  const w = todaysWorkout();
  if(lowDay(c)) r.push({tag:'Training', t:'Sanfte Einheit statt Vollgas', x:(lowRecovery() ? 'Deine Uhr zeigt wenig Erholung' + (wt().reasons.length ? ' (' + wt().reasons.slice(0,2).join(', ') + ')' : '') + '.' : 'Wenig Schlaf oder Energie.') + ' Heute 2 statt 3 Sätze und etwas leichtere Gewichte. Bewegung hilft trotzdem.', go:w?'workout:'+w:'tab:training', cta:'Training'});
  else if(w) r.push({tag:'Training', t:WORKOUTS[w].n+' · '+WORKOUTS[w].min+' Min.', x:WORKOUTS[w].focus+'. Krafttraining schützt Muskeln und Knochen, wenn das Östrogen sinkt.', go:'workout:'+w, cta:'Los'});
  else r.push({tag:'Training', t:'Aktive Erholung', x:'30 Minuten zügig spazieren, am besten draussen bei Tageslicht. Das hebt Stimmung und Schlafqualität.', go:'tab:training', cta:'Wochenplan'});
  if(wt() && wt().unrest && !(c && (s.includes('Nachtschweiss') || s.includes('Hitzewallungen'))))
    r.push({tag:'Schlaf', t:'Unruhige Nacht erkannt', x:wt().unrest.text + ' Kühles Schlafzimmer, Wechselshirt bereitlegen, abends kein Alkohol. Trag es im Check-in ein, dann lernt die App deine Muster.', go:'checkin', cta:'Eintragen'});
  if(c && (c.sleep<=2 || s.includes('Schlafstörung') || s.includes('Nachtschweiss')))
    r.push({tag:'Schlaf', t:'Heute Abend: 4-7-8-Atmung', x:'Kein Koffein nach 12 Uhr, Alkohol heute meiden, Schlafzimmer kühl halten. Magnesium am Abend kann unterstützen.', go:'ex:478', cta:'Übung'});
  if(c && (c.mood<=2 || ['Reizbarkeit','Stimmungsschwankungen','Dünnhäutigkeit','Unruhe / Angst'].some(x=>s.includes(x))))
    r.push({tag:'Mental', t:'STOPP, wenn es hochkocht', x:'Deine Dünnhäutigkeit hat eine körperliche Ursache. Diese 2-Minuten-Technik schafft Abstand zwischen Reiz und Reaktion.', go:'ex:stopp', cta:'Übung'});
  if(c && (c.focus<=2 || s.includes('Brain Fog')))
    r.push({tag:'Fokus', t:'Klarer Kopf in 3 Schritten', x:'Ein grosses Glas Wasser, 5 Minuten an die frische Luft, dann 25 Minuten an genau einer Aufgabe. Wichtiges auf dein klarstes Zeitfenster legen.', go:'prog:fokus', cta:'Programm'});
  if(s.includes('Hitzewallungen'))
    r.push({tag:'Körper', t:'Hitzewallungen abfedern', x:'Zwiebellook, kühles Getränk griffbereit. Beobachte, ob Alkohol, Scharfes oder heisse Getränke Auslöser sind. Langsame Atmung zu Beginn einer Welle kann sie abschwächen.', go:'ex:box', cta:'Atemübung'});
  if(c && (c.energy<=2 || s.includes('Kraftlosigkeit')))
    r.push({tag:'Ernährung', t:'30 g Protein zum Frühstück', x:'Stabilisiert Blutzucker und Energie bis mittags, zum Beispiel mit der Leinsamen-Quark-Bowl.', go:'recipe:bowl', cta:'Rezept'});
  else if(S.plan){ const d = S.plan.days[todayIdx()]; r.push({tag:'Ernährung', t:'Heute Abend: '+R(d.D).n, x:'Aus deinem Wochenplan. '+R(d.D).p+' g Protein pro Portion, '+R(d.D).min+' Minuten.', go:'recipe:'+d.D, cta:'Rezept'}); }
  if(c && c.mood>=4 && c.energy>=4)
    r.push({tag:'Mental', t:'Ein guter Tag. Halte ihn fest.', x:'Notiere drei Dinge, die heute gut sind. An schwierigeren Tagen kannst du sie nachlesen.', go:'tab:mental', cta:'Notieren'});
  return r.slice(0,5);
}

/* ---------- Render: shell ---------- */
const TABS = [['heute','Heute',I.sun],['ernaehrung','Ernährung',I.leaf],['training','Training',I.dumbbell],['mental','Mental',I.mind],['koerper','Körper',I.body]];
function render(){
  const main = document.getElementById('main'), top = document.getElementById('top'), tabs = document.getElementById('tabs');
  const scroll = main.scrollTop;
  document.getElementById('app').classList.toggle('onb', !S.profile);
  if(!S.profile){
    top.innerHTML = `<div class="brand">${I.mark} Second Bloom</div><div class="progress-dots">${[0,1,2].map(i=>`<i class="${i<=ob.step?'on':''}"></i>`).join('')}</div>`;
    tabs.hidden = true; main.innerHTML = renderOnboarding(); return;
  }
  tabs.hidden = false;
  top.innerHTML = `<div class="brand">${I.mark} Second Bloom</div>${USER ? `<a class="avatar" href="/konto" aria-label="Konto und Geräte">${esc((S.profile.name||'S').charAt(0).toUpperCase())}</a>` : `<a class="btn sm accent" href="/register">Konto erstellen</a>`}`;
  tabs.innerHTML = TABS.map(([id,l,ic])=>`<button data-a="tab" data-v="${id}" ${S.tab===id?'aria-current="page"':''}>${ic}${l}</button>`).join('');
  main.innerHTML = ({heute:renderToday, ernaehrung:renderFood, training:renderTraining, mental:renderMental, koerper:renderBody})[S.tab]();
  main.scrollTop = scroll;
}

/* ---------- Onboarding ---------- */
function renderOnboarding(){
  if(ob.step===0) return `
    <div class="hero-ob">
      <div class="kicker">Perimenopause · Menopause · danach</div>
      <div class="word">Second Bloom</div>
      <p class="lede">Deine zweite Lebenshälfte.<br>Klar, ruhig, begleitet.</p>
      <p class="muted">Ernährung, Krafttraining, Mikronährstoffe, Hormonwissen und tägliches Mental Coaching. Abgestimmt auf deine Phase und deinen Tag.</p>
      <div class="meta-row"><span>Körper</span><b>·</b><span>Kopf</span><b>·</b><span>Alltag</span></div>
    </div>
    <div class="pillars">
      ${[['Ernährung',I.leaf,'t-sun'],['Kraft',I.dumbbell,'t-sage'],['Mikro­nährstoffe',I.pill,'t-sky'],['Hormone',I.hormone,'t-sun'],['Psyche',I.mind,'t-accent']].map(([l,ic,c])=>`<div class="pillar"><i class="${c}">${ic}</i>${l}</div>`).join('')}
    </div>
    <div class="card flat"><p class="small"><b>So funktioniert’s:</b> Jeden Tag ein kurzer Check-in zu Stimmung, Energie, Schlaf und Fokus. Daraus entsteht dein Tagesplan. Dazu Wochenpläne fürs Essen, eine Einkaufsliste und Rezeptideen aus dem, was gerade im Kühlschrank ist.</p></div>
    <button class="btn accent block" data-a="ob-next">Los geht’s</button>
    <p class="disclaimer">${USER ? 'Deine Eingaben werden sicher in deinem Konto gespeichert.' : 'Demo: Deine Eingaben bleiben nur in diesem Browser gespeichert.'}</p>`;
  if(ob.step===1) return `
    <div class="stack"><span class="eyebrow">Schritt 1 von 2</span><h1>Erzähl mir von dir</h1></div>
    <label class="f">Vorname<input type="text" id="ob-name" value="${esc(ob.name)}" autocomplete="given-name"></label>
    <div class="row">
      <label class="f" style="flex:1">Alter<input type="number" id="ob-age" min="35" max="80" value="${ob.age}"></label>
      <label class="f" style="flex:1">Grösse (cm)<input type="number" id="ob-height" min="130" max="210" value="${ob.height}"></label>
      <label class="f" style="flex:1">Gewicht (kg)<input type="number" id="ob-weight" min="40" max="160" value="${ob.weight}"></label>
    </div>
    <div class="row">
      <label class="f" style="flex:1">Taillenumfang in cm (optional)<input type="number" id="ob-waist" min="50" max="160" value="${ob.waist||''}" placeholder="auf Nabelhöhe gemessen"></label>
      <label class="check" style="flex:1;align-self:end"><input type="checkbox" id="ob-muscular" ${ob.muscular?'checked':''}> <span>Ich trainiere regelmässig Kraft oder bin muskulös</span></label>
    </div>
    <p class="small muted" id="ob-bmi">${bmiLine(ob.weight, ob.height, ob.muscular, ob.waist)}</p>
    <p class="small muted">Das Gewicht brauche ich auch für dein Proteinziel (1,4 g pro kg Körpergewicht).</p>
    <div class="row between"><b class="small">Für wie viele Personen kochst du meistens?</b>${stepper('ob-hh', ob.household, 'Personen')}</div>
    <div class="stack"><b class="small">In welcher Phase bist du?</b><span class="small muted">Vorschlag nach deinem Alter. Tippe an, was für dich passt.</span>
      ${Object.entries(PHASES).map(([k,p])=>`<button class="radio ${ob.phase===k?'on':''}" data-a="ob-phase" data-v="${k}"><b>${p.name}</b><span>${p.desc}</span></button>`).join('')}
    </div>
    <div class="row"><button class="btn ghost" data-a="ob-back">Zurück</button><button class="btn accent" style="flex:1" data-a="ob-next">Weiter</button></div>`;
  return `
    <div class="stack"><span class="eyebrow">Schritt 2 von 2</span><h1>Was ist dir gerade am wichtigsten?</h1><p class="muted small">Wähle so viele, wie du möchtest.</p></div>
    <div class="chips">${GOALS.map(g=>chip('ob-goal', g, ob.goals.includes(g))).join('')}</div>
    <div class="stack" style="gap:8px"><b class="small">Unverträglichkeiten oder was du nicht isst</b>
      <div class="chips">${Object.entries(INTOL).map(([k,x])=>chip('ob-avoid', k, prefs().avoid.includes(k), x.n)).join('')}</div>
      <p class="small muted">Vorlieben und Abneigungen kannst du später unter Ernährung ergänzen.</p></div>
    <div class="card flat">
      <h3>Gut zu wissen</h3>
      <p class="small">Second Bloom ist ein Lifestyle-Begleiter und ersetzt keine ärztliche Beratung. Fragen zu Hormonersatztherapie, Medikamenten und Nahrungsergänzung besprich bitte immer mit deiner Ärztin oder deinem Arzt.</p>
      <label class="check"><input type="checkbox" id="ob-agree" ${ob.agree?'checked':''} data-a="ob-agree"> <span>${USER ? 'Verstanden.' : 'Verstanden. Ich möchte die Demo mit Beispieldaten der letzten zwei Wochen starten.'}</span></label>
    </div>
    <div class="row"><button class="btn ghost" data-a="ob-back">Zurück</button><button class="btn accent" style="flex:1" data-a="ob-finish" ${ob.agree?'':'disabled'}>Second Bloom starten</button></div>`;
}
function seedExamples(){
  const pattern = [[3,3,2,3,['Schlafstörung','Brain Fog']],[2,2,2,2,['Reizbarkeit','Nachtschweiss']],[3,3,3,3,['Hitzewallungen']],[4,3,4,4,[]],[2,2,1,2,['Schlafstörung','Dünnhäutigkeit','Kraftlosigkeit']],[3,4,3,3,['Hitzewallungen']],[4,4,4,4,[]],[3,2,2,3,['Nachtschweiss','Brain Fog']],[2,3,3,2,['Stimmungsschwankungen']],[3,3,3,3,['Gelenkschmerzen']],[4,4,3,4,['Hitzewallungen']],[3,2,2,2,['Schlafstörung','Reizbarkeit']],[4,4,4,3,[]]];
  for(let i=13;i>=1;i--){
    const p = pattern[13-i], k = dkey(daysAgo(i));
    S.checkins[k] = {mood:p[0], energy:p[1], sleep:p[2], focus:p[3], symptoms:p[4], period:S.profile.phase==='peri' && (i===11||i===10||i===9), ex:true};
    const wd = daysAgo(i).getDay();
    if(['A','B','C'].includes(WEEKPLAN[wd]) && i!==12) S.workouts[k] = [WEEKPLAN[wd]];
  }
}

/* ---------- Heute ---------- */
function renderToday(){
  const c = S.checkins[today()], h = new Date().getHours();
  const greet = h<11?'Guten Morgen':h<17?'Hallo':'Guten Abend';
  const dateStr = new Date().toLocaleDateString(LOC,{weekday:'long', day:'numeric', month:'long'});
  const imp = IMPULSES[Math.floor(Date.now()/864e5) % IMPULSES.length];
  const p = proteinToday(), g = proteinGoal(), water = S.water[today()]||0;
  const mine = S.mySupps, taken = (S.supps[today()]||[]).filter(x=>mine.includes(x)).length;
  const ex = pickExercise();
  return `
    <div class="stack" style="gap:4px">
      <span class="eyebrow">${dateStr} · ${PHASES[S.profile.phase].name}</span>
      <h1>${greet}, <em>${esc(S.profile.name)}</em>.</h1>
    </div>
    <div class="impulse"><span class="eyebrow">Impuls des Tages</span><p class="q">„${imp}“</p></div>
    ${lowMoodStreak()?helpBanner():''}
    <div class="col">
    ${dayNoteCard(c)}
    ${c ? `<div class="card">
      <div class="row between"><h2>Dein Check-in</h2><button class="link" data-a="checkin">Bearbeiten</button></div>
      <div class="metrics" style="grid-template-columns:repeat(4,1fr)">${SCALES.map(sc=>`<div class="metric" style="background:var(--surface-2)"><span class="lbl">${sc.short}</span><b style="font-family:var(--font-display);font-weight:500;color:var(--head);font-size:22px">${c[sc.id]}<span class="muted small">/5</span></b></div>`).join('')}</div>
      ${c.symptoms.length?`<div class="chips">${c.symptoms.map(s=>`<span class="tag t-accent">${s}</span>`).join('')}</div>`:''}
    </div>` : ''}
    <div class="card">
      <div><span class="eyebrow">Auf dich abgestimmt</span><h2>Dein Plan für <em>heute</em></h2></div>
      <div>${recommendations().map(r=>`<div class="reco"><div><span class="tag ${tagClass(r.tag)}">${r.tag}</span><h3>${r.t}</h3></div><button class="btn sm ${r.go==='checkin'?'accent':'ghost'}" data-a="go" data-v="${r.go}">${r.cta}</button><p class="txt">${r.x}</p></div>`).join('')}</div>
    </div>
    ${recoveryMini()}
    </div>
    <div class="col">
    <div class="metrics">
      <button class="metric" data-a="go" data-v="food:heute">${ring(p/g, p+'g', 'var(--salbei)')}<span class="lbl">Protein</span><span class="val">${p} / ${g} g</span></button>
      <div class="metric">${ring(water/8, water, 'var(--sky)')}<span class="lbl">Gläser Wasser</span>${stepper('water', water+'/8', 'Wasser')}</div>
      <button class="metric" data-a="tab" data-v="koerper">${ring(mine.length?taken/mine.length:0, taken+'/'+mine.length, 'var(--accent)')}<span class="lbl">Supplements</span><span class="val">heute</span></button>
    </div>
    <div class="tiles">
      <button class="tile" data-a="go" data-v="food:kochen">${I.camera}<b>Was koche ich jetzt?</b><span class="small muted">Foto vom Kühlschrank, Rezept in Sekunden</span></button>
      <button class="tile" data-a="go" data-v="food:woche">${I.calendar}<b>Wochenplan & Einkauf</b><span class="small muted">${S.shop.filter(x=>!x.done).length} Artikel auf der Liste</span></button>
    </div>
    <div class="orn">· · ·</div>
    <div class="card flat">
      <div class="row between"><h3>Mini-Übung für zwischendurch</h3><span class="muted small">${EXERCISES[ex].min} Min.</span></div>
      <p class="small muted">${EXERCISES[ex].for}</p>
      <button class="btn line" data-a="go" data-v="ex:${ex}">${EXERCISES[ex].n} starten</button>
    </div>
    </div>`;
}
function pickExercise(){
  const c = S.checkins[today()];
  if(!c) return 'box';
  if(c.mood<=2 || c.symptoms.includes('Reizbarkeit')) return 'stopp';
  if(c.symptoms.includes('Unruhe / Angst') || c.symptoms.includes('Herzklopfen')) return 'erdung';
  if(c.energy<=2) return 'scan';
  if(c.sleep<=2) return '478';
  return 'box';
}
function helpBanner(){
  return `<div class="banner"><b>Deine Stimmung war an mehreren Tagen sehr tief.</b>
    <p class="small">Das kann mit den Hormonen zusammenhängen, aber auch eine Depression kann dahinterstecken. Bitte sprich mit deiner Ärztin, deinem Arzt oder einer Psychotherapeutin. Du musst da nicht allein durch.</p>
    <button class="link" data-a="help">Hilfe und Notfallnummern</button></div>`;
}
function helpContent(){
  return `<p>Wenn du dich in einer akuten Krise befindest oder an Suizid denkst, wende dich bitte sofort an eine dieser Stellen. Sie sind kostenlos, anonym und rund um die Uhr erreichbar.</p>
  <div class="card"><div class="hotline">
    <span>Schweiz</span><b>143</b>
    <span>Liechtenstein</span><b>143</b>
    <span>Deutschland</span><b>0800 111 0 111</b>
    <span>Österreich</span><b>142</b>
    <span>Notruf (EU, CH, LI)</span><b>112</b>
  </div></div>
  <p class="small muted">Second Bloom bietet Mental Coaching und Selbsthilfe-Übungen. Das ersetzt keine Psychotherapie und keine ärztliche Behandlung.</p>`;
}

/* ---------- Check-in ---------- */
function openCheckin(){
  const c = S.checkins[today()];
  draft = c ? JSON.parse(JSON.stringify(c)) : {mood:0, energy:0, sleep:0, focus:0, symptoms:[], period:false};
  openSheet('Check-in heute', ()=>`
    ${wt() && wt().unrest ? `<div class="banner"><b>Hinweis deiner Uhr</b><p class="small">${esc(wt().unrest.text)} Hattest du Nachtschweiss oder Hitzewallungen?</p></div>` : ''}
    ${SCALES.map(sc=>`<div class="stack" style="gap:6px"><b>${sc.label}</b>
      <div class="scale">${[1,2,3,4,5].map(n=>`<button class="${draft[sc.id]===n?'on':''}" data-a="ci-scale" data-v="${sc.id}:${n}" aria-label="${sc.label} ${n}">${n}</button>`).join('')}</div>
      <div class="scale-ends"><span>${sc.lo}</span><span>${sc.hi}</span></div></div>`).join('')}
    <div class="stack" style="gap:8px"><b>Was spürst du heute?</b>
      <div class="chips">${SYMPTOMS.map(s=>chip('ci-sym', s, draft.symptoms.includes(s))).join('')}</div></div>
    ${['peri','unsure'].includes(S.profile.phase)?`<label class="check"><input type="checkbox" data-a="ci-period" ${draft.period?'checked':''}> <span>Ich habe heute meine Periode oder Blutungen</span></label>`:''}
    <button class="btn accent block" data-a="ci-save" ${SCALES.every(sc=>draft[sc.id])?'':'disabled'}>Speichern und Tagesplan anpassen</button>`);
}

/* ---------- Ernährung ---------- */
function renderFood(){
  const open = S.shop.filter(x=>!x.done).length;
  const tabs = [['heute','Heute'],['kochen','Kochen'],['woche','Woche'],['einkauf','Einkauf']];
  return `
    <div class="stack" style="gap:4px"><span class="eyebrow">Proteinreich und hormonfreundlich</span><h1>Ernährung</h1></div>
    <div class="seg" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${S.foodTab===k}" data-a="ftab" data-v="${k}">${l}${k==='einkauf'&&open?`<span class="badge">${open}</span>`:''}</button>`).join('')}</div>
    ${({heute:renderFoodToday, kochen:renderCook, woche:renderWeek, einkauf:renderShop})[S.foodTab]()}`;
}
function renderFoodToday(){
  const items = S.food[today()]||[], p = proteinToday(), g = proteinGoal();
  const d = S.plan ? S.plan.days[todayIdx()] : null;
  return `
    <div class="card">
      <div class="row between"><h2>Protein heute</h2><b style="font-family:var(--font-display);font-weight:500;color:var(--head);font-size:24px" class="num">${p}<span class="muted small"> / ${g} g</span></b></div>
      <div class="bar"><i style="width:${Math.min(100,p/g*100)}%"></i></div>
      <p class="small muted">${p>=g?'Ziel erreicht. Deine Muskeln haben heute alles, was sie brauchen.':`Noch ${g-p} g. Am besten 25–35 g pro Mahlzeit.`}</p>
      ${items.length?`<div class="list">${items.map((f,i)=>`<div class="li"><div class="grow"><b class="small">${esc(f.n)}</b></div><span class="num small">${f.p} g</span><button class="x" data-a="food-del" data-v="${i}" aria-label="Entfernen">✕</button></div>`).join('')}</div>`:''}
    </div>
    ${d?`<div class="card">
      <div class="row between"><h2>Heute im Plan</h2><button class="link" data-a="ftab" data-v="woche">Ganze Woche</button></div>
      <div class="list">${['B','L','D'].map(k=>{ const r = R(d[k]); return `<div class="li"><span class="meal">${MEALS[k]}</span><button class="grow" style="text-align:left" data-a="recipe" data-v="${r.id}"><b class="small">${r.n}</b><div class="small muted">${r.p} g Protein · ${r.min} Min.</div></button><button class="btn sm ghost" data-a="recipe-log" data-v="${r.id}">Gegessen</button></div>`; }).join('')}</div>
    </div>`:''}
    <div class="section-head"><h2>Schnell hinzufügen</h2></div>
    <div class="foodgrid">${FOODS.map((f,i)=>`<button class="food" data-a="food-add" data-v="${i}"><b>${f.n}</b><span>${f.a}</span><em>+${f.p} g</em></button>`).join('')}</div>
    <div class="card flat">
      <h3>Die vier Grundregeln</h3>
      <div class="list">
        <div class="li"><div class="grow small"><b>Protein zu jeder Mahlzeit.</b> 1,2–1,6 g pro kg Körpergewicht erhalten Muskeln, die ab 40 schneller abgebaut werden.</div></div>
        <div class="li"><div class="grow small"><b>Ballaststoffe, 25–30 g pro Tag.</b> Gut für Darm, Blutzucker und den Abbau von Östrogen.</div></div>
        <div class="li"><div class="grow small"><b>Phytoöstrogene.</b> Leinsamen, Soja und Hülsenfrüchte können Beschwerden bei manchen Frauen etwas lindern.</div></div>
        <div class="li"><div class="grow small"><b>Blutzucker ruhig halten.</b> Wenig Zucker und Alkohol. Beides verstärkt Hitzewallungen, Schlafprobleme und Stimmungstiefs.</div></div>
      </div>
      ${USER ? `<p class="small muted">Studienlage: <a href="/quellen#protein" target="_blank">Protein</a> · <a href="/quellen#isoflavones" target="_blank">Phytoöstrogene</a></p>` : ''}
    </div>`;
}

/* Kochen: fridge photo or typed ingredients -> one recipe */
function renderCook(){
  const n = cook.servings ?? S.household;
  return `
    <div class="card">
      <div><span class="eyebrow">Spontan kochen</span><h2>Was ist im <em>Kühlschrank</em>?</h2></div>
      <p class="small muted">${sampleFn ? (imgOK ? 'Foto machen oder eintippen, was da ist.' : 'Tippe ein oder wähle aus, was da ist.')+' Claude schlägt dir eine proteinreiche, hormonfreundliche Mahlzeit vor.' : 'Tippe ein oder wähle aus, was da ist. Ich suche das passende Rezept aus der Second-Bloom-Bibliothek.'}</p>
      ${sampleFn && imgOK ? `<label class="photo">${cook.photoUrl?`<img src="${cook.photoUrl}" alt="Dein Foto vom Kühlschrank">`:`${I.camera}<span><b>Foto vom Kühlschrank</b><br><span class="small muted">oder vom Vorratsschrank, Gemüsefach, Einkauf</span></span>`}<input type="file" id="cook-photo" class="vh" accept="image/jpeg,image/png,image/webp,image/gif"></label>${cook.photoUrl?`<button class="link" data-a="cook-photo-del">Foto entfernen</button>`:''}` : ''}
      <label class="f">${sampleFn && imgOK ? 'Zusätzlich oder statt Foto' : 'Zutaten'}<textarea id="cook-text" placeholder="z. B. 3 Eier, halbe Zucchini, Feta, Rest Linsen">${esc(cook.text)}</textarea></label>
      <div class="chips">${PICKS.map(p=>chip('cook-pick', p, cook.picks.includes(p))).join('')}</div>
      <div class="row between"><b class="small">Für wie viele Personen?</b>${stepper('cook-n', n, 'Personen')}</div>
      <div class="row between wrap"><span class="small muted">${esc(prefsSummary() || 'Keine Unverträglichkeiten hinterlegt.')}</span><button class="link" data-a="prefs">Anpassen</button></div>
      <div class="stack" style="gap:6px"><b class="small">Mahlzeit</b><div class="chips">${['Frühstück','Mittag','Abend','Snack'].map(m=>chip('cook-meal', m, cook.meal===m)).join('')}</div></div>
      <div class="stack" style="gap:6px"><b class="small">Zeit</b><div class="chips">${[15,30,45].map(t=>chip('cook-time', t, cook.time===t, 'bis '+t+' Min.')).join('')}</div></div>
      <button class="btn accent block" data-a="cook-go" ${cook.busy?'disabled':''}>${cook.busy?'Einen Moment …':'Mahlzeit vorschlagen'}</button>
    </div>
    ${renderCookOut()}`;
}
function renderCookOut(){
  if(cook.busy) return `<div class="card"><div class="thinking"><span class="pulse"></span><div class="grow"><b>${cook.photo?'Claude schaut in deinen Kühlschrank …':'Claude stellt dein Rezept zusammen …'}</b><p class="small muted">Das dauert meist 10 bis 30 Sekunden.</p></div><button class="btn sm line" data-a="cook-stop">Stopp</button></div></div>`;
  if(cook.err) return `<div class="banner"><b>Das hat nicht geklappt.</b><p class="small">${esc(cook.err)}</p></div>`;
  if(!cook.result) return '';
  return recipeResult(cook.result, cook.note);
}
function recipeResult(x, note){
  const missing = x.ingredients.filter(i=>!i.have);
  return `<div class="card">${note?`<p class="ai-note">${esc(note)}</p>`:''}
    <div class="stack" style="gap:6px"><span class="eyebrow">${x.source==='ai'?'Von Claude für dich':'Aus der Bibliothek'} · ${x.servings} ${x.servings===1?'Person':'Personen'}</span><h2>${esc(x.title)}</h2></div>
    <div class="row wrap">${x.protein?`<span class="tag t-sage">ca. ${x.protein} g Protein p. P.</span>`:''}${x.minutes?`<span class="tag t-sun">${x.minutes} Min.</span>`:''}${missing.length?`<span class="tag t-accent">${missing.length} fehlt</span>`:`<span class="tag t-sage">alles da</span>`}</div>
    ${x.detected.length?`<p class="small muted"><b>Erkannt:</b> ${x.detected.map(esc).join(', ')}</p>`:''}
    ${x.why?`<p class="small">${esc(x.why)}</p>`:''}
    <div><h3>Zutaten</h3><div class="list">${x.ingredients.map(i=>`<div class="li small"><span class="dotmark ${i.have?'have':'miss'}"></span><div class="grow">${esc(i.item)}${i.have?'':' <span class="muted">· fehlt</span>'}</div><span class="num muted">${esc(i.amount)}</span></div>`).join('')}</div></div>
    <div><h3>Zubereitung</h3><div class="list">${x.steps.map((s,k)=>`<div class="li small"><b class="num" style="color:var(--accent);font-family:var(--font-display);font-size:17px">${k+1}</b><div class="grow">${esc(s)}</div></div>`).join('')}</div></div>
    ${x.tip?`<p class="small muted"><b>Tipp:</b> ${esc(x.tip)}</p>`:''}
    <div class="row wrap">
      ${missing.length?`<button class="btn sm line" data-a="cook-missing">Fehlendes auf Einkaufsliste</button>`:''}
      ${x.protein?`<button class="btn sm accent" data-a="cook-log">Gegessen: ${x.protein} g eintragen</button>`:''}
      <button class="btn sm ghost" data-a="cook-again">Andere Idee</button>
    </div>
  </div>`;
}
const toks = s => s.toLowerCase().split(/[^a-zäöüéèàß]+/).filter(t=>t.length>3);
function has(words, name){ const a = toks(words), b = toks(name); return b.some(x=>a.some(y=>x.startsWith(y.slice(0,5)) || y.startsWith(x.slice(0,5)))); }
function libResult(r, n, words){
  return {source:'lib', libId:r.id, title:r.n, minutes:r.min, servings:n, protein:r.p, why:r.why, tip:'', detected:[], steps:r.steps,
    ingredients:r.ing.map(i=>({item:ingName(i.n), amount:fmtQty(i.q*n,i.u), q:i.q*n, u:i.u, have: !i.q || (words===null ? true : has(words, i.n)), cat:i.c}))};
}
function localCook(words, n, avoid){
  const type = cook.meal==='Mittag' || cook.meal==='Abend' ? 'M' : 'B';
  let best = null, score = -1;
  RECIPES.filter(r=>r.type===type && dietOK(r) && r.min<=cook.time+5 && r.id!==avoid).forEach(r=>{
    const s = r.ing.filter(i=>i.q && has(words, i.n)).length + (liked(r) ? 0.8 : 0) + Math.random()*0.6;
    if(s>score){ best = r; score = s; }
  });
  return libResult(best || RECIPES.find(r=>r.type===type && r.id!==avoid) || RECIPES[0], n, words);
}
function cookPromptUnused(words, n){
  return `Du bist Ernährungscoach für Frauen in der Perimenopause und Menopause. Schlage EIN Rezept vor.
Sprache: Deutsch mit Schweizer Rechtschreibung (ss statt ß).
Mahlzeit: ${cook.meal}. Personen: ${n}. Zeit: höchstens ${cook.time} Minuten.
Ernährungsweise: ${({all:'alles',pesc:'pescetarisch',veg:'vegetarisch'})[S.diet]}.
Vorhandene Zutaten: ${words || 'keine Angabe'}.${cook.photo ? '\nDas Foto zeigt den Kühlschrank oder Vorrat der Nutzerin. Erkenne die Lebensmittel darauf und nutze sie bevorzugt.' : ''}
Regeln: mindestens 25 g Protein pro Portion; hormonfreundlich (Ballaststoffe, wenn passend Phytoöstrogene wie Leinsamen, Soja oder Hülsenfrüchte, gesunde Fette, wenig Zucker, kein Alkohol). Nutze möglichst nur Vorhandenes. Öl, Salz, Pfeffer und Grundgewürze darfst du voraussetzen. Markiere Zutaten, die fehlen, mit "have": false. Mengen gelten für alle ${n} Personen zusammen.
Antworte nur mit JSON in genau dieser Form:
{"title": "…", "minutes": 20, "proteinPerServing": 30, "why": "1–2 Sätze, warum das hormonfreundlich ist", "detected": ["erkannte Zutat", "…"], "ingredients": [{"item": "Eier", "amount": "6 Stk", "have": true}], "steps": ["…", "…"], "tip": "ein kurzer Tipp"}`;
}
function normalizeAI(r, n){
  if(!r || typeof r!=='object' || !Array.isArray(r.ingredients) || !Array.isArray(r.steps) || !r.steps.length) throw {code:'bad_shape'};
  return {source:'ai', title:String(r.title||'Dein Rezept'), minutes:Math.round(+r.minutes)||null, servings:n, protein:Math.round(+r.proteinPerServing)||null,
    why:String(r.why||''), tip:String(r.tip||''), detected:(Array.isArray(r.detected)?r.detected:[]).map(String).slice(0,24),
    ingredients:r.ingredients.slice(0,24).map(x=>({item:String(x.item||x.name||''), amount:String(x.amount||''), have:x.have!==false, cat:C_X})).filter(x=>x.item),
    steps:r.steps.map(String).slice(0,12)};
}
async function cookGo(again){
  const el = document.getElementById('cook-text'); if(el) cook.text = el.value;
  const words = [cook.text.trim(), ...cook.picks].filter(Boolean).join(', ');
  if(!words && !cook.photo){ toast('Füge ein Foto oder ein paar Zutaten hinzu.'); return; }
  const n = cook.servings ?? S.household;
  cook.err = ''; cook.note = '';
  if(!sampleFn){ cook.result = localCook(words, n, again && cook.result ? cook.result.libId : null); render(); return; }
  cook.busy = true; cook.result = null; cook.ctl = new AbortController(); render();
  try{
    const image = cook.photo && imgOK ? await shrink(cook.photo) : null;
    const r = await api('cook', {words, meal: cook.meal, time: cook.time, servings: n, diet: S.diet, prefs: aiPrefs(), image, again: Boolean(again)}, cook.ctl.signal);
    cook.result = normalizeAI(r, n);
  }catch(e){
    if(e && e.name === 'AbortError'){ }
    else if(e && e.status === 503){ sampleFn = null; imgOK = false; cook.result = words ? localCook(words, n) : null; cook.note = e.message + ' Hier ein passendes Rezept aus der Bibliothek.'; if(!words) cook.err = e.message + ' Tippe ein paar Zutaten ein.'; }
    else if(words){ cook.result = localCook(words, n); cook.note = (e && e.message ? e.message + ' ' : '') + 'Hier ein passendes Rezept aus der Bibliothek.'; }
    else cook.err = (e && e.message) || 'Das hat nicht geklappt. Bitte nochmals versuchen.';
  }
  cook.busy = false; cook.ctl = null; render();
}

/* Wochenplan */
function renderWeek(){
  if(!S.plan){ generatePlan(); save(); }
  const days = weekDates(), n = S.household;
  return `
    <div class="card">
      <div><span class="eyebrow">Wochenplan</span><h2>Deine Woche auf dem <em>Teller</em></h2></div>
      <div class="row between"><b class="small">Personen im Haushalt</b>${stepper('hh', n, 'Personen')}</div>
      <div class="chips">${DIETS.map(([k,l])=>chip('diet', k, S.diet===k, l)).join('')}</div>
      <div class="row between wrap"><span class="small muted">${esc(prefsSummary() || 'Keine Unverträglichkeiten hinterlegt.')}</span><button class="link" data-a="prefs">Unverträglichkeiten & Vorlieben</button></div>
      ${generatePlan.relaxed ? '<p class="small" style="color:var(--sun)">Mit deinen Einschränkungen gibt es zu wenige Rezepte. Einige Gerichte enthalten deshalb Zutaten, die du meiden möchtest. Tausche sie oder plane mit Claude.</p>' : ''}
      <div class="row wrap"><button class="btn sm line" data-a="plan-new">${I.swap.replace('<svg','<svg width="15" height="15"')} Neu mischen</button><button class="btn sm accent" data-a="shop-build">Einkaufsliste erstellen</button></div>
      ${sampleFn?`<details class="faq" ${planWish?'open':''}><summary>Mit Claude persönlich planen</summary><div class="stack" style="margin-top:10px"><textarea id="plan-wish" placeholder="z. B. Unter der Woche schnell, Freitag Fisch, am Sonntag etwas Besonderes, kein Koriander">${esc(planWish)}</textarea><button class="btn sm accent" data-a="plan-ai" ${planBusy?'disabled':''}>${planBusy?'Claude plant …':'Plan erstellen lassen'}</button></div></details>`:''}
      ${S.plan.note?`<p class="ai-note">${esc(S.plan.note)}</p>`:''}
    </div>
    ${S.plan.days.map((d,i)=>{ const date = days[i], tot = ['B','L','D'].reduce((a,k)=>a+R(d[k]).p,0), isToday = dkey(date)===today();
      return `<div class="card ${isToday?'today-card':''}">
        <div class="row between"><h3>${WD[i]}, ${date.getDate()}.${date.getMonth()+1}.${isToday?' · heute':''}</h3><span class="small muted num">${tot} g Protein</span></div>
        <div class="list">${['B','L','D'].map(k=>{ const r = R(d[k]); return `<div class="li"><span class="meal">${MEALS[k]}</span><button class="grow" style="text-align:left" data-a="recipe" data-v="${r.id}"><b class="small">${r.n}</b><div class="small muted">${r.min} Min. · ${r.p} g</div></button><button class="x" data-a="plan-swap" data-v="${i}:${k}" aria-label="${MEALS[k]} am ${WD[i]} tauschen">${I.swap}</button></div>`; }).join('')}</div>
      </div>`; }).join('')}`;
}
async function planAI(){
  const el = document.getElementById('plan-wish'); if(el) planWish = el.value;
  const pool = RECIPES.filter(dietOK);
  planBusy = true; render();
  try{
    const r = await api('plan', {phase: PHASES[S.profile.phase].name, household: S.household, diet: S.diet, prefs: aiPrefs(), goal: proteinGoal(), wishes: planWish.trim(), recipes: pool.map(x=>({id:x.id, type:x.type, n:x.n, p:x.p, min:x.min, tags:x.tags}))});
    const okId = (id, t) => pool.some(x=>x.id===id && x.type===t);
    const ok = r && Array.isArray(r.days) && r.days.length>=7 && r.days.slice(0,7).every(d=>d && okId(d.B,'B') && okId(d.L,'M') && okId(d.D,'M'));
    if(!ok) throw {message:'Der Plan war unvollständig. Bitte nochmals versuchen oder neu mischen.'};
    S.plan = {days:r.days.slice(0,7).map(d=>({B:d.B, L:d.L, D:d.D})), note: typeof r.note==='string' ? r.note.slice(0,240) : ''};
    save(); toast('Dein persönlicher Plan ist fertig.');
  }catch(e){
    if(e && e.status === 503) sampleFn = null;
    toast((e && e.message) || 'Das hat nicht geklappt. Versuch es nochmals oder mische neu.');
  }
  planBusy = false; render();
}

/* Einkauf */
function renderShop(){
  const cats = [...CATS, ...new Set(S.shop.map(x=>x.cat).filter(c=>!CATS.includes(c)))];
  const groups = cats.map(c=>[c, S.shop.filter(x=>x.cat===c)]).filter(g=>g[1].length);
  const open = S.shop.filter(x=>!x.done).length;
  return `
    <div class="card">
      <div><span class="eyebrow">Einkaufsliste</span><h2>${open} ${open===1?'Artikel':'Artikel'} offen</h2></div>
      <div class="row"><input type="text" id="shop-add" placeholder="Artikel hinzufügen" style="flex:1"><button class="btn sm accent" data-a="shop-add">Hinzufügen</button></div>
      <div class="row wrap"><button class="btn sm line" data-a="shop-build">Aus Wochenplan erstellen</button>${S.shop.some(x=>x.done)?`<button class="btn sm line" data-a="shop-clear">Erledigte entfernen</button>`:''}${open?`<button class="btn sm line" data-a="shop-copy">Liste kopieren</button>`:''}</div>
      <p class="small muted">Mengen aus dem Wochenplan für ${S.household} ${S.household===1?'Person':'Personen'} und 7 Tage. Gewürze und Öl stehen unter Vorrat, falls etwas fehlt.</p>
    </div>
    ${groups.length ? groups.map(([c,items])=>`<div class="card"><h3>${esc(c)}</h3><div class="list">${items.map(x=>`<div class="li"><button class="tick ${x.done?'on':''}" data-a="shop-tick" data-v="${x.id}" aria-label="${esc(x.name)} abhaken">${x.done?I.check:''}</button><div class="grow small ${x.done?'struck':''}">${esc(x.name)}</div><span class="small num muted">${esc(fmtQty(x.qty,x.unit))}</span><button class="x" data-a="shop-del" data-v="${x.id}" aria-label="${esc(x.name)} entfernen">✕</button></div>`).join('')}</div></div>`).join('')
      : `<div class="card flat"><p class="small">Die Liste ist leer. Erstelle sie aus deinem Wochenplan oder füge Artikel hinzu.</p></div>`}`;
}

/* Library recipe sheet */
function openRecipe(id){
  const r = R(id); recN = S.household;
  openSheet(r.n, ()=>`
    <div class="row wrap"><span class="tag t-sage">${r.p} g Protein p. P.</span><span class="tag t-sun">${r.min} Min.</span>${r.tags.map(t=>`<span class="tag t-sky">${t}</span>`).join('')}</div>
    <p class="small">${r.why}</p>
    <div class="card"><div class="row between"><h3>Zutaten</h3>${stepper('rec-n', recN, 'Personen')}</div>
      <div class="list">${r.ing.map(i=>`<div class="li small"><div class="grow">${esc(ingName(i.n))}</div><span class="num muted">${fmtQty(i.q*recN,i.u)||'nach Geschmack'}</span></div>`).join('')}</div></div>
    <div class="card"><h3>Zubereitung</h3><div class="list">${r.steps.map((s,i)=>`<div class="li small"><b class="num" style="color:var(--accent);font-family:var(--font-display);font-size:17px">${i+1}</b><div class="grow">${s}</div></div>`).join('')}</div></div>
    <div class="row wrap"><button class="btn line" data-a="recipe-shop" data-v="${r.id}">Auf die Einkaufsliste</button><button class="btn accent" style="flex:1" data-a="recipe-log" data-v="${r.id}">Gegessen: ${r.p} g</button></div>`);
}

/* ---------- Training ---------- */
function weekDates(){
  const d = new Date(), wd = (d.getDay()+6)%7; const mon = new Date(d); mon.setDate(d.getDate()-wd);
  return [...Array(7)].map((_,i)=>{ const x = new Date(mon); x.setDate(mon.getDate()+i); return x; });
}
function renderTraining(){
  const days = weekDates(), tk = today();
  const doneWeek = days.filter(d=>(S.workouts[dkey(d)]||[]).some(w=>'ABC'.includes(w))).length;
  const w = todaysWorkout(), c = S.checkins[tk];
  const label = p => ({A:'Kraft A',B:'Kraft B',C:'Kraft C',M:'Mobilität',walk:'Gehen',rest:'Ruhe'})[p];
  return `
    <div class="stack" style="gap:4px"><span class="eyebrow">Krafttraining im Mittelpunkt</span><h1>Training</h1></div>
    <div class="card">
      <div class="row between"><h2>Diese Woche</h2><span class="small"><b class="num">${doneWeek}</b> von 3 Krafteinheiten</span></div>
      <div class="week">${days.map(d=>{ const k = dkey(d), p = WEEKPLAN[d.getDay()], done = (S.workouts[k]||[]).length>0;
        return `<div class="day ${k===tk?'today':''}"><span>${DAYNAMES[d.getDay()]}</span><b>${d.getDate()}</b><i class="dot ${done?'done':['A','B','C'].includes(p)?'k':''}"></i><span style="font-size:10px">${label(p)}</span></div>`; }).join('')}</div>
      <div class="legend"><span><i style="background:var(--sage)"></i>Krafttag</span><span><i style="background:var(--accent)"></i>erledigt</span></div>
    </div>
    ${w ? `<div class="card">
      <span class="eyebrow">Heute</span>
      <div class="row between"><h2>${WORKOUTS[w].n}</h2><span class="tag t-sage">${WORKOUTS[w].min} Min.</span></div>
      <p class="small muted">${WORKOUTS[w].focus} · ${WORKOUTS[w].ex.length} Übungen</p>
      ${lowDay(c)?`<p class="small" style="color:var(--sun)"><b>Dein Check-in zeigt wenig Energie oder Schlaf.</b> Ich habe die sanfte Version vorbereitet.</p>`:''}
      ${(S.workouts[tk]||[]).includes(w)?`<p class="small" style="color:var(--sage)"><b>Erledigt. Gut gemacht.</b></p>`:''}
      <button class="btn accent block" data-a="go" data-v="workout:${w}">${(S.workouts[tk]||[]).includes(w)?'Nochmal ansehen':'Training starten'}</button>
    </div>` : `<div class="card"><span class="eyebrow">Heute</span><h2>${WEEKPLAN[new Date().getDay()]==='rest'?'Ruhetag':'Aktive Erholung'}</h2><p class="small muted">Muskeln wachsen in der Pause. 20–30 Minuten Spazierengehen bei Tageslicht unterstützen Erholung, Stimmung und Schlaf.</p></div>`}
    <div class="section-head"><h2>Alle Einheiten</h2></div>
    <div class="tiles">${Object.entries(WORKOUTS).map(([k,x])=>`<button class="tile" data-a="go" data-v="workout:${k}"><span class="tag ${k==='M'?'t-sky':'t-sage'}">${x.min} Min.</span><b>${x.n}</b><span class="small muted">${x.focus}</span></button>`).join('')}</div>
    <div class="card flat">
      <h3>Warum gerade Krafttraining?</h3>
      <div class="list small">
        <div class="li"><div class="grow"><b>Knochen:</b> Mit sinkendem Östrogen nimmt die Knochendichte ab. Schwere Lasten und Stossimpulse setzen Reize dagegen.</div></div>
        <div class="li"><div class="grow"><b>Muskeln:</b> Ab 40 geht ohne Training jedes Jahr Muskelmasse verloren. Sie ist dein grösstes Stoffwechselorgan.</div></div>
        <div class="li"><div class="grow"><b>Kopf:</b> Krafttraining senkt nachweislich Ängstlichkeit und depressive Symptome und verbessert den Schlaf.</div></div>
      </div>
      <p class="small muted">Steigere das Gewicht, wenn die letzten zwei Wiederholungen sich leicht anfühlen.</p>
    </div>`;
}
function openWorkout(id){
  const w = WORKOUTS[id], c = S.checkins[today()];
  wDraft = {id, light: lowDay(c) && id!=='M', done:{}, info:{}};
  openSheet(w.n, ()=>{
    const sets = s => wDraft.light ? Math.max(2, s-1) : s;
    const total = w.ex.reduce((a,e)=>a+sets(e.s),0), done = Object.values(wDraft.done).filter(Boolean).length;
    return `
      <div class="row between"><span class="small muted">${w.focus}</span><span class="small num">${done}/${total} Sätze</span></div>
      <div class="bar"><i style="width:${done/total*100}%"></i></div>
      ${id!=='M'?`<label class="check"><input type="checkbox" data-a="w-light" ${wDraft.light?'checked':''}> <span><b>Sanfte Version:</b> ein Satz weniger, ca. 20 % leichteres Gewicht. Gut für Tage mit wenig Schlaf oder Energie.</span></label>`:''}
      <div class="card" style="gap:0">${w.ex.map((e,i)=>`<div class="ex">
        <div class="row between"><b>${e.n}</b><span class="small muted num">${sets(e.s)} × ${e.r}</span></div>
        <p class="small muted">${e.cue}</p>
        ${e.how ? `<button class="link" data-a="ex-info" data-v="${i}">${wDraft.info[i] ? 'Anleitung schliessen' : 'Anleitung & Video'}</button>` : ''}
        ${e.how && wDraft.info[i] ? `<div class="howto"><ol>${e.how.map(h => `<li>${h}</li>`).join('')}</ol>${videoBlock(e.v, e.n)}</div>` : ''}
        <div class="sets">${[...Array(sets(e.s))].map((_,j)=>`<button class="set ${wDraft.done[i+':'+j]?'on':''}" data-a="w-set" data-v="${i}:${j}">${j+1}</button>`).join('')}</div>
      </div>`).join('')}</div>
      <button class="btn accent block" data-a="w-done" ${done?'':'disabled'}>Training abschliessen</button>`;
  });
}

/* ---------- Mental ---------- */
function renderMental(){
  const recent = S.journal.slice(0,3);
  return `
    <div class="stack" style="gap:4px"><span class="eyebrow">Psyche & Mental Coaching</span><h1>Mental</h1></div>
    <div class="card">
      <h2>Übungen</h2>
      <div class="list">${Object.entries(EXERCISES).map(([k,e])=>`<button class="li" data-a="go" data-v="ex:${k}"><div class="grow"><b>${e.n}</b><div class="small muted">${e.for}</div></div><span class="tag t-accent">${e.min} Min.</span></button>`).join('')}</div>
    </div>
    <div class="section-head"><h2>Coaching-Programme</h2><span class="muted small">je 4 Einheiten</span></div>
    <div class="tiles">${Object.entries(PROGRAMS).map(([k,p])=>{ const d = (S.lessons[k]||[]).length; return `<button class="prog" data-a="go" data-v="prog:${k}"><span class="tag ${p.c}">${d}/4</span><b>${p.n}</b><span class="small muted">${p.sub}</span><div class="bar"><i style="width:${d/4*100}%"></i></div></button>`; }).join('')}</div>
    <div class="card">
      <h2>Drei gute Dinge</h2>
      <p class="small muted">Was war heute gut, auch wenn es klein war? Regelmässig geübt, lenkt das den Blick nachweislich stärker auf das, was trägt.</p>
      <textarea id="journal" placeholder="1. Der Kaffee in Ruhe am Morgen&#10;2. …&#10;3. …"></textarea>
      <button class="btn" data-a="journal-save">Speichern</button>
      ${recent.length?`<div class="list">${recent.map(j=>`<div class="li"><div class="grow small"><span class="eyebrow">${new Date(j.d).toLocaleDateString(LOC,{day:'numeric',month:'short'})}</span><div style="white-space:pre-wrap">${esc(j.t)}</div></div></div>`).join('')}</div>`:''}
    </div>
    <div class="card">
      <h2>Fragen, die viele Frauen stellen</h2>
      <div>${FAQ.map(([q,a])=>`<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
    </div>
    <div class="banner"><b>Wenn es zu viel wird</b><p class="small">Bei anhaltender Niedergeschlagenheit oder Gedanken, nicht mehr leben zu wollen, hol dir bitte sofort Unterstützung.</p><button class="link" data-a="help">Hilfe und Notfallnummern</button></div>`;
}
function openExercise(id){
  const e = EXERCISES[id];
  stopBreath();
  openSheet(e.n, ()=> e.breath ? `
    <p class="small">${e.intro}</p>
    <div class="breath">
      <div class="orb" id="orb"><span id="orb-label">Bereit?<small>${e.cycles} Runden · ${e.breath.map(b=>b[1]).join('-')}</small></span></div>
      <button class="btn accent" id="breath-btn" data-a="breath" data-v="${id}">Starten</button>
    </div>
    <p class="small muted">Gut für: ${e.for}</p>
    ${videoBlock(e.v, e.n)}` : `
    <p class="small">${e.intro}</p>
    <div class="card" style="gap:0">${e.steps.map(([k,t])=>`<div class="li"><b style="font-family:var(--font-display);font-weight:500;color:var(--head);font-size:24px;color:var(--accent);width:24px">${k}</b><div class="grow small">${t}</div></div>`).join('')}</div>
    <p class="small muted">Gut für: ${e.for}</p>
    ${videoBlock(e.v, e.n)}
    <button class="btn accent block" data-a="ex-done" data-v="${id}">Übung gemacht</button>`);
}
function stopBreath(){ if(breathTimer){ clearTimeout(breathTimer); breathTimer = null; } }
function runBreath(id){
  const e = EXERCISES[id], orb = document.getElementById('orb'), lbl = document.getElementById('orb-label'), btn = document.getElementById('breath-btn');
  if(breathTimer){ stopBreath(); btn.textContent = 'Starten'; orb.style.setProperty('--s','.55'); lbl.innerHTML = 'Pausiert'; return; }
  btn.textContent = 'Stopp';
  let cyc = 0, ph = 0, left = 0, name = '';
  const step = () => {
    if(left<=0){
      if(ph>=e.breath.length){ ph = 0; cyc++; }
      if(cyc>=e.cycles){ stopBreath(); orb.style.setProperty('--s','.55'); lbl.innerHTML = 'Geschafft.<small>Spür kurz nach.</small>'; btn.textContent = 'Nochmal'; markMental(id); return; }
      const sec = e.breath[ph][1]; name = e.breath[ph][0];
      left = sec;
      orb.style.setProperty('--d', sec+'s');
      if(name==='Einatmen') orb.style.setProperty('--s','1');
      if(name==='Ausatmen') orb.style.setProperty('--s','.55');
      ph++;
    }
    lbl.innerHTML = `${name}<small>${left} · Runde ${cyc+1}/${e.cycles}</small>`;
    left--;
    breathTimer = setTimeout(step, 1000);
  };
  step();
}
function markMental(id){ const k = today(); S.mental[k] = [...new Set([...(S.mental[k]||[]), id])]; save(); }
function openProgram(id){
  const p = PROGRAMS[id];
  openSheet(p.n, ()=>{ const d = S.lessons[id]||[]; return `
    <p class="small muted">${p.sub}. Jede Einheit dauert etwa 5 Minuten und endet mit einer kleinen Aufgabe für den Alltag.</p>
    <div class="card" style="gap:0">${p.lessons.map((l,i)=>`<button class="li" data-a="lesson" data-v="${id}:${i}"><span class="tick ${d.includes(i)?'on':''}">${d.includes(i)?I.check:''}</span><div class="grow"><b>${i+1}. ${l[0]}</b></div><span class="link">Öffnen</span></button>`).join('')}</div>`; });
}
function openLesson(id, i){
  const p = PROGRAMS[id], l = p.lessons[i];
  openSheet(l[0], ()=>`
    <span class="eyebrow">${p.n} · Einheit ${i+1} von 4</span>
    <p>${l[1]}</p>
    <div class="card flat"><span class="eyebrow">Deine Aufgabe</span><p><b>${l[2]}</b></p></div>
    <button class="btn accent block" data-a="lesson-done" data-v="${id}:${i}">${(S.lessons[id]||[]).includes(i)?'Erledigt. Zurück zum Programm':'Einheit abschliessen'}</button>`);
}

/* ---------- Körper ---------- */
function last14(){ return [...Array(14)].map((_,i)=>{ const d = daysAgo(13-i); return {d, c:S.checkins[dkey(d)]}; }); }
function chart(days){
  const W=320,H=150,pl=20,pr=10,pt=10,pb=22, n=days.length;
  const x = i => pl+(W-pl-pr)*i/(n-1), y = v => pt+(H-pt-pb)*(5-v)/4;
  const series = [['mood','var(--accent)'],['energy','var(--sky)'],['sleep','var(--sage)']];
  let g = [1,2,3,4,5].map(v=>`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--line)" stroke-width="1"/>`).join('');
  g += [1,3,5].map(v=>`<text x="${pl-8}" y="${y(v)+3.5}" text-anchor="middle">${v}</text>`).join('');
  g += `<text x="${x(0)}" y="${H-6}" text-anchor="start">${shortDate(days[0].d)}</text><text x="${x(n-1)}" y="${H-6}" text-anchor="end">heute</text>`;
  series.forEach(([k,col])=>{
    let d = '', pen = false, last = null;
    days.forEach((dd,i)=>{ const v = dd.c && dd.c[k]; if(v){ d += (pen?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)+' '; pen = true; last = [x(i),y(v)]; } else pen = false; });
    if(d) g += `<path d="${d}" fill="none" style="stroke:${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    if(last) g += `<circle cx="${last[0]}" cy="${last[1]}" r="3.5" style="fill:${col}"/>`;
  });
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Verlauf von Stimmung, Energie und Schlaf über 14 Tage">${g}</svg></div>`;
}
function symptomCounts(days){ const m = {}; days.forEach(d=>{ (d.c?.symptoms||[]).forEach(s=>m[s]=(m[s]||0)+1); }); return Object.entries(m).sort((a,b)=>b[1]-a[1]); }
function renderBody(){
  const days = last14(), logged = days.filter(d=>d.c).length, hasEx = Object.values(S.checkins).some(c=>c.ex);
  const counts = symptomCounts(days).slice(0,5), taken = S.supps[today()]||[];
  const mine = SUPPS.filter(s=>S.mySupps.includes(s.id));
  return `
    <div class="stack" style="gap:4px"><span class="eyebrow">Hormone, Zyklus, Mikronährstoffe</span><h1>Körper</h1></div>
    <div class="card">
      <div class="row between"><h2>Die letzten 14 Tage</h2><span class="small muted">${logged} Check-ins</span></div>
      ${chart(days)}
      <div class="legend"><span><i style="background:var(--accent)"></i>Stimmung</span><span><i style="background:var(--sky)"></i>Energie</span><span><i style="background:var(--sage)"></i>Schlaf</span></div>
      ${counts.length?`<div class="list">${counts.map(([s,n])=>`<div class="li small"><div class="grow">${s}</div><div style="width:38%" class="bar"><i style="width:${n/Math.max(1,logged)*100}%;background:var(--accent)"></i></div><span class="num" style="width:56px;text-align:right">${n} Tage</span></div>`).join('')}</div>`:''}
      ${hasEx?`<p class="small muted">Enthält Beispieldaten aus der Demo. Du kannst sie unten im Profil löschen.</p>`:''}
      <button class="btn accent" data-a="report">Für das Arztgespräch zusammenfassen</button>
    </div>
    <div class="card">
      <span class="eyebrow">Nur mit ärztlicher Beratung</span>
      <h2>Hormonersatztherapie verstehen</h2>
      <p class="small">Second Bloom gibt keine Therapieempfehlung. Hier findest du verständliches Wissen, damit du gut vorbereitet ins Gespräch mit deiner Gynäkologin oder deinem Gynäkologen gehst.</p>
      <div>${HRT.map(([q,a])=>`<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
      ${USER ? `<p class="small muted">Studienlage zu nicht-hormonellen Möglichkeiten bei Hitzewallungen: <a href="/quellen#nonhormonal" target="_blank">Quellen &amp; Evidenz</a></p>` : ''}
    </div>
    <div class="card">
      <div class="row between"><h2>Meine Supplements</h2><span class="small muted">heute ${taken.filter(t=>S.mySupps.includes(t)).length}/${mine.length}</span></div>
      <div>${mine.length?mine.map(s=>`<div class="supp"><button class="tick ${taken.includes(s.id)?'on':''}" data-a="supp-take" data-v="${s.id}" aria-label="${s.n} genommen">${taken.includes(s.id)?I.check:''}</button><div class="grow"><b>${s.n}</b><div class="small muted">${s.dose}</div></div><button class="link" data-a="supp-info" data-v="${s.id}">Evidenz</button></div>`).join(''):'<p class="small muted">Noch keine ausgewählt. Füge unten welche hinzu.</p>'}</div>
    </div>
    <div class="card flat">
      <h3>Mikronährstoffe für deine Phase</h3>
      <p class="small muted">Passend zur ${PHASES[S.profile.phase].name}. Jede Angabe beruht auf geprüften Studien und Leitlinien mit Evidenzstufe und Quellen. Keine Verordnung: Lass Blutwerte bestimmen und sprich die Einnahme mit Ärztin, Arzt oder Apotheke ab. ${USER ? `<a href="/quellen" target="_blank">Alle Quellen</a>` : ''}</p>
      <div>${SUPPS.filter(s=>s.phases.includes(S.profile.phase)).map(s=>`<div class="supp"><div class="grow"><b>${s.n}</b><div class="small muted">${s.for}</div><button class="link" data-a="supp-info" data-v="${s.id}">Studienlage & Quellen</button></div><button class="btn sm ${S.mySupps.includes(s.id)?'ghost':'line'}" data-a="supp-mine" data-v="${s.id}">${S.mySupps.includes(s.id)?'Entfernen':'Hinzufügen'}</button></div>`).join('')}</div>
    </div>
    ${wearCard()}
    <div class="card flat">
      <h3>Profil</h3>
      <div class="list small">
        <div class="li"><div class="grow">Name</div><b>${esc(S.profile.name)}</b></div>
        <div class="li"><div class="grow">Alter · Grösse · Gewicht</div><b class="num">${S.profile.age} · ${S.profile.height ? S.profile.height + ' cm' : '–'} · ${S.profile.weight} kg</b></div>
        ${S.profile.height ? `<div class="li"><div class="grow">BMI<div class="small muted"><span>${bmiNote(bmiOf(S.profile.weight, S.profile.height))}</span>. <span>${bmiHint(bmiOf(S.profile.weight, S.profile.height), S.profile.muscular)}</span></div></div><b class="num">${bmiNum(bmiOf(S.profile.weight, S.profile.height))}</b></div>` : ''}
        ${whtrOf(S.profile.waist, S.profile.height) ? `<div class="li"><div class="grow">Taille zu Grösse<div class="small muted"><span>${whtrNote(whtrOf(S.profile.waist, S.profile.height))}</span>. <span>Taillenumfang ${S.profile.waist} cm</span></div></div><b class="num">${bmiNum(whtrOf(S.profile.waist, S.profile.height))}</b></div>` : ''}
        <div class="li"><div class="grow">Körpermasse</div><button class="link" data-a="body-edit">Bearbeiten</button></div>
        <div class="li"><div class="grow">Proteinziel</div><b class="num">${proteinGoal()} g pro Tag</b></div>
        <div class="li"><div class="grow">Haushalt</div><b class="num">${S.household} ${S.household===1?'Person':'Personen'}</b></div>
        <div class="li"><div class="grow">Essen<div class="small muted">${esc(prefsSummary() || 'Keine Unverträglichkeiten oder Vorlieben hinterlegt')}</div></div><button class="link" data-a="prefs">Bearbeiten</button></div>
      </div>
      <div class="chips">${Object.entries(PHASES).map(([k,p])=>chip('phase', k, S.profile.phase===k, p.name)).join('')}</div>
      <div class="stack" style="gap:6px"><b class="small">Sprache</b><div class="chips" translate="no">${Object.entries(LANG_NAMES).map(([k,n])=>`<a class="chip ${LANG===k?'on':''}" href="/api/lang?l=${k}&next=${encodeURIComponent(location.pathname)}" hreflang="${k}">${n}</a>`).join('')}</div></div>
      <div class="row wrap">
        ${hasEx?`<button class="btn sm line" data-a="clear-ex">Beispieldaten löschen</button>`:''}
        <button class="btn sm ${confirmReset?'accent':'line'}" data-a="reset">${confirmReset?'Wirklich alles löschen?':'Demo zurücksetzen'}</button>
      </div>
    </div>`;
}
function openSupp(id){
  const s = SUPPS.find(x=>x.id===id);
  const body = () => {
    const ev = EVID ? (EVID_KEYS[id] || []).map(k => EVID[k]).filter(Boolean) : null;
    return `
    <p class="small"><span>${esc(s.for)}</span>. <span>${esc(s.note)}</span></p>
    ${ev === null ? '<p class="small muted">Studienlage wird geladen …</p>' : ev.length ? ev.map(evidenceBlock).join('') : '<p class="small muted">Für dieses Mittel ist die Auswertung noch nicht hinterlegt.</p>'}
    <div class="card flat"><p class="small"><b>Evidenzstufen:</b> Hoch = mehrere methodisch solide Studien oder Meta-Analysen kommen zum selben Ergebnis. Moderat = belastbare Hinweise mit Einschränkungen. Niedrig = wenige oder widersprüchliche Studien. Unzureichend = kein Nutzen belegt. ${USER ? `<a href="/quellen" target="_blank">Alle Quellen und Methodik</a>` : ''}</p></div>
    <p class="small muted">Keine Dosierungsempfehlung für dich persönlich. Bitte Einnahme mit Ärztin, Arzt oder Apotheke abstimmen, vor allem bei Medikamenten oder Vorerkrankungen.</p>`;
  };
  openSheet(s.n, body);
  if(!EVID) loadEvidence().then(() => { if(sheetRender === body) rerenderSheet(); });
}
function buildReport(){
  const days = last14(), L = days.filter(d=>d.c), n = L.length;
  const avg = k => n ? fmt1(L.reduce((a,d)=>a+d.c[k],0)/n) : '–';
  const counts = symptomCounts(days), periods = L.filter(d=>d.c.period).length;
  const wk = days.filter(d=>(S.workouts[dkey(d.d)]||[]).some(w=>'ABC'.includes(w))).length;
  const supps = SUPPS.filter(s=>S.mySupps.includes(s.id)).map(s=>s.n).join(', ') || 'keine';
  return [
    'SECOND BLOOM · Symptom-Übersicht für das Arztgespräch', '',
    `Name: ${S.profile.name}, ${S.profile.age} Jahre`,
    `Phase (Selbsteinschätzung): ${PHASES[S.profile.phase].name}`,
    `Zeitraum: ${shortDate(days[0].d)}–${shortDate(days[13].d)}${days[13].d.getFullYear()} (${n} Check-ins)`,
    L.some(d=>d.c.ex) ? '(enthält Beispieldaten aus der Demo)' : null, '',
    'Durchschnitt (1 = sehr schlecht, 5 = sehr gut)',
    `- Stimmung: ${avg('mood')}`, `- Energie: ${avg('energy')}`, `- Schlaf: ${avg('sleep')}`, `- Konzentration: ${avg('focus')}`, '',
    'Häufigste Beschwerden',
    ...(counts.length ? counts.slice(0,6).map(([s,c])=>`- ${s}: an ${c} von ${n} Tagen`) : ['- keine notiert']), '',
    ['peri','unsure'].includes(S.profile.phase) ? `Blutungen notiert: an ${periods} Tagen` : null,
    `Krafttraining: ${wk} Einheiten in 14 Tagen`,
    ...wearReportLines(),
    `Nahrungsergänzung: ${supps}`, '',
    'Meine Fragen',
    '- Kommt eine Hormonersatztherapie für mich in Frage? Welche Form?',
    '- Welche Blutwerte sind sinnvoll (Vitamin D, Ferritin, B12, Schilddrüse)?',
    '- Sollte ich eine Knochendichtemessung machen?',
    '- Was kann ich gegen Schlafprobleme und Stimmungsschwankungen tun?'
  ].filter(l=>l!==null).join('\n');
}

/* ---------- Sheet ---------- */
function openSheet(title, fn){
  sheetRender = fn;
  document.getElementById('sheet-title').textContent = title;
  document.getElementById('sheet-body').innerHTML = fn();
  document.getElementById('sheet').hidden = false;
  document.getElementById('sheet-body').scrollTop = 0;
}
function rerenderSheet(){ const b = document.getElementById('sheet-body'), s = b.scrollTop; b.innerHTML = sheetRender(); b.scrollTop = s; }
function closeSheet(){ stopBreath(); document.getElementById('sheet').hidden = true; sheetRender = null; }
function showTextSheet(title, text){
  openSheet(title, ()=>`<p class="small muted">Markiere den Text und kopiere ihn.</p><pre class="report" id="plain">${esc(text)}</pre>`);
  const pre = document.getElementById('plain'), r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
}

/* ---------- Actions ---------- */
function go(v){
  const [k, a] = v.split(':');
  if(k==='tab'){ closeSheet(); S.tab = a; save(); render(); document.getElementById('main').scrollTop = 0; }
  else if(k==='food'){ closeSheet(); S.tab = 'ernaehrung'; S.foodTab = a; save(); render(); document.getElementById('main').scrollTop = 0; }
  else if(k==='checkin') openCheckin();
  else if(k==='workout') openWorkout(a);
  else if(k==='ex') openExercise(a);
  else if(k==='prog') openProgram(a);
  else if(k==='recipe') openRecipe(a);
}
function readOb(){
  const n = document.getElementById('ob-name'), a = document.getElementById('ob-age'), w = document.getElementById('ob-weight'), h = document.getElementById('ob-height');
  if(h) ob.height = Math.min(220, Math.max(120, parseInt(h.value)||166));
  const wa = document.getElementById('ob-waist'), mu = document.getElementById('ob-muscular');
  if(wa){ const v = parseInt(wa.value); ob.waist = v >= 50 && v <= 160 ? v : null; }
  if(mu) ob.muscular = mu.checked;
  if(n) ob.name = n.value.trim() || 'Du';
  if(a) ob.age = Math.min(90, Math.max(30, parseInt(a.value)||49));
  if(w) ob.weight = Math.min(200, Math.max(35, parseInt(w.value)||68));
}
function logFood(name, p){ const tk = today(); (S.food[tk] = S.food[tk]||[]).push({n:name, p}); save(); }
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if(!el || el.disabled) return;
  const a = el.dataset.a, v = el.dataset.v, tk = today();
  switch(a){
    case 'tab': S.tab = v; save(); render(); document.getElementById('main').scrollTop = 0; break;
    case 'ftab': closeSheet(); S.foodTab = v; save(); render(); break;
    case 'go': go(v); break;
    case 'ob-next': readOb(); ob.step++; render(); break;
    case 'ob-back': readOb(); ob.step--; render(); break;
    case 'ob-phase': readOb(); ob.phase = v; ob.phaseManual = true; render(); break;
    case 'ob-goal': ob.goals = ob.goals.includes(v) ? ob.goals.filter(g=>g!==v) : [...ob.goals, v]; render(); break;
    case 'ob-agree': ob.agree = el.checked; render(); break;
    case 'ob-finish':
      S.profile = {name:ob.name, age:ob.age, height:ob.height, weight:ob.weight, waist:ob.waist, muscular:ob.muscular, phase:ob.phase, goals:ob.goals};
      S.household = ob.household; if(!USER) seedExamples(); generatePlan(); buildShop(); S.tab = 'heute'; save(); render(); break;
    case 'step': {
      const [k, d] = v.split(':'), dd = +d;
      if(k==='ob-hh'){ readOb(); ob.household = Math.min(8, Math.max(1, ob.household+dd)); render(); }
      else if(k==='hh'){ S.household = Math.min(8, Math.max(1, S.household+dd)); save(); render(); }
      else if(k==='cook-n'){ cook.servings = Math.min(8, Math.max(1, (cook.servings ?? S.household)+dd)); const t = document.getElementById('cook-text'); if(t) cook.text = t.value; render(); }
      else if(k==='rec-n'){ recN = Math.min(8, Math.max(1, recN+dd)); rerenderSheet(); }
      else if(k==='water'){ S.water[tk] = Math.max(0, Math.min(12, (S.water[tk]||0)+dd)); save(); render(); }
      break; }
    case 'checkin': openCheckin(); break;
    case 'ci-scale': { const [k,n] = v.split(':'); draft[k] = +n; rerenderSheet(); break; }
    case 'ci-sym': draft.symptoms = draft.symptoms.includes(v) ? draft.symptoms.filter(s=>s!==v) : [...draft.symptoms, v]; rerenderSheet(); break;
    case 'ci-period': draft.period = el.checked; break;
    case 'ci-save': delete draft.ex; S.checkins[tk] = draft; if(S.coach) Object.keys(S.coach).forEach(k => { if(k.startsWith(tk)) delete S.coach[k]; }); save(); closeSheet(); S.tab = 'heute'; render(); toast('Gespeichert. Dein Tagesplan ist angepasst.'); if(USER) setTimeout(refreshWear, 1200); break;
    case 'food-add': { const f = FOODS[+v]; logFood(f.n+' ('+f.a+')', f.p); render(); toast('+'+f.p+' g Protein'); break; }
    case 'food-del': S.food[tk].splice(+v,1); save(); render(); break;
    case 'recipe': openRecipe(v); break;
    case 'recipe-log': { const r = R(v); logFood(r.n, r.p); closeSheet(); render(); toast('+'+r.p+' g Protein eingetragen'); break; }
    case 'recipe-shop': { const r = R(v); addToShop(r.ing.filter(i=>i.q).map(i=>({name:ingName(i.n), qty:i.q*recN, unit:i.u, cat:i.c, src:'manual'}))); save(); closeSheet(); render(); toast('Zutaten auf der Einkaufsliste'); break; }
    case 'cook-pick': { const t = document.getElementById('cook-text'); if(t) cook.text = t.value; cook.picks = cook.picks.includes(v) ? cook.picks.filter(p=>p!==v) : [...cook.picks, v]; render(); break; }
    case 'cook-meal': { const t = document.getElementById('cook-text'); if(t) cook.text = t.value; cook.meal = v; render(); break; }
    case 'cook-time': { const t = document.getElementById('cook-text'); if(t) cook.text = t.value; cook.time = +v; render(); break; }
    case 'cook-photo-del': if(cook.photoUrl) URL.revokeObjectURL(cook.photoUrl); cook.photo = null; cook.photoUrl = ''; render(); break;
    case 'cook-go': cookGo(false); break;
    case 'cook-again': cookGo(true); break;
    case 'cook-stop': if(cook.ctl) cook.ctl.abort(); break;
    case 'cook-missing': { const x = cook.result; addToShop(x.ingredients.filter(i=>!i.have).map(i=>x.source==='lib' ? {name:i.item, qty:i.q, unit:i.u, cat:i.cat, src:'manual'} : {name:i.item, qty:0, unit:i.amount, cat:'Für: '+x.title, src:'manual'})); x.ingredients.forEach(i=>{ i.have = true; }); save(); render(); toast('Fehlende Zutaten auf der Einkaufsliste'); break; }
    case 'cook-log': { const x = cook.result; logFood(x.title, x.protein); render(); toast('+'+x.protein+' g Protein eingetragen'); break; }
    case 'diet': S.diet = v; generatePlan(); save(); render(); toast('Plan an deine Ernährungsweise angepasst'); break;
    case 'plan-new': generatePlan(); save(); render(); toast('Neuer Wochenplan'); break;
    case 'plan-swap': { const [i,k] = v.split(':'); swapMeal(+i, k); S.plan.note = ''; save(); render(); break; }
    case 'plan-ai': planAI(); break;
    case 'shop-build': buildShop(); S.foodTab = 'einkauf'; S.tab = 'ernaehrung'; save(); render(); toast('Einkaufsliste aus dem Wochenplan erstellt'); break;
    case 'shop-add': { const inp = document.getElementById('shop-add'), t = inp.value.trim(); if(!t){ inp.focus(); break; } addToShop([{name:t, qty:0, unit:'', cat:C_X}]); save(); render(); const n = document.getElementById('shop-add'); if(n) n.focus(); break; }
    case 'shop-tick': { const x = S.shop.find(s=>s.id===v); if(x) x.done = !x.done; save(); render(); break; }
    case 'shop-del': S.shop = S.shop.filter(s=>s.id!==v); save(); render(); break;
    case 'shop-clear': S.shop = S.shop.filter(s=>!s.done); save(); render(); break;
    case 'shop-copy': { const txt = shopText(); copyText(txt, ()=>showTextSheet('Einkaufsliste', txt)); break; }
    case 'w-light': wDraft.light = el.checked; wDraft.done = {}; rerenderSheet(); break;
    case 'w-set': wDraft.done[v] = !wDraft.done[v]; rerenderSheet(); break;
    case 'w-done': S.workouts[tk] = [...new Set([...(S.workouts[tk]||[]), wDraft.id])]; save(); closeSheet(); render(); toast('Training gespeichert. Gut gemacht.'); break;
    case 'breath': runBreath(v); break;
    case 'ex-done': markMental(v); closeSheet(); toast('Gut gemacht. Kleine Pausen wirken.'); break;
    case 'lesson': { const [p,i] = v.split(':'); openLesson(p, +i); break; }
    case 'lesson-done': { const [p,i] = v.split(':'); S.lessons[p] = [...new Set([...(S.lessons[p]||[]), +i])]; save(); render(); openProgram(p); break; }
    case 'journal-save': { const t = document.getElementById('journal').value.trim(); if(!t){ toast('Schreib mindestens eine Sache auf.'); break; } S.journal.unshift({d:Date.now(), t}); save(); render(); toast('Gespeichert'); break; }
    case 'help': openSheet('Hilfe in der Krise', helpContent); break;
    case 'supp-take': { const l = S.supps[tk]||[]; S.supps[tk] = l.includes(v) ? l.filter(x=>x!==v) : [...l, v]; save(); render(); break; }
    case 'supp-mine': S.mySupps = S.mySupps.includes(v) ? S.mySupps.filter(x=>x!==v) : [...S.mySupps, v]; save(); render(); break;
    case 'supp-info': openSupp(v); break;
    case 'report': openSheet('Arztgespräch vorbereiten', ()=>`<p class="small muted">Diese Übersicht kannst du kopieren und zum Termin mitnehmen oder vorab per Mail schicken.</p><pre class="report" id="report">${esc(buildReport())}</pre><button class="btn accent block" data-a="copy-report">Text kopieren</button>`); break;
    case 'copy-report': { const txt = buildReport(); copyText(txt, ()=>{ const pre = document.getElementById('report'), r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Text markiert. Jetzt kopieren.'); }); break; }
    case 'phase': S.profile.phase = v; save(); render(); break;
    case 'clear-ex': for(const k in S.checkins) if(S.checkins[k].ex){ delete S.checkins[k]; delete S.workouts[k]; } save(); render(); toast('Beispieldaten gelöscht'); break;
    case 'reset':
      if(!confirmReset){ confirmReset = true; render(); setTimeout(()=>{ if(confirmReset){ confirmReset = false; if(S.profile && S.tab==='koerper') render(); } }, 4000); break; }
      confirmReset = false; S = fresh(); ob.step = 0; ob.agree = false; save(); render(); break;
    case 'day-note': dayNoteGo(); break;
    case 'prefs': openPrefs(); break;
    case 'ob-avoid': { const a = prefs().avoid; S.prefs.avoid = a.includes(v) ? a.filter(x=>x!==v) : [...a, v]; render(); break; }
    case 'pref-avoid': { const a = prefs().avoid; S.prefs.avoid = a.includes(v) ? a.filter(x=>x!==v) : [...a, v]; rerenderSheet(); break; }
    case 'body-edit': openBody(); break;
    case 'body-save': {
      const n = (id, lo, hi) => { const v = parseInt(document.getElementById(id)?.value); return v >= lo && v <= hi ? v : null; };
      const p = S.profile;
      p.age = n('body-age', 18, 100) || p.age; p.height = n('body-height', 120, 220) || p.height; p.weight = n('body-weight', 35, 250) || p.weight;
      p.waist = n('body-waist', 50, 160); p.muscular = Boolean(document.getElementById('body-muscular')?.checked);
      save(); closeSheet(); render(); toast('Gespeichert.'); break; }
    case 'pref-save': {
      const split = (id) => (document.getElementById(id)?.value || '').split(',').map(x=>x.trim()).filter(x=>x.length>=2).slice(0,15);
      S.prefs.dislike = split('pref-dislike'); S.prefs.like = split('pref-like');
      generatePlan(); buildShop(); save(); closeSheet(); render(); toast('Gespeichert. Wochenplan und Einkaufsliste sind angepasst.'); break; }
    case 'ex-info': wDraft.info[v] = !wDraft.info[v]; rerenderSheet(); break;
    case 'video': videoOn.add(v); if(sheetRender) rerenderSheet(); else render(); break;
    case 'sheet-close': closeSheet(); break;
  }
});
document.addEventListener('input', e => {
  if(e.target.id==='cook-text') cook.text = e.target.value;
  if(['ob-height','ob-weight','ob-waist','ob-muscular','body-height','body-weight','body-waist','body-muscular'].includes(e.target.id)){
    const pre = e.target.id.split('-')[0], val = (k) => document.getElementById(pre+'-'+k);
    const hh = parseInt(val('height')?.value), ww = parseInt(val('weight')?.value), wa = parseInt(val('waist')?.value), el = document.getElementById(pre+'-bmi');
    if(el) el.innerHTML = (hh >= 120 && hh <= 220 && ww >= 35 && ww <= 250) ? bmiLine(ww, hh, val('muscular')?.checked, wa >= 50 && wa <= 160 ? wa : null) : '';
  }
  if(e.target.id==='ob-age' && !ob.phaseManual){
    const a = parseInt(e.target.value);
    if(a >= 30 && a <= 90){ ob.age = a; ob.phase = phaseForAge(a); document.querySelectorAll('[data-a=ob-phase]').forEach(b => b.classList.toggle('on', b.dataset.v === ob.phase)); }
  }
  if(e.target.id==='plan-wish') planWish = e.target.value;
});
document.addEventListener('change', e => {
  if(e.target.id==='cook-photo'){
    const f = e.target.files && e.target.files[0];
    if(f){ if(cook.photoUrl) URL.revokeObjectURL(cook.photoUrl); cook.photo = f; cook.photoUrl = URL.createObjectURL(f); render(); }
  }
});
document.addEventListener('keydown', e => {
  if(e.key==='Escape' && !document.getElementById('sheet').hidden) closeSheet();
  if(e.key==='Enter' && e.target.id==='shop-add'){ e.preventDefault(); document.querySelector('[data-a="shop-add"]').click(); }
});

/* ---------- Uhr & Erholung ---------- */
const pctTxt = (v) => (v > 0 ? '+' : '') + v + ' %';
function recoveryMini(){
  const t = wt();
  if(!t || t.recovery == null) return '';
  const col = t.recovery >= 65 ? 'var(--salbei)' : t.recovery >= 45 ? 'var(--sun)' : 'var(--accent)';
  return `<div class="card recovery">
    <div class="row between"><div><span class="eyebrow">${WEAR.demo ? 'Uhr · Beispieldaten' : 'Deine Uhr'}</span><h2>Erholung <em>${esc(t.label || '')}</em></h2></div>
      <button class="ringbtn" data-a="tab" data-v="koerper" aria-label="Details zur Erholung">${ring(t.recovery/100, t.recovery, col)}</button></div>
    ${t.reasons.length ? `<p class="small muted">${t.reasons.map(esc).join(' · ')}</p>` : `<p class="small muted">Alles im Bereich deiner eigenen Normalität.</p>`}
    ${t.unrest ? `<p class="small" style="color:var(--accent)"><b>${esc(t.unrest.text)}</b></p>` : ''}
  </div>`;
}
function bars(days){
  const d = days.slice(-14), W = 280, H = 56, bw = W / 14 - 3;
  return `<svg viewBox="0 0 ${W} ${H + 14}" class="bars" role="img" aria-label="Erholung der letzten 14 Tage">${d.map((x, i) => {
    const v = x.recovery, h = v == null ? 2 : Math.max(3, v / 100 * H), col = v == null ? 'var(--line)' : v >= 65 ? 'var(--salbei)' : v >= 45 ? 'var(--sun)' : 'var(--accent)';
    return `<rect x="${i * (W / 14)}" y="${H - h}" width="${bw}" height="${h}" rx="1.5" style="fill:${col}"/>`;
  }).join('')}<text x="0" y="${H + 12}">${d.length ? shortDate(new Date(d[0].day + 'T12:00:00')) : ''}</text><text x="${W}" y="${H + 12}" text-anchor="end">heute</text></svg>`;
}
function wearCard(){
  const w = WEAR;
  if(!w || (!w.connected && !w.today)) return `<div class="card">
    <span class="eyebrow">Optional · Gesundheitsdaten</span><h2>Erholung <em>messen</em></h2>
    <p class="small">Verbinde Garmin, Oura, WHOOP oder Polar. Dann siehst du Schlaf, HRV und Ruhepuls gegen deine eigene Normalität, unruhige Nächte und wie sich dein Zyklus verändert.</p>
    ${USER ? '<div class="row wrap"><a class="btn accent" href="/konto#geraete">Gerät verbinden</a><a class="btn line" href="/konto#apple">Apple Health importieren</a></div>' : '<a class="btn accent" href="/register">Konto erstellen und verbinden</a>'}
    <p class="small muted">iPhone mit Apple Health? Apple erlaubt keinen direkten Online-Zugriff auf Gesundheitsdaten. Deshalb übernimmst du sie über den Export aus der Health-App.</p>
  </div>`;
  const t = w.today;
  const m = (lbl, val, sub) => `<div class="metric" style="background:var(--surface-2)"><span class="lbl">${lbl}</span><b style="font-family:var(--font-display);font-weight:500;color:var(--head);font-size:20px">${val}</b><span class="small muted">${sub || '&nbsp;'}</span></div>`;
  return `<div class="card wear">
    <div class="row between wrap"><div><span class="eyebrow">${esc(w.provider || 'Uhr')}${w.lastSync ? ' · ' + new Date(w.lastSync).toLocaleDateString(LOC, {day:'numeric', month:'short'}) : ''}</span><h2>Erholung & <em>Schlaf</em></h2></div>
      ${t && t.recovery != null ? ring(t.recovery/100, t.recovery, t.recovery >= 65 ? 'var(--salbei)' : t.recovery >= 45 ? 'var(--sun)' : 'var(--accent)') : ''}</div>
    ${w.error ? `<p class="msg err small">${esc(w.error)}</p>` : ''}
    ${t ? `
      ${t.stale ? `<p class="small muted">Letzte Werte vom ${new Date(t.day + 'T12:00:00').toLocaleDateString(LOC, {day:'numeric', month:'long'})}.</p>` : ''}
      <div class="metrics" style="grid-template-columns:repeat(4,1fr)">
        ${m('Schlaf', t.sleep ? fmt1(t.sleep.h) + ' h' : '–', t.sleep && t.sleep.deltaMin != null ? (t.sleep.deltaMin >= 0 ? '+' : '−') + Math.abs(t.sleep.deltaMin) + ' min' : '')}
        ${m('HRV', t.hrv ? t.hrv.v : '–', t.hrv ? pctTxt(t.hrv.pct) : '')}
        ${m('Ruhepuls', t.rhr ? t.rhr.v : '–', t.rhr ? (t.rhr.d >= 0 ? '+' : '') + t.rhr.d : '')}
        ${m('Schritte', t.steps != null ? (t.steps / 1000).toFixed(1).replace('.', ',') + 'k' : '–', t.act_kcal ? t.act_kcal + ' kcal' : '')}
      </div>
      <p class="small muted">Verglichen mit deinen eigenen letzten 28 Tagen${t.baselineDays < 14 ? ' (noch wenige Tage, die Einordnung wird genauer)' : ''}.</p>
      ${t.unrest ? `<div class="banner"><b>Unruhige Nacht</b><p class="small">${esc(t.unrest.text)}</p></div>` : ''}
      ${w.days.length ? `<div class="chart">${bars(w.days)}</div>` : ''}` : '<p class="small muted">Noch keine Werte. Der erste Abgleich kann ein paar Minuten dauern.</p>'}
    ${w.cycle && w.cycle.note ? `<div class="card flat" style="gap:6px"><span class="eyebrow">Zyklus</span><p class="small">${esc(w.cycle.note)}</p>${w.cycle.lens && w.cycle.lens.length ? `<p class="small muted">Letzte Zykluslängen: ${w.cycle.lens.join(', ')} Tage</p>` : ''}</div>` : ''}
    ${w.insights && w.insights.length ? `<div class="insight stack" style="gap:6px"><span class="eyebrow" style="color:var(--sage)">Was dir gut tut</span>${w.insights.map(i => `<p class="small">${esc(i.text)} <span class="muted">(${i.n} Tage)</span></p>`).join('')}</div>` : ''}
    ${USER ? '<a class="link" href="/konto#geraete">Gerät verwalten</a>' : '<p class="small muted">Beispieldaten einer Garmin. Mit einem Konto verbindest du deine eigene Uhr.</p>'}
  </div>`;
}
function wearReportLines(){
  const d = (WEAR && WEAR.days) || [];
  if(!d.length) return [];
  const avg = (k) => { const x = d.slice(-14).map(r => r[k]).filter(v => v != null); return x.length ? x.reduce((a, b) => a + b, 0) / x.length : null; };
  const out = ['', 'Werte der Uhr (Durchschnitt 14 Tage)'];
  if(avg('sleep_h') != null) out.push(`- Schlaf: ${fmt1(avg('sleep_h'))} h pro Nacht`);
  if(avg('hrv') != null) out.push(`- HRV: ${Math.round(avg('hrv'))} ms`);
  if(avg('rhr') != null) out.push(`- Ruhepuls: ${Math.round(avg('rhr'))} Schläge pro Minute`);
  if(WEAR.cycle && WEAR.cycle.lens && WEAR.cycle.lens.length) out.push(`- Zykluslängen zuletzt: ${WEAR.cycle.lens.join(', ')} Tage`);
  return out;
}

/* ---------- Tageseinordnung (KI, ein Text pro Tag) ---------- */
let noteBusy = false;
const noteKey = () => today() + (LANG === 'de' ? '' : ':' + LANG);
function dayNoteCard(c){
  if(!sampleFn || !c) return '';
  const txt = S.coach && S.coach[noteKey()];
  return `<div class="card note">
    <span class="eyebrow">Kurz eingeordnet</span>
    ${txt ? `<p class="small" style="white-space:pre-wrap" translate="no">${esc(txt)}</p>` : `<p class="small muted">Check-in und Uhr zusammen in drei Sätzen.</p><button class="btn sm line" data-a="day-note" ${noteBusy ? 'disabled' : ''}>${noteBusy ? 'Einen Moment …' : 'Tag einordnen'}</button>`}
  </div>`;
}
async function dayNoteGo(){
  const c = S.checkins[today()]; if(!c) return;
  const d = S.plan ? S.plan.days[todayIdx()] : null, w = todaysWorkout();
  const t = wt();
  noteBusy = true; render();
  try{
    const r = await api('day', {ctx: {
      phase: PHASES[S.profile.phase].name, checkin: c,
      wear: t ? {erholung: t.recovery, einordnung: t.label, gruende: t.reasons, unruhige_nacht: Boolean(t.unrest), zyklus: WEAR.cycle && WEAR.cycle.note} : null,
      training: w ? (lowDay(c) ? 'sanfte Version: ' : '') + WORKOUTS[w].n : 'Erholung oder Spaziergang',
      dinner: d ? R(d.D).n : '', protein: proteinToday(), goal: proteinGoal(), lowStreak: lowMoodStreak(),
    }});
    (S.coach ||= {})[noteKey()] = r.text;
    const keys = Object.keys(S.coach).sort().slice(-14); S.coach = Object.fromEntries(keys.map(k => [k, S.coach[k]]));
    save();
  }catch(e){
    if(e && e.status === 503) sampleFn = null;
    toast((e && e.message) || 'Das hat nicht geklappt.');
  }
  noteBusy = false; render();
}


/* ---------- Videos zu den Übungen (YouTube, erst auf Klick geladen) ---------- */
// Geprüfte Videos; bevorzugt von Frauen gezeigt und auf Deutsch. Fehlt eines, führt der Link zur YouTube-Suche.
let VIDEOS = {}, videosAsked = false;
// Verfügbare Videos einmal laden (vom Server täglich bei YouTube geprüft)
async function loadVideos(){
  if(videosAsked) return; videosAsked = true;
  try{ const r = await fetch('/api/videos'); if(r.ok){ VIDEOS = await r.json(); if(sheetRender) rerenderSheet(); } }catch(e){}
}
const videoOn = new Set();
const play = '<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".12"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/></svg>';
function videoBlock(key, name){
  loadVideos();
  const v = key && VIDEOS[key];
  if(!v) return `<a class="link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' Anleitung')}" target="_blank" rel="noopener">Videos zu „${esc(name)}“ auf YouTube</a>`;
  const meta = `<p class="small muted">${esc(v.channel || 'YouTube')} · <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">auf YouTube öffnen</a></p>`;
  if(videoOn.has(key)) return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1" title="${esc(v.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>${meta}`;
  return `<button class="video-cover" data-a="video" data-v="${key}">${play}<span><b>Video ansehen</b><br><span class="small">${esc(v.title)}</span></span></button>
    <p class="small muted">Beim Abspielen lädt YouTube (Google) das Video. Erst dann werden Daten an YouTube übertragen.</p>`;
}

// Profil kommt aus der Registrierung: Plan und Einkaufsliste beim ersten Start anlegen
if(USER && S.profile && !S.plan){ generatePlan(); buildShop(); save(); }
render();
