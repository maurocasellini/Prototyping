// Politique de confidentialité, traduction française. La version allemande (de.js) fait foi.
import Link from "next/link";
import { PRIVACY_VERSION, PRIVACY_DATE } from "@/lib/privacy";

// Espace réservé pour les informations que l'exploitante doit compléter avant le lancement
const P = ({ children }) => <span className="ph">{children}</span>;

const TOC = [
  ["kurz", "L'essentiel en bref"],
  ["verantwortlich", "Responsable du traitement"],
  ["recht", "Droit applicable"],
  ["daten", "Quelles données nous traitons"],
  ["zwecke", "Finalités et bases juridiques"],
  ["einwilligung", "Consentement et retrait"],
  ["gesundheit", "Données de santé"],
  ["geraete", "Montres et bagues connectées"],
  ["ki", "Fonctions d'IA"],
  ["videos", "Vidéos d'exercices (YouTube)"],
  ["auswertung", "Analyses automatiques"],
  ["empfaenger", "Destinataires et sous-traitants"],
  ["drittland", "Transfert vers des pays tiers"],
  ["dauer", "Durée de conservation"],
  ["cookies", "Cookies et stockage local"],
  ["demo", "Démo sans compte"],
  ["warteliste", "Liste d’attente"],
  ["sicherheit", "Sécurité des données"],
  ["rechte", "Tes droits"],
  ["beschwerde", "Plainte auprès d'une autorité de contrôle"],
  ["pflicht", "Obligation de fournir des données"],
  ["alter", "Âge minimum"],
  ["werbung", "Pas de publicité, pas de vente, pas de suivi"],
  ["medizin", "Pas un dispositif médical"],
  ["aenderungen", "Modifications de la présente politique"],
];

export default function PrivacyFR() {
  return (
      <div className="doc">
        <nav className="doc-toc" aria-label="Sommaire">
          <span className="eyebrow">Sommaire</span>
          <ol style={{ marginTop: 12 }}>{TOC.map(([id, t], i) => <li key={id}><a href={`#${id}`}>{i + 1}. {t}</a></li>)}</ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Version {PRIVACY_VERSION}</span>
            <h1>Politique de <em>confidentialité</em></h1>
            <p className="muted small">État : {PRIVACY_DATE}. Conformément aux art. 13 et 14 du règlement général sur la protection des données (RGPD), aux art. 19 ss de la loi fédérale suisse sur la protection des données (LPD) et à la loi du Liechtenstein sur la protection des données, la présente politique t'informe de la manière dont Second Bloom traite tes données personnelles.</p>
            <p className="small"><b>Traduction :</b> cette version française est fournie pour faciliter la lecture. En cas de divergence, la <a href="/api/lang?l=de">version allemande</a> fait foi.</p>
          </div>

          <h2 id="kurz">1. L'essentiel en bref</h2>
          <div className="card flat">
            <ul>
              <li>Second Bloom traite des <b>données de santé</b>. Nous le faisons uniquement avec ton <b>consentement explicite</b> et uniquement pour te donner des recommandations personnalisées.</li>
              <li>Les serveurs et le stockage des données se trouvent dans l'<b>UE (Francfort-sur-le-Main)</b>. L'infrastructure est exploitée par une entreprise américaine, voir les sections 12 et 13.</li>
              <li>Les <b>fonctions d'IA</b> sont activées par défaut et peuvent être désactivées à tout moment sous Compte. Un extrait succinct, sans nom ni adresse e-mail, est alors transmis à Anthropic.</li>
              <li><b>Pas de publicité, pas de vente de données, pas de suivi</b>, aucun outil d'analyse de tiers.</li>
              <li>Tu peux à tout moment <b>télécharger toutes tes données</b> et <b>supprimer immédiatement ton compte avec toutes les données</b> (sous <Link href="/konto">Compte</Link>).</li>
            </ul>
          </div>

          <h2 id="verantwortlich">2. Responsable du traitement</h2>
          <p>Le responsable du traitement des données au sens de l'art. 4, ch. 7, RGPD et de l'art. 5, let. j, LPD est :</p>
          <p>Sara Casellini-Machado Sousa<br />Duxgass 2<br />9494 Schaan, Liechtenstein<br />E-mail: <P>datenschutz@…</P></p>
          <p>Pour toute question relative à la protection des données et pour exercer tes droits, tu peux nous joindre à l'adresse e-mail indiquée ci-dessus. <P>Si un délégué à la protection des données a été désigné : compléter le nom et les coordonnées.</P> <P>Avant le lancement, vérifier si un représentant en Suisse au sens de l’art. 14 LPD est nécessaire pour les utilisatrices en Suisse (en cas de traitement régulier et à grande échelle).</P></p>

          <h2 id="recht">3. Droit applicable</h2>
          <p>Nous nous conformons au <b>RGPD</b>, qui s'applique dans l'ensemble de l'Espace économique européen, donc également au Liechtenstein, ainsi qu'à la <b>loi du Liechtenstein sur la protection des données</b>. Pour les personnes en Suisse, la <b>loi fédérale sur la protection des données (LPD)</b> et l'ordonnance sur la protection des données (OPDo) s'appliquent en outre. Nous utilisons comme synonymes les termes « données personnelles » au sens de la LPD et « données à caractère personnel » au sens du RGPD.</p>

          <h2 id="daten">4. Quelles données nous traitons</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Catégorie</th><th>Exemples</th><th>Provenance</th></tr></thead><tbody>
            <tr><td>Données de compte</td><td>Prénom, nom (facultatif), adresse e-mail, mot de passe (uniquement sous forme de hachage bcrypt, jamais en clair), rôle, date de création</td><td>fournies par toi lors de l'inscription</td></tr>
            <tr><td>Consentements</td><td>Date et heure, type et version de tes consentements et de ton acceptation de la politique de confidentialité, confirmation de la mention indiquant que l'application ne remplace pas un avis médical</td><td>fournies par toi</td></tr>
            <tr><td>Données de profil</td><td>Date de naissance (servant à calculer l'âge et à vérifier l'âge minimum), pays, langue, taille, poids, tour de taille et indication d’un entraînement musculaire régulier (facultatifs), phase (périménopause, ménopause …), objectifs, taille du ménage, régime alimentaire, préférences et aversions alimentaires</td><td>fournies par toi lors de l'inscription et dans l'application</td></tr>
            <tr><td><b>Données de santé</b></td><td>Check-ins sur l'humeur, l'énergie, le sommeil et la concentration, symptômes tels que bouffées de chaleur ou sueurs nocturnes, règles et saignements, intolérances (p. ex. lactose, gluten, histamine), compléments alimentaires pris, entraînements, journal des protéines et de l'eau, entrées de journal, exercices et séances de coaching terminés</td><td>fournies par toi dans l'application</td></tr>
            <tr><td><b>Valeurs des appareils</b> (données de santé)</td><td>Durée et score de sommeil, VFC (HRV), fréquence cardiaque au repos, fréquence cardiaque pendant le sommeil, SpO2, fréquence respiratoire, stress, pas, poids, minutes et calories d'activité, phase du cycle</td><td>provenant d'intervals.icu, uniquement si tu connectes une montre</td></tr>
            <tr><td>Données d'accès à intervals.icu</td><td>ID d'athlète et clé API personnelle (chiffrée)</td><td>fournies par toi</td></tr>
            <tr><td>Requêtes à l'IA</td><td>Liste d'ingrédients, repas, nombre de personnes, régime alimentaire, photo du réfrigérateur, souhaits pour le plan de la semaine, résumé du check-in et des valeurs des appareils</td><td>fournies par toi, uniquement si l'IA est activée</td></tr>
            <tr><td>Données d'utilisation et de sécurité</td><td>Nombre d'appels à l'IA par jour, coûts par mois (sans contenu), journaux techniques de notre hébergeur (p. ex. adresse IP, date et heure, adresse consultée, messages d'erreur)</td><td>générées lors de l'utilisation</td></tr>
          </tbody></table></div>

          <h2 id="zwecke">5. Finalités et bases juridiques</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Finalité</th><th>Données</th><th>Base juridique</th></tr></thead><tbody>
            <tr><td>Mise à disposition du compte, connexion, modification du mot de passe</td><td>Données de compte</td><td>Contrat, art. 6, par. 1, let. b RGPD</td></tr>
            <tr><td>Recommandations personnalisées : plan du jour, entraînement, alimentation, exercices, historique, rapport pour la consultation médicale</td><td>Profil, données de santé, valeurs des appareils</td><td>consentement explicite, art. 9, par. 2, let. a et art. 6, par. 1, let. a RGPD, art. 6, al. 7, let. a LPD</td></tr>
            <tr><td>Connexion d'une montre et synchronisation quotidienne</td><td>Données d'accès, valeurs des appareils</td><td>consentement explicite comme ci-dessus, contrat pour la fonction</td></tr>
            <tr><td>Suggestions de l'IA</td><td>Requêtes à l'IA</td><td>consentement lors de l'inscription, désactivable séparément à tout moment, art. 9, par. 2, let. a et art. 49, par. 1, let. a RGPD, dans la mesure où cela est nécessaire au transfert</td></tr>
            <tr><td>Preuve des consentements</td><td>Registre des consentements</td><td>obligation légale, art. 6, par. 1, let. c en relation avec l'art. 7, par. 1 RGPD</td></tr>
            <tr><td>Sécurité, protection contre les abus, limitation des coûts de l'IA, correction des erreurs</td><td>Données d'utilisation et de sécurité</td><td>intérêt légitime à une exploitation sûre et abordable, art. 6, par. 1, let. f RGPD</td></tr>
            <tr><td>Respect des obligations légales, exercice des droits en justice</td><td>dans la mesure nécessaire</td><td>art. 6, par. 1, let. c et f RGPD, art. 9, par. 2, let. f RGPD</td></tr>
          </tbody></table></div>
          <p>Nous n'utilisons pas tes données à d'autres fins. Si nous devions les traiter ultérieurement pour une nouvelle finalité, nous t'en informerions au préalable et, si nécessaire, nous recueillerions ton consentement.</p>

          <h2 id="einwilligung">6. Consentement et retrait</h2>
          <p>Lors de l'inscription, nous te demandons un <b>consentement explicite au traitement des données de santé</b>, sans lequel l'application ne peut pas remplir sa fonction. Il couvre expressément aussi les fonctions d'IA et le transfert à Anthropic nécessaire à cet effet. Tu peux désactiver séparément les fonctions d'IA à tout moment sous Compte, sans perdre le reste de l'application. Nous enregistrons la date et l'heure, le type et la version de chaque consentement afin de pouvoir en apporter la preuve.</p>
          <p>Tu peux <b>retirer chaque consentement à tout moment avec effet pour l'avenir</b> (art. 7, par. 3 RGPD). Tu désactives l'IA en un clic sous <Link href="/konto">Compte</Link>. Tu retires ton consentement au traitement des données de santé en supprimant ton compte ou en nous écrivant. Nous supprimons alors tes données de santé. La licéité du traitement effectué jusqu'à ce moment n'en est pas affectée.</p>

          <h2 id="gesundheit">7. Données de santé</h2>
          <p>Les données de santé font partie des catégories particulières de données à caractère personnel (art. 9 RGPD) ou des données personnelles sensibles (art. 5, let. c, LPD). Nous les traitons en conséquence : elles sont analysées uniquement pour tes propres recommandations, ne sont pas reliées à d'autres comptes, ne sont pas communiquées à des tiers pour leurs propres finalités et ne sont pas utilisées à des fins publicitaires. Les administratrices de l'application (Admin) ne voient dans l'interface d'administration que le nom, l'adresse e-mail, le rôle et la date de création, et non tes entrées. Un accès aux contenus n'a lieu que dans la mesure où il est strictement nécessaire à l'exploitation, à la sécurité ou à la correction d'erreurs, ou si tu le demandes.</p>

          <h2 id="geraete">8. Montres et bagues connectées</h2>
          <p>Si tu connectes une montre ou une bague, Second Bloom récupère les valeurs quotidiennes via le service <b>intervals.icu</b>. intervals.icu est un service indépendant, auprès duquel tu gères toi-même un compte et avec lequel tu connectes Garmin, Oura, WHOOP, Polar ou d'autres fabricants. Le traitement des données par intervals.icu et par le fabricant de ton appareil est régi par leurs propres politiques de confidentialité.</p>
          <p>Nous enregistrons ta clé API sous forme <b>chiffrée (AES-256-GCM)</b> et l'utilisons pour récupérer, une fois par jour ainsi qu'à ta demande, les valeurs des derniers jours, et lors de la première connexion celles des 120 derniers jours. Nous ne reprenons que les valeurs de santé mentionnées à la section 4, et aucune donnée GPS, aucun parcours ni détail d'entraînement. Tu peux à tout moment couper la connexion sous Compte et supprimer à cette occasion toutes les valeurs des appareils enregistrées.</p>

          <p><b>Apple Health :</b> Apple ne propose pas d’interface en ligne pour les données de santé. Tu peux donc sélectionner l’export de l’app Santé (export.zip) sous Compte. Le fichier est lu uniquement dans ton navigateur et n’est pas téléversé. Seules les valeurs journalières des 180 derniers jours nous sont transmises (durée du sommeil, VFC, fréquence cardiaque au repos, pas, saturation en oxygène, fréquence respiratoire, poids et jours de règles). Elles sont enregistrées comme les autres données d’appareils et peuvent être supprimées sous Compte.</p>

          <h2 id="ki">9. Fonctions d'IA</h2>
          <p>Tant que tu n'as pas désactivé les fonctions d'IA (par défaut : activées), nous envoyons pour chaque requête un extrait succinct à l'API Claude d'<b>Anthropic</b> :</p>
          <ul>
            <li><b>Recette à partir d'ingrédients :</b> ingrédients, repas, temps, nombre de personnes, régime alimentaire.</li>
            <li><b>Recette à partir d'une photo :</b> en plus, la photo, préalablement réduite à 1024 pixels au maximum. Nous n'enregistrons pas la photo. Veille à ce qu'aucune personne ni aucun document personnel n'y soit visible.</li>
            <li><b>Plan de la semaine :</b> phase, taille du ménage, régime alimentaire, objectif de protéines, tes souhaits et la liste de nos recettes.</li>
            <li><b>Bilan du jour :</b> phase, check-in du jour, un résumé des valeurs des appareils (récupération, raisons, nuit agitée, indication sur le cycle), entraînement du jour, dîner et niveau de protéines.</li>
          </ul>
          <p>Nous n'envoyons <b>jamais de nom, d'adresse e-mail ni d'identifiant de compte</b>. Anthropic traite les données en tant que notre sous-traitant. Selon les conditions commerciales d'Anthropic, les entrées transmises via l'API ne sont, par défaut, pas utilisées pour entraîner des modèles d'IA. Les détails relatifs à la conservation sont réglés par la <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">politique de confidentialité d'Anthropic</a>. Les réponses de l'IA sont des suggestions, pas des recommandations médicales. Nous enregistrons le bilan du jour dans ton compte pendant 14 jours.</p>
          <p>Lorsque l'IA n'est pas activée, l'application utilise exclusivement sa propre collection de recettes et ses propres règles. Aucune donnée n'est alors transmise à Anthropic.</p>

          <h2 id="videos">10. Vidéos d'exercices (YouTube)</h2>
          <p>Pour les exercices, nous affichons des vidéos explicatives de YouTube. Les vidéos ne sont chargées que lorsque tu appuies sur « Voir la vidéo ». Avant cela, aucune connexion à YouTube n'est établie, pas même pour les images d'aperçu. Nous intégrons les vidéos en mode de confidentialité renforcée via <code>youtube-nocookie.com</code>.</p>
          <p>Dès que tu lances une vidéo, ton navigateur se connecte directement aux serveurs de YouTube. Le fournisseur est Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande. Google reçoit alors au minimum ton adresse IP, la page consultée et des informations techniques sur ton appareil. Un accès par Google LLC aux États-Unis est possible. YouTube peut enregistrer des données dans ton navigateur lors de la lecture. La base juridique est ton consentement, donné en appuyant sur le bouton (art. 6, par. 1, let. a RGPD, § 25, al. 1 TDDDG pour les personnes en Allemagne). Aucune donnée de santé n'est transmise à YouTube à cette occasion, seulement l'exercice que tu regardes. Détails : <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">politique de confidentialité de Google</a>. Les chaînes concernées sont responsables du contenu des vidéos.</p>

          <h2 id="auswertung">11. Analyses automatiques</h2>
          <p>À partir de tes saisies et des valeurs de tes appareils, l'application calcule des indications, par exemple un score de récupération de 0 à 100 à partir de la VFC, de la fréquence cardiaque au repos et du sommeil, comparés à tes propres 28 derniers jours, des indications sur des nuits agitées, la durée de tes cycles ou des corrélations telles que « après les jours d'entraînement, tu dors plus longtemps ». Ces analyses suivent des règles fixes et compréhensibles. Elles servent uniquement à ton information et n'ont <b>aucun effet juridique</b> ni aucune incidence similaire significative pour toi. Il n'y a pas de décision automatisée au sens de l'art. 22 RGPD ou de l'art. 21 LPD.</p>

          <h2 id="empfaenger">12. Destinataires et sous-traitants</h2>
          <p>Nous faisons appel aux prestataires suivants, qui traitent des données pour notre compte et selon nos instructions (art. 28 RGPD, art. 9 LPD). Des contrats de sous-traitance ont été conclus avec eux. <P>Confirmer la conclusion des contrats de sous-traitance (DPA) avec Vercel et Anthropic avant le lancement.</P></p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Destinataire</th><th>Tâche</th><th>Lieu du traitement</th></tr></thead><tbody>
            <tr><td>Vercel Inc., États-Unis</td><td>Hébergement de l'application, fonctions serveur, stockage privé des données (Vercel Blob), journaux techniques</td><td>Fonctions serveur et stockage des données à Francfort-sur-le-Main (UE). Diffusion via le réseau mondial de Vercel. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Protection des données Vercel</a></td></tr>
            <tr><td>Google Ireland Ltd. (YouTube)</td><td>Lecture des vidéos d'exercices, uniquement après ton clic ; responsable du traitement indépendant</td><td>UE et États-Unis. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Protection des données Google</a></td></tr>
            <tr><td>Anthropic, États-Unis</td><td>Suggestions de l'IA (uniquement si l'IA est activée)</td><td>États-Unis. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Protection des données Anthropic</a></td></tr>
          </tbody></table></div>
          <p><b>intervals.icu</b> n'est pas notre sous-traitant, mais un service que tu utilises toi-même. Nous y récupérons tes valeurs à l'aide de ta clé. Les polices de caractères sont fournies par notre propre serveur, aucune connexion à Google n'a lieu. Au-delà, nous ne communiquons des données que si nous y sommes légalement tenus, par exemple sur ordre d'une autorité.</p>

          <h2 id="drittland">13. Transfert vers des pays tiers</h2>
          <p>Vercel et Anthropic ont leur siège aux États-Unis. Un accès depuis les États-Unis, par exemple pour la maintenance, et le traitement des requêtes à l'IA aux États-Unis sont donc possibles. Dans la mesure où le fournisseur concerné est certifié dans le cadre du <b>EU-US Data Privacy Framework</b> et de l'<b>extension Swiss-US</b>, le transfert repose sur la décision d'adéquation de la Commission européenne (art. 45 RGPD) ou sur la reconnaissance par le Conseil fédéral (art. 16, al. 1, LPD). À défaut, nous utilisons les <b>clauses contractuelles types de l'UE</b> (art. 46, par. 2, let. c RGPD, art. 16, al. 2, let. d LPD) avec les adaptations nécessaires pour la Suisse. Pour les fonctions d'IA, le transfert repose en outre sur ton consentement explicite (art. 49, par. 1, let. a RGPD, art. 17, al. 1, let. a LPD). Tu peux nous demander une copie des garanties. <P>Vérifier le statut de certification des fournisseurs au moment du lancement et l'indiquer ici.</P></p>

          <h2 id="dauer">14. Durée de conservation</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Données</th><th>Durée</th></tr></thead><tbody>
            <tr><td>Données de compte, profil, entrées dans l'application</td><td>jusqu'à ce que tu supprimes ton compte ; elles sont alors supprimées immédiatement et entièrement</td></tr>
            <tr><td>Valeurs des appareils</td><td>au maximum les 400 derniers jours (les plus anciennes sont supprimées automatiquement), immédiatement en cas de déconnexion si tu le souhaites, immédiatement en cas de suppression du compte</td></tr>
            <tr><td>Données d'accès à intervals.icu</td><td>jusqu'à ce que tu coupes la connexion ou supprimes ton compte</td></tr>
            <tr><td>Bilan du jour de l'IA</td><td>les 14 derniers jours</td></tr>
            <tr><td>Photos pour les recettes de l'IA</td><td>pas du tout chez nous ; transmises uniquement pour la requête concernée</td></tr>
            <tr><td>Registre des consentements</td><td>tant que ton compte existe ; ensuite uniquement dans la mesure où nous en avons légalement besoin à titre de preuve</td></tr>
            <tr><td>Compteur d'appels à l'IA par compte</td><td>un jour</td></tr>
            <tr><td>Coûts de l'IA par mois (sans contenu, sans lien avec une personne)</td><td>12 mois</td></tr>
            <tr><td>Cookie de connexion</td><td>60 jours ou jusqu'à la déconnexion</td></tr>
            <tr><td>Journaux techniques de l'hébergeur</td><td>pour une courte durée, selon les règles de Vercel</td></tr>
          </tbody></table></div>
          <p>Les obligations légales de conservation sont réservées. Nous ne faisons pas nos propres copies de sauvegarde de tes données de santé.</p>

          <h2 id="cookies">15. Cookies et stockage local</h2>
          <p>Nous utilisons exactement <b>trois cookies</b>. <code>sb_session</code> te maintient connectée (60 jours) ; il est signé, illisible pour les scripts (httpOnly) et n'est envoyé que via des connexions chiffrées. <code>sb_lang</code> enregistre uniquement la langue choisie pour l'interface (de, en, fr, es ou pt, 1 an). <code>sb_cookie_ok</code> retient que tu as vu l’information sur les cookies (1 an). Les trois sont techniquement nécessaires à la fonction que tu as demandée ; aucun consentement n'est requis à cet effet (art. 5, par. 3 de la directive vie privée et communications électroniques, art. 45c LTC). Nous n'utilisons pas de cookies d'analyse, de publicité ou de suivi, ni de pixels de tiers. Ce n'est que lorsque tu lances une vidéo d'exercice que YouTube peut déposer ses propres données dans ton navigateur (voir la section 10).</p>

          <h2 id="demo">16. Démo sans compte</h2>
          <p>Dans la <Link href="/demo">démo</Link> publique, nous n'enregistrons rien sur notre serveur. Tes saisies restent dans le stockage local de ton navigateur jusqu'à ce que tu les y supprimes. Les valeurs des appareils dans la démo sont des données d'exemple fictives. Si tu utilises une fonction d'IA dans la démo, la section 9 s'applique par analogie. Nous te recommandons de ne pas saisir de véritables informations de santé dans la démo.</p>

          <h2 id="warteliste">17. Liste d’attente</h2>
          <p>Si tu t’inscris sur la liste d’attente depuis la page d’accueil, nous enregistrons ton adresse e-mail, ton prénom (facultatif), la langue choisie ainsi que la date et la version de ton consentement. Nous utilisons ces données uniquement pour t’informer une fois du lancement de Second Bloom. La base juridique est ton consentement (art. 6, par. 1, let. a RGPD ; art. 31, al. 1 LPD). Il n’y a pas de newsletter, aucune transmission à des tiers et aucune analyse. Tu peux <Link href="/warteliste/abmelden">te désinscrire ici</Link> à tout moment ou nous écrire ; nous supprimons alors l’inscription immédiatement. Nous supprimons l’ensemble de la liste d’attente au plus tard six mois après le lancement.</p>

          <h2 id="sicherheit">18. Sécurité des données</h2>
          <p>Nous prenons des mesures techniques et organisationnelles conformément à l'art. 32 RGPD et à l'art. 8 LPD, notamment :</p>
          <ul>
            <li>Transmission chiffrée (HTTPS/TLS) pour toutes les connexions.</li>
            <li>Mots de passe uniquement sous forme de hachage bcrypt ; clés API chiffrées avec AES-256-GCM.</li>
            <li>Stockage privé des données sans adresses publiques, séparé par compte.</li>
            <li>Sessions signées, qui deviennent invalides en cas de changement de mot de passe.</li>
            <li>Concept de rôles : les administratrices ne voient aucune donnée de santé dans l'interface ; le compte initial d'administration est bloqué dès qu'une administratrice dispose de son propre mot de passe.</li>
            <li>Minimisation des données pour l'IA : uniquement les champs nécessaires, pas de noms, photos réduites et non enregistrées.</li>
            <li>Fonctions serveur et stockage des données dans l'UE.</li>
          </ul>
          <p>Si une violation de la sécurité de tes données survient malgré tout, nous l'annonçons à l'autorité de contrôle compétente et t'en informons lorsque la loi le prévoit (art. 33 et 34 RGPD, art. 24 LPD).</p>

          <h2 id="rechte">19. Tes droits</h2>
          <ul>
            <li><b>Accès</b> aux données enregistrées te concernant (art. 15 RGPD, art. 25 LPD). Le plus rapide est l'exportation sous Compte.</li>
            <li><b>Rectification</b> des données inexactes (art. 16 RGPD, art. 32 LPD). Tu peux modifier la plupart des informations directement dans l'application.</li>
            <li><b>Effacement</b> (art. 17 RGPD, art. 32 LPD). Avec « Supprimer le compte », toutes les données sont supprimées immédiatement.</li>
            <li><b>Limitation du traitement</b> (art. 18 RGPD).</li>
            <li><b>Portabilité des données</b> (art. 20 RGPD, art. 28 LPD) : exportation sous forme de fichier JSON lisible par machine sous Compte.</li>
            <li><b>Opposition</b> aux traitements fondés sur des intérêts légitimes (art. 21 RGPD, art. 30, al. 2, let. b, LPD).</li>
            <li><b>Retrait</b> des consentements à tout moment avec effet pour l'avenir (voir la section 6).</li>
          </ul>
          <p>Pour toute demande, un e-mail à <P>datenschutz@…</P> suffit. Nous répondons en règle générale dans un délai d'un mois et pouvons, par mesure de sécurité, demander une preuve que tu es bien la personne concernée.</p>

          <h2 id="beschwerde">20. Plainte auprès d'une autorité de contrôle</h2>
          <p>Tu as le droit d'introduire une réclamation auprès d'une autorité de contrôle de la protection des données (art. 77 RGPD), notamment dans ton pays de résidence. Sont par exemple compétentes :</p>
          <ul>
            <li>Liechtenstein : Autorité de protection des données du Liechtenstein (Datenschutzstelle Liechtenstein), Vaduz, <a href="https://www.datenschutzstelle.li" target="_blank" rel="noreferrer">datenschutzstelle.li</a></li>
            <li>Suisse : Préposé fédéral à la protection des données et à la transparence (PFPDT), Berne, <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">edoeb.admin.ch</a></li>
            <li>Allemagne et Autriche : l'autorité de contrôle de ton Land ou l'autorité autrichienne de protection des données (Datenschutzbehörde)</li>
          </ul>

          <h2 id="pflicht">21. Obligation de fournir des données</h2>
          <p>Pour un compte, nous avons besoin de ton prénom, de ton adresse e-mail, d'un mot de passe, de ta date de naissance (pour la vérification de l'âge) et de ta phase, ainsi que de ton acceptation de la politique de confidentialité et de ton consentement au traitement des données de santé. Toutes les autres informations et la connexion d'une montre sont facultatives ; tu peux désactiver les fonctions d'IA. Sans elles, certaines fonctions ne sont pas disponibles ou ne le sont que de manière limitée.</p>

          <h2 id="alter">22. Âge minimum</h2>
          <p>Second Bloom s'adresse aux adultes. L'utilisation n'est autorisée qu'à partir de 18 ans. Lors de l'inscription, tu indiques ta date de naissance ; aucun compte n'est créé pour les personnes de moins de 18 ans.</p>

          <h2 id="werbung">23. Pas de publicité, pas de vente, pas de suivi</h2>
          <p>Nous n'affichons pas de publicité, ne vendons pas de données, ne créons pas de profils publicitaires et n'utilisons aucun outil d'analyse de tiers. Tes données ne sont pas utilisées pour entraîner des modèles d'IA.</p>

          <h2 id="medizin">24. Pas un dispositif médical</h2>
          <p>Second Bloom est un compagnon de style de vie. L'application ne pose pas de diagnostic, ne remplace pas un avis médical et ne donne pas de recommandations thérapeutiques, notamment pas en matière de traitement hormonal de la ménopause, de médicaments ou de compléments alimentaires. En cas de troubles, adresse-toi à ta médecin ou à ton médecin et, en cas de crise aiguë, aux numéros d'urgence indiqués dans l'application.</p>

          <h2 id="aenderungen">25. Modifications de la présente politique</h2>
          <p>Nous adaptons la présente politique lorsque l'application ou la situation juridique change. Tu trouveras toujours ici la version en vigueur. En cas de modifications importantes nécessitant un nouveau consentement, nous te le demandons dans l'application avant que la modification ne s'applique à toi.</p>

          <div className="card flat" style={{ marginTop: 24 }}>
            <p className="small"><b>Remarque concernant le prototype :</b> les passages surlignés en jaune sont des espaces réservés qui doivent être complétés avant toute utilisation publique. La présente politique reflète la mise en œuvre technique effective de l'application. Elle devrait être vérifiée avant le lancement par une ou un spécialiste du droit de la protection des données, avec les contrats de sous-traitance et le registre des activités de traitement (art. 30 RGPD, art. 12 LPD).</p>
          </div>
        </article>
      </div>
  );
}
