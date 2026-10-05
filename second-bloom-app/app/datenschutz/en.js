// Privacy policy, English translation of de.js (the German version is legally binding). Other translations: fr.js, es.js, pt.js
import Link from "next/link";
import { PRIVACY_VERSION, PRIVACY_DATE } from "@/lib/privacy";

// Placeholder for details the operator must add before launch
const P = ({ children }) => <span className="ph">{children}</span>;

const TOC = [
  ["kurz", "Key points at a glance"],
  ["verantwortlich", "Controller"],
  ["recht", "Applicable law"],
  ["daten", "What data we process"],
  ["zwecke", "Purposes and legal bases"],
  ["einwilligung", "Consent and withdrawal"],
  ["gesundheit", "Health data"],
  ["geraete", "Connected watches and rings"],
  ["ki", "AI features"],
  ["videos", "Exercise videos (YouTube)"],
  ["auswertung", "Automated analyses"],
  ["empfaenger", "Recipients and processors"],
  ["drittland", "Transfers to third countries"],
  ["dauer", "Retention period"],
  ["cookies", "Cookies and local storage"],
  ["demo", "Demo without an account"],
  ["sicherheit", "Data security"],
  ["rechte", "Your rights"],
  ["beschwerde", "Complaint to a supervisory authority"],
  ["pflicht", "Obligation to provide data"],
  ["alter", "Minimum age"],
  ["werbung", "No advertising, no selling, no tracking"],
  ["medizin", "Not a medical device"],
  ["aenderungen", "Changes to this policy"],
];

export default function PrivacyEN() {
  return (
      <div className="doc">
        <nav className="doc-toc" aria-label="Contents">
          <span className="eyebrow">Contents</span>
          <ol style={{ marginTop: 12 }}>{TOC.map(([id, t], i) => <li key={id}><a href={`#${id}`}>{i + 1}. {t}</a></li>)}</ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Version {PRIVACY_VERSION}</span>
            <h1>Privacy <em>policy</em></h1>
            <p className="muted small">Last updated: {PRIVACY_DATE}. In accordance with Art. 13 and 14 of the General Data Protection Regulation (GDPR), Art. 19 et seq. of the Swiss Federal Act on Data Protection (FADP) and the Liechtenstein Data Protection Act, this policy informs you how Second Bloom processes your personal data.</p>
            <p className="small"><b>Translation:</b> This English version is provided for convenience. In case of any discrepancy, the <a href="/api/lang?l=de">German version</a> prevails.</p>
          </div>

          <h2 id="kurz">1. Key points at a glance</h2>
          <div className="card flat">
            <ul>
              <li>Second Bloom processes <b>health data</b>. We do so only with your <b>explicit consent</b> and only to give you personal recommendations.</li>
              <li>Servers and data storage are located in the <b>EU (Frankfurt am Main)</b>. The infrastructure is operated by a US company, see sections 12 and 13.</li>
              <li>The <b>AI features</b> are switched on by default and can be switched off at any time under Account. When used, a brief extract without your name or email address is sent to Anthropic.</li>
              <li><b>No advertising, no selling of data, no tracking</b>, no third-party analytics tools.</li>
              <li>You can <b>download all your data</b> and <b>delete your account with all data immediately</b> at any time (under <Link href="/konto">Account</Link>).</li>
            </ul>
          </div>

          <h2 id="verantwortlich">2. Controller</h2>
          <p>The controller for data processing within the meaning of Art. 4(7) GDPR and Art. 5(j) FADP is:</p>
          <p><P>Name or company name</P><br /><P>Street and number</P><br /><P>Postcode, town, country</P><br />Email: <P>datenschutz@…</P></p>
          <p>For any questions about data protection and to exercise your rights, you can contact us at the email address above. <P>If a data protection officer has been appointed: add name and contact details.</P> <P>If the controller is established outside the EEA and targets individuals in the EEA: add the EU representative under Art. 27 GDPR.</P></p>

          <h2 id="recht">3. Applicable law</h2>
          <p>We comply with the <b>GDPR</b>, which applies throughout the European Economic Area, including Liechtenstein, and with the <b>Liechtenstein Data Protection Act</b>. For individuals in Switzerland, the <b>Swiss Federal Act on Data Protection (FADP)</b> and the Data Protection Ordinance (DPO) also apply. We use terms such as “Personendaten” (FADP) and “personenbezogene Daten” (GDPR), both meaning “personal data”, interchangeably.</p>

          <h2 id="daten">4. What data we process</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Category</th><th>Examples</th><th>Source</th></tr></thead><tbody>
            <tr><td>Account data</td><td>First name, surname (optional), email address, password (only as a bcrypt hash, never in plain text), role, creation date</td><td>from you when you register</td></tr>
            <tr><td>Consents</td><td>Time, type and version of your consents and of your acceptance of the privacy policy, confirmation of the notice that the app does not replace medical advice</td><td>from you</td></tr>
            <tr><td>Profile details</td><td>Date of birth (used to calculate: age and minimum age check), country, language, height, weight, waist circumference and whether you do regular strength training (optional), phase (perimenopause, menopause …), goals, household size, diet, food preferences and dislikes</td><td>from you when you register and in the app</td></tr>
            <tr><td><b>Health data</b></td><td>Check-ins on mood, energy, sleep and concentration, symptoms such as hot flushes or night sweats, periods and bleeding, intolerances (e.g. lactose, gluten, histamine), supplements taken, workouts, protein and water log, journal entries, completed exercises and coaching sessions</td><td>from you in the app</td></tr>
            <tr><td><b>Device values</b> (health data)</td><td>Sleep duration and score, HRV, resting heart rate, heart rate during sleep, SpO2, respiratory rate, stress, steps, weight, active minutes and active calories, cycle phase</td><td>from intervals.icu, only if you connect a watch</td></tr>
            <tr><td>intervals.icu access credentials</td><td>Athlete ID and personal API key (encrypted)</td><td>from you</td></tr>
            <tr><td>AI requests</td><td>Ingredient list, meal, number of people, diet, photo of the fridge, wishes for the weekly plan, summary of check-in and device values</td><td>from you, only when AI is switched on</td></tr>
            <tr><td>Usage and security data</td><td>Number of AI requests per day, costs per month (without content), technical logs of our hosting provider (e.g. IP address, time, address accessed, error messages)</td><td>generated through use</td></tr>
          </tbody></table></div>

          <h2 id="zwecke">5. Purposes and legal bases</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Purpose</th><th>Data</th><th>Legal basis</th></tr></thead><tbody>
            <tr><td>Providing the account, signing in, changing your password</td><td>Account data</td><td>Contract, Art. 6(1)(b) GDPR</td></tr>
            <tr><td>Personal recommendations: daily plan, training, nutrition, exercises, history, report for your doctor’s appointment</td><td>Profile, health data, device values</td><td>Explicit consent, Art. 9(2)(a) and Art. 6(1)(a) GDPR, Art. 6(7)(a) FADP</td></tr>
            <tr><td>Connecting a watch and syncing daily</td><td>Access credentials, device values</td><td>Explicit consent as above, contract for the feature</td></tr>
            <tr><td>AI suggestions</td><td>AI requests</td><td>Consent given at registration, can be switched off separately at any time, Art. 9(2)(a) and Art. 49(1)(a) GDPR, insofar as required for the transfer</td></tr>
            <tr><td>Proof of consents</td><td>Consent log</td><td>Legal obligation, Art. 6(1)(c) in conjunction with Art. 7(1) GDPR</td></tr>
            <tr><td>Security, abuse prevention, limiting AI costs, troubleshooting</td><td>Usage and security data</td><td>Legitimate interest in secure, affordable operation, Art. 6(1)(f) GDPR</td></tr>
            <tr><td>Compliance with legal obligations, enforcement of claims</td><td>as far as necessary</td><td>Art. 6(1)(c) and (f) GDPR, Art. 9(2)(f) GDPR</td></tr>
          </tbody></table></div>
          <p>We do not use your data for any other purposes. If we were to process data further for a new purpose, we would inform you beforehand and, where necessary, obtain your consent.</p>

          <h2 id="einwilligung">6. Consent and withdrawal</h2>
          <p>When you register, we ask for your explicit <b>consent to the processing of health data</b>, without which the app cannot fulfil its purpose. This expressly also covers the AI features and the transfer to Anthropic required for them. You can switch off the AI features separately at any time under Account without losing the rest of the app. We store the time, type and version of each consent so that we can demonstrate it.</p>
          <p>You can <b>withdraw any consent at any time with effect for the future</b> (Art. 7(3) GDPR). You can switch off the AI with one click under <Link href="/konto">Account</Link>. You withdraw your consent to the processing of health data by deleting your account or by writing to us. We will then delete your health data. The lawfulness of processing carried out up to that point remains unaffected.</p>

          <h2 id="gesundheit">7. Health data</h2>
          <p>Health data belong to the special categories of personal data (Art. 9 GDPR) and to sensitive personal data (Art. 5(c) FADP). We treat them accordingly: they are analysed only for your own recommendations, not linked to other accounts, not passed on to third parties for their own purposes and not used for advertising. App administrators (admin) see only name, email address, role and creation date in the admin interface, not your entries. Content is accessed only where strictly necessary for operation, security or troubleshooting, or if you ask us to.</p>

          <h2 id="geraete">8. Connected watches and rings</h2>
          <p>If you connect a watch or a ring, Second Bloom retrieves your daily values via the <b>intervals.icu</b> service. intervals.icu is an independent service with which you hold your own account and through which you connect Garmin, Oura, WHOOP, Polar or other manufacturers. Data processing by intervals.icu and by your device manufacturer is governed by their own privacy policies.</p>
          <p>We store your API key <b>encrypted (AES-256-GCM)</b> and use it to retrieve the values for the last few days once a day and whenever you request it, and the last 120 days when you first connect. We take over only the health values listed in section 4, no GPS data, routes or workout details. You can disconnect at any time under Account and delete all stored device values in the process.</p>

          <h2 id="ki">9. AI features</h2>
          <p>As long as you have not switched off the AI features (default: switched on), we send a brief extract for each request to the Claude API of <b>Anthropic</b>:</p>
          <ul>
            <li><b>Recipe from ingredients:</b> ingredients, meal, time, number of people, diet.</li>
            <li><b>Recipe from photo:</b> in addition, the photo, reduced beforehand to a maximum of 1024 pixels. We do not store the photo. Please make sure that no people or personal documents are visible.</li>
            <li><b>Weekly plan:</b> phase, household size, diet, protein target, your wishes and the list of our recipes.</li>
            <li><b>Daily assessment:</b> phase, today’s check-in, a summary of the device values (recovery, reasons, restless night, cycle note), today’s workout, dinner and protein status.</li>
          </ul>
          <p>In doing so, we <b>never send your name, email address or account identifier</b>. Anthropic processes the data as our processor. Under Anthropic’s commercial terms, inputs via the API are not used to train AI models by default. Details on retention are set out in <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Anthropic’s privacy policy</a>. The AI’s responses are suggestions, not medical recommendations. We store the daily assessment in your account for 14 days.</p>
          <p>Without AI switched on, the app uses only its own recipe collection and rules. In that case, no data is transferred to Anthropic.</p>

          <h2 id="videos">10. Exercise videos (YouTube)</h2>
          <p>For the exercises, we show instructional videos from YouTube. The videos are loaded only when you tap “Watch video”. Before that, no connection to YouTube is established, not even for preview images. We embed the videos in privacy-enhanced mode via <code>youtube-nocookie.com</code>.</p>
          <p>As soon as you start a video, your browser connects directly to YouTube’s servers. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google receives at least your IP address, the page accessed and technical information about your device. Access by Google LLC in the USA is possible. YouTube may store data in your browser during playback. The legal basis is your consent given by tapping (Art. 6(1)(a) GDPR, § 25(1) TDDDG for individuals in Germany). No health data is transferred to YouTube, only which exercise you are watching. Details: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google’s privacy policy</a>. The respective channels are responsible for the content of the videos.</p>

          <h2 id="auswertung">11. Automated analyses</h2>
          <p>From your entries and device values, the app calculates insights, for example a recovery score from 0 to 100 based on HRV, resting heart rate and sleep compared with your own last 28 days, indications of restless nights, the length of your cycles or patterns such as “you sleep longer after training days”. These analyses follow fixed, transparent rules. They serve only for your information and have <b>no legal effect</b> and no similarly significant effect on you. No automated decision-making within the meaning of Art. 22 GDPR or Art. 21 FADP takes place.</p>

          <h2 id="empfaenger">12. Recipients and processors</h2>
          <p>We use the following service providers, who process data on our behalf and in accordance with our instructions (Art. 28 GDPR, Art. 9 FADP). Data processing agreements are in place with them. <P>Confirm conclusion of the data processing agreements (DPA) with Vercel and Anthropic before launch.</P></p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Recipient</th><th>Task</th><th>Place of processing</th></tr></thead><tbody>
            <tr><td>Vercel Inc., USA</td><td>Hosting of the app, server functions, private data storage (Vercel Blob), technical logs</td><td>Server functions and data storage in Frankfurt am Main (EU). Delivery via Vercel’s global network. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel privacy policy</a></td></tr>
            <tr><td>Google Ireland Ltd. (YouTube)</td><td>Playing exercise videos, only after your click; independent controller</td><td>EU and USA. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google privacy policy</a></td></tr>
            <tr><td>Anthropic, USA</td><td>AI suggestions (only when AI is switched on)</td><td>USA. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Anthropic privacy policy</a></td></tr>
          </tbody></table></div>
          <p><b>intervals.icu</b> is not our processor but a service that you use yourself. We use your key to retrieve your values from it. Fonts are served from our own server; no connection to Google takes place. Beyond this, we only disclose data if we are legally required to do so, for example by order of an authority.</p>

          <h2 id="drittland">13. Transfers to third countries</h2>
          <p>Vercel and Anthropic are headquartered in the USA. Access from the USA, for example for maintenance, and the processing of AI requests in the USA are therefore possible. Insofar as the respective provider is certified under the <b>EU-US Data Privacy Framework</b> and the <b>Swiss-US extension</b>, the transfer is based on the adequacy decision of the EU Commission (Art. 45 GDPR) or the recognition by the Swiss Federal Council (Art. 16(1) FADP). Otherwise, we use the <b>EU Standard Contractual Clauses</b> (Art. 46(2)(c) GDPR, Art. 16(2)(d) FADP) with the adaptations required for Switzerland. For the AI features, the transfer is additionally based on your explicit consent (Art. 49(1)(a) GDPR, Art. 17(1)(a) FADP). You can request a copy of the safeguards from us. <P>Check the providers’ certification status at launch and enter it here.</P></p>

          <h2 id="dauer">14. Retention period</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Data</th><th>How long</th></tr></thead><tbody>
            <tr><td>Account data, profile, app entries</td><td>until you delete your account; then immediately and completely</td></tr>
            <tr><td>Device values</td><td>at most the last 400 days (older values are removed automatically), immediately on disconnection if you so choose, immediately on account deletion</td></tr>
            <tr><td>intervals.icu access credentials</td><td>until you disconnect or delete your account</td></tr>
            <tr><td>AI daily assessment</td><td>the last 14 days</td></tr>
            <tr><td>Photos for AI recipes</td><td>not stored by us at all; transferred only for the single request</td></tr>
            <tr><td>Consent log</td><td>as long as your account exists; afterwards only to the extent we legally need it as proof</td></tr>
            <tr><td>AI request counter per account</td><td>one day</td></tr>
            <tr><td>AI costs per month (without content, not linked to any person)</td><td>12 months</td></tr>
            <tr><td>Sign-in cookie</td><td>60 days or until you sign out</td></tr>
            <tr><td>Technical logs of the hosting provider</td><td>for a short period in accordance with Vercel’s specifications</td></tr>
          </tbody></table></div>
          <p>Statutory retention obligations remain reserved. We do not keep our own backup copies of your health data.</p>

          <h2 id="cookies">15. Cookies and local storage</h2>
          <p>We use exactly <b>three cookies</b>. <code>sb_session</code> keeps you signed in (60 days); it is signed, cannot be read by scripts (httpOnly) and is only sent over encrypted connections. <code>sb_lang</code> stores only the interface language you have chosen (de, en, fr, es or pt, 1 year). <code>sb_cookie_ok</code> remembers that you have seen the cookie notice (1 year). All three are technically necessary for the function you have requested; no consent is required for this (Art. 5(3) of the ePrivacy Directive, Art. 45c TCA). We do not use any analytics, advertising or tracking cookies or third-party pixels. Only when you start an exercise video may YouTube store its own data in your browser (see section 10).</p>

          <h2 id="demo">16. Demo without an account</h2>
          <p>In the public <Link href="/demo">demo</Link>, we do not store anything on our server. Your entries remain in your browser’s local storage until you delete them there. The device values in the demo are fictitious sample data. If you use an AI feature in the demo, section 9 applies accordingly. We recommend that you do not enter real health information in the demo.</p>

          <h2 id="sicherheit">17. Data security</h2>
          <p>We take technical and organisational measures in accordance with Art. 32 GDPR and Art. 8 FADP, including:</p>
          <ul>
            <li>Encrypted transmission (HTTPS/TLS) for all connections.</li>
            <li>Passwords only as bcrypt hashes; API keys encrypted with AES-256-GCM.</li>
            <li>Private data storage without public addresses, separated by account.</li>
            <li>Signed sessions that become invalid when the password is changed.</li>
            <li>Role concept: administrators do not see any health data in the interface; the initial admin account is locked as soon as an administrator has set their own password.</li>
            <li>Data minimisation for the AI: only necessary fields, no names, photos reduced in size and not stored.</li>
            <li>Server functions and data storage in the EU.</li>
          </ul>
          <p>If a breach of the protection of your data nevertheless occurs, we will report it to the competent supervisory authority and inform you where required by law (Art. 33 and 34 GDPR, Art. 24 FADP).</p>

          <h2 id="rechte">18. Your rights</h2>
          <ul>
            <li><b>Access</b> to your stored data (Art. 15 GDPR, Art. 25 FADP). The quickest way is via the export under Account.</li>
            <li><b>Rectification</b> of inaccurate data (Art. 16 GDPR, Art. 32 FADP). You can change most details directly in the app.</li>
            <li><b>Erasure</b> (Art. 17 GDPR, Art. 32 FADP). “Delete account” removes all data immediately.</li>
            <li><b>Restriction of processing</b> (Art. 18 GDPR).</li>
            <li><b>Data portability</b> (Art. 20 GDPR, Art. 28 FADP): export as a machine-readable JSON file under Account.</li>
            <li><b>Objection</b> to processing based on legitimate interests (Art. 21 GDPR, Art. 30(2)(b) FADP).</li>
            <li><b>Withdrawal</b> of consents at any time with effect for the future (see section 6).</li>
          </ul>
          <p>For all requests, an email to <P>datenschutz@…</P> is sufficient. We usually reply within one month and, for security reasons, may ask for proof that you are the data subject.</p>

          <h2 id="beschwerde">19. Complaint to a supervisory authority</h2>
          <p>You have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in your country of residence. Competent authorities include, for example:</p>
          <ul>
            <li>Liechtenstein: Data Protection Authority of Liechtenstein, Vaduz, <a href="https://www.datenschutzstelle.li" target="_blank" rel="noreferrer">datenschutzstelle.li</a></li>
            <li>Switzerland: Federal Data Protection and Information Commissioner (FDPIC), Bern, <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">edoeb.admin.ch</a></li>
            <li>Germany and Austria: the supervisory authority of your federal state or the Austrian Data Protection Authority</li>
          </ul>

          <h2 id="pflicht">20. Obligation to provide data</h2>
          <p>For an account, we need your first name, email address, password, date of birth (for the age check) and your phase, as well as your acceptance of the privacy policy and your consent to the processing of health data. All other details and connecting a watch are optional; you can switch off the AI features. Without them, some features are not available or only to a limited extent.</p>

          <h2 id="alter">21. Minimum age</h2>
          <p>Second Bloom is intended for adults. Use is only permitted from the age of 18. You provide your date of birth when you register; no account is created for persons under 18.</p>

          <h2 id="werbung">22. No advertising, no selling, no tracking</h2>
          <p>We do not show advertising, do not sell data, do not create advertising profiles and do not use third-party analytics tools. Your data is not used to train AI models.</p>

          <h2 id="medizin">23. Not a medical device</h2>
          <p>Second Bloom is a lifestyle companion. The app does not make diagnoses, does not replace medical advice and does not give treatment recommendations, in particular not on hormone replacement therapy, medication or supplements. If you have symptoms, please contact your doctor; in an acute crisis, use the emergency numbers listed in the app.</p>

          <h2 id="aenderungen">24. Changes to this policy</h2>
          <p>We update this policy when the app or the legal situation changes. You can always find the current version here. In the event of material changes that require new consent, we will ask you in the app before the change applies to you.</p>

          <div className="card flat" style={{ marginTop: 24 }}>
            <p className="small"><b>Note on the prototype:</b> The passages highlighted in yellow are placeholders that must be completed before public use. This policy reflects the actual technical implementation of the app. It should be reviewed by a data protection law specialist before launch, together with the data processing agreements and the record of processing activities (Art. 30 GDPR, Art. 12 FADP).</p>
          </div>
        </article>
      </div>
  );
}
