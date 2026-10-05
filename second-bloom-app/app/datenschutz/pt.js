// Política de Privacidade, tradução portuguesa (Portugal) da versão alemã (que prevalece). Original: de.js
import Link from "next/link";
import { PRIVACY_VERSION, PRIVACY_DATE } from "@/lib/privacy";

// Marcadores para informações que a operadora tem de completar antes do lançamento
const P = ({ children }) => <span className="ph">{children}</span>;

const TOC = [
  ["kurz", "O essencial em resumo"],
  ["verantwortlich", "Responsável pelo tratamento"],
  ["recht", "Direito aplicável"],
  ["daten", "Que dados tratamos"],
  ["zwecke", "Finalidades e fundamentos jurídicos"],
  ["einwilligung", "Consentimento e retirada"],
  ["gesundheit", "Dados de saúde"],
  ["geraete", "Relógios e anéis ligados"],
  ["ki", "Funções de IA"],
  ["videos", "Vídeos de exercícios (YouTube)"],
  ["auswertung", "Análises automáticas"],
  ["empfaenger", "Destinatários e subcontratantes"],
  ["drittland", "Transferência para países terceiros"],
  ["dauer", "Prazo de conservação"],
  ["cookies", "Cookies e armazenamento local"],
  ["demo", "Demonstração sem conta"],
  ["sicherheit", "Segurança dos dados"],
  ["rechte", "Os teus direitos"],
  ["beschwerde", "Reclamação junto de uma autoridade de controlo"],
  ["pflicht", "Obrigação de fornecer dados"],
  ["alter", "Idade mínima"],
  ["werbung", "Sem publicidade, sem venda, sem rastreamento"],
  ["medizin", "Não é um dispositivo médico"],
  ["aenderungen", "Alterações a esta política"],
];

export default function PrivacyPT() {
  return (
      <div className="doc">
        <nav className="doc-toc" aria-label="Índice">
          <span className="eyebrow">Índice</span>
          <ol style={{ marginTop: 12 }}>{TOC.map(([id, t], i) => <li key={id}><a href={`#${id}`}>{i + 1}. {t}</a></li>)}</ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Versão {PRIVACY_VERSION}</span>
            <h1>Política de <em>Privacidade</em></h1>
            <p className="muted small">Data: {PRIVACY_DATE}. Esta política informa-te, nos termos dos art.ºs 13.º e 14.º do Regulamento Geral sobre a Proteção de Dados (RGPD), dos art.ºs 19.º e segs. da Lei Federal suíça de Proteção de Dados (LPD) e da Lei de Proteção de Dados do Liechtenstein, sobre a forma como a Second Bloom trata os teus dados pessoais.</p>
            <p className="small"><b>Tradução:</b> esta versão em português é disponibilizada para facilitar a leitura. Em caso de divergência, prevalece a <a href="/api/lang?l=de">versão alemã</a>.</p>
          </div>

          <h2 id="kurz">1. O essencial em resumo</h2>
          <div className="card flat">
            <ul>
              <li>A Second Bloom trata <b>dados de saúde</b>. Fazemo-lo apenas com o teu <b>consentimento explícito</b> e apenas para te dar recomendações personalizadas.</li>
              <li>Os servidores e o armazenamento de dados estão localizados na <b>UE (Frankfurt am Main)</b>. A operadora da infraestrutura é uma empresa dos EUA, ver secções 12 e 13.</li>
              <li>As <b>funções de IA</b> estão ativadas por predefinição e podem ser desativadas a qualquer momento em Conta. Nesse caso, é enviado à Anthropic um excerto sucinto, sem nome nem e-mail.</li>
              <li><b>Sem publicidade, sem venda de dados, sem rastreamento</b>, sem ferramentas de análise de terceiros.</li>
              <li>Podes, a qualquer momento, <b>descarregar todos os dados</b> e <b>eliminar de imediato a tua conta com todos os dados</b> (em <Link href="/konto">Conta</Link>).</li>
            </ul>
          </div>

          <h2 id="verantwortlich">2. Responsável pelo tratamento</h2>
          <p>O responsável pelo tratamento de dados, na aceção do art. 4.º, n.º 7, do RGPD e do art. 5.º, alínea j), da LPD, é:</p>
          <p><P>Nome ou firma</P><br /><P>Rua e número</P><br /><P>Código postal, localidade, país</P><br />E-mail: <P>datenschutz@…</P></p>
          <p>Para todas as questões relativas à proteção de dados e ao exercício dos teus direitos, podes contactar-nos através do endereço de e-mail acima indicado. <P>Caso tenha sido designado um encarregado da proteção de dados: acrescentar nome e contacto.</P> <P>Caso o responsável pelo tratamento tenha sede fora do EEE e se dirija a pessoas no EEE: acrescentar o representante na UE nos termos do art. 27.º do RGPD.</P></p>

          <h2 id="recht">3. Direito aplicável</h2>
          <p>Regemo-nos pelo <b>RGPD</b>, que se aplica em todo o Espaço Económico Europeu, portanto também no Liechtenstein, bem como pela <b>Lei de Proteção de Dados do Liechtenstein</b>. Para pessoas na Suíça aplica-se adicionalmente a <b>Lei Federal suíça de Proteção de Dados (LPD)</b>, juntamente com a Portaria sobre a Proteção de Dados (OPDo). Utilizamos com o mesmo significado os termos «Personendaten» (LPD) e «personenbezogene Daten» (RGPD), ambos traduzidos nesta versão por «dados pessoais».</p>

          <h2 id="daten">4. Que dados tratamos</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Categoria</th><th>Exemplos</th><th>Origem</th></tr></thead><tbody>
            <tr><td>Dados da conta</td><td>Nome próprio, apelido (facultativo), endereço de e-mail, palavra-passe (apenas como hash bcrypt, nunca em texto simples), função, data de criação</td><td>fornecidos por ti no registo</td></tr>
            <tr><td>Consentimentos</td><td>Momento, tipo e versão dos teus consentimentos e da tua aceitação da política de privacidade, confirmação do aviso de que a app não substitui o aconselhamento médico</td><td>fornecidos por ti</td></tr>
            <tr><td>Dados do perfil</td><td>Data de nascimento (a partir dela é calculada a idade e verificada a idade mínima), país, idioma, altura e peso (facultativos), fase (perimenopausa, menopausa …), objetivos, dimensão do agregado familiar, regime alimentar, preferências e aversões alimentares</td><td>fornecidos por ti no registo e na app</td></tr>
            <tr><td><b>Dados de saúde</b></td><td>Check-ins sobre humor, energia, sono e concentração, sintomas como afrontamentos ou suores noturnos, menstruação e hemorragias, intolerâncias (p. ex. lactose, glúten, histamina), suplementos alimentares tomados, treinos, registo de proteína e de água, entradas do diário, exercícios e sessões de coaching concluídos</td><td>fornecidos por ti na app</td></tr>
            <tr><td><b>Valores do dispositivo</b> (dados de saúde)</td><td>Duração e pontuação do sono, VFC (HRV), frequência cardíaca em repouso, frequência cardíaca durante o sono, SpO2, frequência respiratória, stress, passos, peso, minutos e calorias de atividade, fase do ciclo</td><td>provenientes do intervals.icu, apenas se ligares um relógio</td></tr>
            <tr><td>Dados de acesso ao intervals.icu</td><td>ID de atleta e chave de API pessoal (cifrada)</td><td>fornecidos por ti</td></tr>
            <tr><td>Pedidos de IA</td><td>Lista de ingredientes, refeição, número de pessoas, regime alimentar, fotografia do frigorífico, preferências para o plano semanal, resumo do check-in e dos valores do dispositivo</td><td>fornecidos por ti, apenas com a IA ativada</td></tr>
            <tr><td>Dados de utilização e de segurança</td><td>Número de pedidos de IA por dia, custos por mês (sem conteúdos), registos técnicos do nosso fornecedor de alojamento (p. ex. endereço IP, momento, endereço acedido, mensagens de erro)</td><td>gerados durante a utilização</td></tr>
          </tbody></table></div>

          <h2 id="zwecke">5. Finalidades e fundamentos jurídicos</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Finalidade</th><th>Dados</th><th>Fundamento jurídico</th></tr></thead><tbody>
            <tr><td>Disponibilizar a conta, início de sessão, alteração da palavra-passe</td><td>Dados da conta</td><td>Contrato, art. 6.º, n.º 1, alínea b), do RGPD</td></tr>
            <tr><td>Recomendações personalizadas: plano diário, treino, alimentação, exercícios, evolução, relatório para a consulta médica</td><td>Perfil, dados de saúde, valores do dispositivo</td><td>consentimento explícito, art. 9.º, n.º 2, alínea a), e art. 6.º, n.º 1, alínea a), do RGPD, art. 6.º, n.º 7, alínea a), da LPD</td></tr>
            <tr><td>Ligar o relógio e sincronizar diariamente</td><td>Dados de acesso, valores do dispositivo</td><td>consentimento explícito como acima, contrato para a função</td></tr>
            <tr><td>Sugestões de IA</td><td>Pedidos de IA</td><td>consentimento no registo, desativável separadamente a qualquer momento, art. 9.º, n.º 2, alínea a), e art. 49.º, n.º 1, alínea a), do RGPD, na medida do necessário para a transferência</td></tr>
            <tr><td>Prova dos consentimentos</td><td>Registo de consentimentos</td><td>obrigação jurídica, art. 6.º, n.º 1, alínea c), em conjugação com o art. 7.º, n.º 1, do RGPD</td></tr>
            <tr><td>Segurança, proteção contra abusos, limitação dos custos da IA, correção de erros</td><td>Dados de utilização e de segurança</td><td>interesse legítimo num funcionamento seguro e comportável, art. 6.º, n.º 1, alínea f), do RGPD</td></tr>
            <tr><td>Cumprimento de obrigações legais, exercício de direitos em juízo</td><td>na medida do necessário</td><td>art. 6.º, n.º 1, alíneas c) e f), do RGPD, art. 9.º, n.º 2, alínea f), do RGPD</td></tr>
          </tbody></table></div>
          <p>Não utilizamos os teus dados para outras finalidades. Se pretendêssemos tratá-los posteriormente para uma nova finalidade, informar-te-íamos previamente e, quando necessário, pediríamos o teu consentimento.</p>

          <h2 id="einwilligung">6. Consentimento e retirada</h2>
          <p>No registo, pedimos-te um <b>consentimento explícito relativo aos dados de saúde</b>, sem o qual a app não pode cumprir a sua função. Este abrange expressamente também as funções de IA e a transferência para a Anthropic necessária para o efeito. Podes desativar separadamente as funções de IA a qualquer momento em Conta, sem perderes o resto da app. Guardamos o momento, o tipo e a versão de cada consentimento, para o podermos comprovar.</p>
          <p>Podes <b>retirar qualquer consentimento a qualquer momento, com efeitos para o futuro</b> (art. 7.º, n.º 3, do RGPD). Desativas a IA em <Link href="/konto">Conta</Link> com um clique. Retiras o consentimento relativo aos dados de saúde eliminando a tua conta ou escrevendo-nos. Nesse caso, eliminamos os teus dados de saúde. A licitude do tratamento efetuado até esse momento não é afetada.</p>

          <h2 id="gesundheit">7. Dados de saúde</h2>
          <p>Os dados de saúde pertencem às categorias especiais de dados pessoais (art. 9.º do RGPD) ou aos dados pessoais sensíveis (art. 5.º, alínea c), da LPD). Tratamo-los em conformidade: são analisados apenas para as tuas próprias recomendações, não são associados a outras contas, não são transmitidos a terceiros para fins próprios destes e não são utilizados para publicidade. As administradoras da app (Admin) veem na interface de administração apenas o nome, o e-mail, a função e a data de criação, não os teus registos. O acesso aos conteúdos só ocorre na medida em que seja estritamente necessário para o funcionamento, a segurança ou a correção de erros, ou se tu o pedires.</p>

          <h2 id="geraete">8. Relógios e anéis ligados</h2>
          <p>Se ligares um relógio ou um anel, a Second Bloom obtém os valores diários através do serviço <b>intervals.icu</b>. O intervals.icu é um serviço independente, no qual tu própria tens uma conta e com o qual ligas Garmin, Oura, WHOOP, Polar ou outros fabricantes. Ao tratamento de dados pelo intervals.icu e pelo fabricante do teu dispositivo aplicam-se as respetivas políticas de privacidade.</p>
          <p>Guardamos a tua chave de API <b>cifrada (AES-256-GCM)</b> e utilizamo-la para obter, uma vez por dia e sempre que o pedires, os valores dos últimos dias e, na primeira ligação, os dos últimos 120 dias. Importamos apenas os valores de saúde referidos na secção 4, sem dados de GPS, percursos ou detalhes de treino. Podes desligar a ligação a qualquer momento em Conta e, ao fazê-lo, eliminar todos os valores do dispositivo guardados.</p>

          <h2 id="ki">9. Funções de IA</h2>
          <p>Enquanto não desativares as funções de IA (predefinição: ativadas), enviamos, para cada pedido, um excerto sucinto para a API Claude da <b>Anthropic</b>:</p>
          <ul>
            <li><b>Receita a partir de ingredientes:</b> ingredientes, refeição, tempo, número de pessoas, regime alimentar.</li>
            <li><b>Receita a partir de fotografia:</b> adicionalmente a fotografia, previamente reduzida para, no máximo, 1024 píxeis. Não guardamos a fotografia. Por favor, certifica-te de que não aparecem pessoas nem documentos pessoais.</li>
            <li><b>Plano semanal:</b> fase, dimensão do agregado familiar, regime alimentar, objetivo de proteína, as tuas preferências e a lista das nossas receitas.</li>
            <li><b>Avaliação do dia:</b> fase, check-in de hoje, um resumo dos valores do dispositivo (recuperação, motivos, noite agitada, indicação sobre o ciclo), treino de hoje, jantar e proteína consumida até ao momento.</li>
          </ul>
          <p>Nunca enviamos <b>nome, e-mail ou identificador da conta</b>. A Anthropic trata os dados enquanto nossa subcontratante. Nos termos das condições comerciais da Anthropic, os dados introduzidos através da API não são, por predefinição, utilizados para treinar modelos de IA. Os pormenores sobre a conservação constam da <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">política de privacidade da Anthropic</a>. As respostas da IA são sugestões, não recomendações médicas. Guardamos a avaliação do dia na tua conta durante 14 dias.</p>
          <p>Sem a IA ativada, a app utiliza exclusivamente a sua própria coleção de receitas e as suas próprias regras. Nesse caso, não são transferidos dados para a Anthropic.</p>

          <h2 id="videos">10. Vídeos de exercícios (YouTube)</h2>
          <p>Para os exercícios, mostramos vídeos explicativos do YouTube. Os vídeos só são carregados quando tocas em «Ver vídeo». Antes disso, não é estabelecida qualquer ligação ao YouTube, nem sequer para imagens de pré-visualização. Incorporamos os vídeos no modo de privacidade melhorada através de <code>youtube-nocookie.com</code>.</p>
          <p>Assim que inicias um vídeo, o teu navegador liga-se diretamente aos servidores do YouTube. O fornecedor é a Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlanda. A Google recebe, no mínimo, o teu endereço IP, a página acedida e informações técnicas sobre o teu dispositivo. É possível o acesso pela Google LLC nos EUA. Durante a reprodução, o YouTube pode guardar dados no teu navegador. O fundamento jurídico é o teu consentimento, dado ao tocares (art. 6.º, n.º 1, alínea a), do RGPD, § 25, n.º 1, da TDDDG para pessoas na Alemanha). Não são transferidos dados de saúde para o YouTube, apenas qual o exercício que estás a ver. Pormenores: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">política de privacidade da Google</a>. Os respetivos canais são responsáveis pelos conteúdos dos vídeos.</p>

          <h2 id="auswertung">11. Análises automáticas</h2>
          <p>A partir dos teus registos e dos valores do dispositivo, a app calcula indicações, por exemplo uma pontuação de recuperação de 0 a 100 com base na VFC, na frequência cardíaca em repouso e no sono, em comparação com os teus próprios últimos 28 dias, indicações sobre noites agitadas, a duração dos teus ciclos ou relações como «depois de dias de treino dormes mais tempo». Estas análises seguem regras fixas e compreensíveis. Servem apenas para a tua informação e <b>não produzem efeitos jurídicos</b> nem te afetam significativamente de forma similar. Não existe qualquer decisão automatizada na aceção do art. 22.º do RGPD ou do art. 21.º da LPD.</p>

          <h2 id="empfaenger">12. Destinatários e subcontratantes</h2>
          <p>Recorremos aos seguintes prestadores de serviços, que tratam dados por nossa conta e segundo as nossas instruções (art. 28.º do RGPD, art. 9.º da LPD). Com eles existem contratos de subcontratação. <P>Confirmar a celebração dos contratos de subcontratação (DPA) com a Vercel e a Anthropic antes do lançamento.</P></p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Destinatário</th><th>Função</th><th>Local do tratamento</th></tr></thead><tbody>
            <tr><td>Vercel Inc., EUA</td><td>Alojamento da app, funções de servidor, armazenamento de dados privado (Vercel Blob), registos técnicos</td><td>Funções de servidor e armazenamento de dados em Frankfurt am Main (UE). Entrega através da rede mundial da Vercel. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Privacidade Vercel</a></td></tr>
            <tr><td>Google Ireland Ltd. (YouTube)</td><td>Reprodução de vídeos de exercícios, apenas após o teu clique; responsável pelo tratamento autónomo</td><td>UE e EUA. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacidade Google</a></td></tr>
            <tr><td>Anthropic, EUA</td><td>Sugestões de IA (apenas com a IA ativada)</td><td>EUA. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Privacidade Anthropic</a></td></tr>
          </tbody></table></div>
          <p>O <b>intervals.icu</b> não é nosso subcontratante, mas sim um serviço que tu própria utilizas. Obtemos aí os teus valores com a tua chave. Os tipos de letra são fornecidos pelo nosso próprio servidor, não havendo qualquer ligação à Google. Para além disso, só transmitimos dados quando somos legalmente obrigados a fazê-lo, por exemplo por ordem de uma autoridade.</p>

          <h2 id="drittland">13. Transferência para países terceiros</h2>
          <p>A Vercel e a Anthropic têm sede nos EUA. Por isso, é possível o acesso a partir dos EUA, por exemplo para manutenção, e o tratamento dos pedidos de IA nos EUA. Na medida em que o respetivo fornecedor esteja certificado ao abrigo do <b>Quadro de Privacidade de Dados UE-EUA (EU-US Data Privacy Framework)</b> e da <b>extensão Suíça-EUA (Swiss-US)</b>, a transferência baseia-se na decisão de adequação da Comissão Europeia (art. 45.º do RGPD) ou no reconhecimento pelo Conselho Federal suíço (art. 16.º, n.º 1, da LPD). Caso contrário, utilizamos as <b>cláusulas contratuais-tipo da UE</b> (art. 46.º, n.º 2, alínea c), do RGPD, art. 16.º, n.º 2, alínea d), da LPD), com as adaptações necessárias para a Suíça. Para as funções de IA, a transferência baseia-se adicionalmente no teu consentimento explícito (art. 49.º, n.º 1, alínea a), do RGPD, art. 17.º, n.º 1, alínea a), da LPD). Podes pedir-nos uma cópia das garantias. <P>Verificar o estado de certificação dos fornecedores no lançamento e indicá-lo aqui.</P></p>

          <h2 id="dauer">14. Prazo de conservação</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Dados</th><th>Durante quanto tempo</th></tr></thead><tbody>
            <tr><td>Dados da conta, perfil, registos na app</td><td>até eliminares a tua conta; nesse momento, de imediato e na totalidade</td></tr>
            <tr><td>Valores do dispositivo</td><td>no máximo os últimos 400 dias (os mais antigos são removidos automaticamente), ao desligar, de imediato se o pedires, ao eliminar a conta, de imediato</td></tr>
            <tr><td>Dados de acesso ao intervals.icu</td><td>até desligares a ligação ou eliminares a tua conta</td></tr>
            <tr><td>Avaliação do dia pela IA</td><td>os últimos 14 dias</td></tr>
            <tr><td>Fotografias para receitas de IA</td><td>não são guardadas por nós; apenas transmitidas para esse único pedido</td></tr>
            <tr><td>Registo de consentimentos</td><td>enquanto a tua conta existir; depois, apenas na medida em que precisarmos dele legalmente como prova</td></tr>
            <tr><td>Contador de pedidos de IA por conta</td><td>um dia</td></tr>
            <tr><td>Custos de IA por mês (sem conteúdos, sem referência a pessoas)</td><td>12 meses</td></tr>
            <tr><td>Cookie de início de sessão</td><td>60 dias ou até terminares a sessão</td></tr>
            <tr><td>Registos técnicos do fornecedor de alojamento</td><td>por um curto período, segundo as regras da Vercel</td></tr>
          </tbody></table></div>
          <p>Ficam ressalvadas as obrigações legais de conservação. Não fazemos cópias de segurança próprias dos teus dados de saúde.</p>

          <h2 id="cookies">15. Cookies e armazenamento local</h2>
          <p>Utilizamos exatamente <b>três cookies</b>. O <code>sb_session</code> mantém a tua sessão iniciada (60 dias); está assinado, não é legível por scripts (httpOnly) e só é enviado através de ligações cifradas. O <code>sb_lang</code> guarda apenas o idioma escolhido para a interface (de, en, fr, es ou pt, 1 ano). <code>sb_cookie_ok</code> guarda a informação de que já viste o aviso de cookies (1 ano). Os três são tecnicamente necessários para a função que pediste; para isso não é necessário consentimento (art. 5.º, n.º 3, da Diretiva Privacidade Eletrónica, art. 45c da FMG). Não utilizamos cookies de análise, de publicidade ou de rastreamento, nem píxeis de terceiros. Só quando inicias um vídeo de exercício é que o YouTube pode guardar dados próprios no teu navegador (ver secção 10).</p>

          <h2 id="demo">16. Demonstração sem conta</h2>
          <p>Na <Link href="/demo">demonstração</Link> pública não guardamos nada no nosso servidor. Os teus registos ficam no armazenamento local do teu navegador até os eliminares aí. Os valores do dispositivo na demonstração são dados de exemplo fictícios. Se utilizares uma função de IA na demonstração, aplica-se a secção 9 com as devidas adaptações. Recomendamos que não introduzas dados de saúde reais na demonstração.</p>

          <h2 id="sicherheit">17. Segurança dos dados</h2>
          <p>Adotamos medidas técnicas e organizativas nos termos do art. 32.º do RGPD e do art. 8.º da LPD, entre as quais:</p>
          <ul>
            <li>Transmissão cifrada (HTTPS/TLS) em todas as ligações.</li>
            <li>Palavras-passe apenas como hash bcrypt; chaves de API cifradas com AES-256-GCM.</li>
            <li>Armazenamento de dados privado sem endereços públicos, separado por conta.</li>
            <li>Sessões assinadas, que deixam de ser válidas quando a palavra-passe é alterada.</li>
            <li>Conceito de funções: as administradoras não veem dados de saúde na interface; a conta inicial de administração é bloqueada assim que uma administradora tenha a sua própria palavra-passe.</li>
            <li>Minimização dos dados na IA: apenas os campos necessários, sem nomes, fotografias reduzidas e não guardadas.</li>
            <li>Funções de servidor e armazenamento de dados na UE.</li>
          </ul>
          <p>Se, apesar disso, ocorrer uma violação da proteção dos teus dados, notificamo-la à autoridade de controlo competente e informamos-te, quando a lei o preveja (art.ºs 33.º e 34.º do RGPD, art. 24.º da LPD).</p>

          <h2 id="rechte">18. Os teus direitos</h2>
          <ul>
            <li><b>Acesso</b> aos teus dados guardados (art. 15.º do RGPD, art. 25.º da LPD). A forma mais rápida é através da exportação em Conta.</li>
            <li><b>Retificação</b> de dados inexatos (art. 16.º do RGPD, art. 32.º da LPD). A maioria dos dados pode ser alterada diretamente por ti na app.</li>
            <li><b>Apagamento</b> (art. 17.º do RGPD, art. 32.º da LPD). Com «Eliminar conta», todos os dados são removidos de imediato.</li>
            <li><b>Limitação do tratamento</b> (art. 18.º do RGPD).</li>
            <li><b>Portabilidade dos dados</b> (art. 20.º do RGPD, art. 28.º da LPD): exportação num ficheiro JSON de leitura automática em Conta.</li>
            <li><b>Oposição</b> a tratamentos baseados em interesses legítimos (art. 21.º do RGPD, art. 30.º, n.º 2, alínea b), da LPD).</li>
            <li><b>Retirada</b> de consentimentos a qualquer momento, com efeitos para o futuro (ver secção 6).</li>
          </ul>
          <p>Para todos os pedidos, basta um e-mail para <P>datenschutz@…</P>. Regra geral, respondemos no prazo de um mês e, por segurança, podemos pedir-te uma prova de que és a pessoa em causa.</p>

          <h2 id="beschwerde">19. Reclamação junto de uma autoridade de controlo</h2>
          <p>Tens o direito de apresentar reclamação junto de uma autoridade de controlo da proteção de dados (art. 77.º do RGPD), em especial no teu país de residência. São competentes, por exemplo:</p>
          <ul>
            <li>Liechtenstein: Autoridade de Proteção de Dados do Liechtenstein (Datenschutzstelle Liechtenstein), Vaduz, <a href="https://www.datenschutzstelle.li" target="_blank" rel="noreferrer">datenschutzstelle.li</a></li>
            <li>Suíça: Comissário Federal para a Proteção de Dados e a Transparência (PFPDT), Berna, <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">edoeb.admin.ch</a></li>
            <li>Alemanha e Áustria: a autoridade de controlo do teu estado federado ou a autoridade austríaca de proteção de dados (Datenschutzbehörde)</li>
          </ul>

          <h2 id="pflicht">20. Obrigação de fornecer dados</h2>
          <p>Para criar uma conta, precisamos do teu nome próprio, e-mail, palavra-passe, data de nascimento (para a verificação da idade) e da tua fase, bem como da tua aceitação da política de privacidade e do teu consentimento relativo aos dados de saúde. Todos os restantes dados e a ligação de um relógio são facultativos; podes desativar as funções de IA. Sem eles, algumas funções não estão disponíveis ou estão disponíveis apenas de forma limitada.</p>

          <h2 id="alter">21. Idade mínima</h2>
          <p>A Second Bloom destina-se a adultos. A utilização só é permitida a partir dos 18 anos. No registo, indicas a tua data de nascimento; não é criada conta para pessoas com menos de 18 anos.</p>

          <h2 id="werbung">22. Sem publicidade, sem venda, sem rastreamento</h2>
          <p>Não mostramos publicidade, não vendemos dados, não criamos perfis publicitários e não utilizamos ferramentas de análise de terceiros. Os teus dados não são utilizados para treinar modelos de IA.</p>

          <h2 id="medizin">23. Não é um dispositivo médico</h2>
          <p>A Second Bloom é uma companheira de estilo de vida. A app não faz diagnósticos, não substitui o aconselhamento médico e não dá recomendações terapêuticas, em particular sobre terapêutica hormonal da menopausa, medicamentos ou suplementos alimentares. Em caso de queixas, dirige-te à tua médica ou ao teu médico e, numa crise aguda, aos números de emergência indicados na app.</p>

          <h2 id="aenderungen">24. Alterações a esta política</h2>
          <p>Adaptamos esta política quando a app ou a situação jurídica se alterarem. Encontras aqui sempre a versão em vigor. Em caso de alterações substanciais que exijam um novo consentimento, perguntamos-te na app antes de a alteração se aplicar a ti.</p>

          <div className="card flat" style={{ marginTop: 24 }}>
            <p className="small"><b>Nota sobre o protótipo:</b> as passagens marcadas a amarelo são marcadores que têm de ser completados antes de uma utilização pública. Esta política reflete a implementação técnica efetiva da app. Deve ser revista por um especialista em direito da proteção de dados antes do lançamento, juntamente com os contratos de subcontratação e o registo das atividades de tratamento (art. 30.º do RGPD, art. 12.º da LPD).</p>
          </div>
        </article>
      </div>
  );
}
