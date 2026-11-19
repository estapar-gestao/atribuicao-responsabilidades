/* =====================================================================
   CONTEÚDO DO SITE — "Orientação e Atribuição de Responsabilidades"
   Fonte: planilha "Orientação e Atribuição de Responsabilidades.xlsx"
   Só este arquivo precisa ser editado para atualizar o site.

   COMO EDITAR (resumo — o passo a passo está em COMO-ATUALIZAR.txt):
   - Textos ficam entre aspas simples: 'assim'. Se precisar de apóstrofo, use ’ (curvo).
   - Periodicidades válidas: 'Diária', 'Semanal', 'Mensal', 'Quando necessário'
   - Responsáveis válidos: 'Liderança', 'Analista', 'Supervisão'
   - Tipo de link (k): 'planilha', 'sistema', 'chamado' ou 'portal'
   - rede:true  = o link só abre na rede Estapar (ou com VPN)
   - Link diferente por garagem: g:{'Hopi Hari':'https://...', 'CES II':'https://...'}
   ===================================================================== */

var SITE = {
  area: 'Regional Campinas',                       /* aparece na capa e no rodapé */
  publico: 'líderes, analistas e supervisão das garagens',
  atualizadoEm: '19/11/2026',
  versao: '1.2',
  fonte: 'Planilha “Orientação e Atribuição de Responsabilidades”',
  contato: 'Supervisão da Regional Campinas'       /* quem mantém o conteúdo (cargo, não nome) */
};

/* Prazos em destaque (seção "Prazos de entrega") */
var PRAZOS = [
  { valor: '16:59', unidade: '',     titulo: 'Dias úteis',          texto: 'Prestação de contas e planilha de receita' },
  { valor: '10:00', unidade: '',     titulo: '1º dia útil do mês',  texto: 'Prestação de contas e planilha de receita' },
  { valor: '5',     unidade: 'dias', titulo: 'Veloe',               texto: 'Prazo para contestar tags / OSAs' },
  { valor: '15',    unidade: 'dias', titulo: 'ConectCar',           texto: 'Prazo para contestar tags / OSAs' },
  { valor: '30',    unidade: 'dias', titulo: 'Sem Parar',           texto: 'Prazo para contestar tags / OSAs' }
];

/* Perguntas frequentes (aceita <b> e links <a>) */
var DUVIDAS = [
  { p: 'Preciso preencher alguma informação neste portal?',
    r: 'Não. O portal é apenas de consulta. O preenchimento é feito no sistema ou na planilha que abre ao clicar no botão verde de cada tarefa.' },
  { p: 'Como faço uma solicitação para RH, DP ou Folha?',
    r: 'Desde 16/11/2026, todas as solicitações para RH / DP / Folha são feitas por chamado. <a href="https://estaparjsm.atlassian.net/servicedesk/customer/portal/2267" target="_blank" rel="noopener">Abrir chamado ↗</a>' },
  { p: 'Cancelei um ticket ou abri a cancela manualmente. Onde registro?',
    r: 'Na planilha de registro de abertura manual de cancela e cancelamento de ticket. <a href="https://docs.google.com/spreadsheets/d/1zHzsCe1V5iOalQpOPDowBXLKXCjtbwOxe8b0RGhw05w/edit?gid=434386130" target="_blank" rel="noopener">Abrir planilha ↗</a>' },
  { p: 'O link da Retaguarda não abre. O que fazer?',
    r: 'A Retaguarda está na rede interna da Estapar e só abre em um computador conectado à rede da empresa ou pela VPN. Os demais links abrem de qualquer lugar e solicitam o login habitual.' },
  { p: 'A rotina muda de uma garagem para outra?',
    r: 'Não. As rotinas valem para todas as garagens. Se uma garagem tiver um link próprio, ele substitui o link geral automaticamente quando a garagem é selecionada.' },
  { p: 'Como envio a rotina para a minha equipe?',
    r: 'Selecione a garagem e a função e clique em <b>Compartilhar</b>, no topo, ou em <b>Copiar link desta visão</b>. Quem abrir o link verá a mesma garagem e função.' },
  { p: 'Encontrei uma informação incorreta. A quem devo informar?',
    r: 'Informe a supervisão da sua regional, responsável por manter este conteúdo atualizado.' }
];

var GARAGENS = [
  { nome: 'Hospital Pitangueiras' },
  { nome: 'CES II' },
  { nome: 'Hopi Hari' },
  { nome: 'Shopping Valinhos' },
  { nome: 'Ed. Com. Vértice Valinhos' },
  { nome: 'Hosp. Santa Casa de Valinhos' },
  { nome: 'Hosp. Estadual de Sumaré' },
  { nome: 'Swiss Park Mall' },
  { nome: 'Ed. Com. Office Swiss Park', obs: 'Em implantação' }
];

/* Avisos que aparecem no topo do site */
var AVISOS = [
  { texto: '<b>Novo desde 16/11/2026:</b> todas as solicitações para RH / DP / Folha devem ser feitas por chamado.',
    link: { t: 'Abrir chamado', u: 'https://estaparjsm.atlassian.net/servicedesk/customer/portal/2267' } }
];

/* Atividades
   papeis: quem faz (r), com que frequência (p) e o que fazer (o)
   todos:true + per:[...] = vale para todos, sem responsável específico */
var ATIVIDADES = [
  { id: 'escala', dept: 'DP/RH/Folha', titulo: 'Escalas operacionais',
    sub: 'Criação de escala, acompanhamento e tratamento da necessidade de apoios',
    sis: ['Escala Analítica'],
    papeis: [
      { r: 'Liderança',  p: ['Diária'],  o: 'Defina a escala para no mínimo 40 dias, trate diariamente as observações (como faltas) e aponte as necessidades de substituição (solicitações).' },
      { r: 'Analista',   p: ['Semanal'], o: 'Apresentação de resultados e estudos.' },
      { r: 'Supervisão', p: ['Diária'],  o: 'Aprovações e acompanhamentos.' } ],
    links: [ { t: 'Escala Analítica', u: 'https://docs.google.com/spreadsheets/d/1fRuuP59wQUoLKkWdx6T81fvglsGUzlL2olx40BjCq4I/edit?gid=34483071', k: 'planilha' } ] },

  { id: 'nexus', dept: 'DP/RH/Folha', titulo: 'Ponto e ocorrências trabalhistas',
    sub: 'Tratamento de pontos e ocorrências trabalhistas',
    sis: ['Nexus'],
    papeis: [
      { r: 'Liderança',  p: ['Diária'],            o: 'Trate as marcações e atue nas ocorrências trabalhistas, ajustando as necessidades e aplicando a régua disciplinar.' },
      { r: 'Analista',   p: ['Diária', 'Semanal'], o: 'Apresente indicadores para acompanhamento.' },
      { r: 'Supervisão', p: ['Semanal', 'Mensal'], o: 'Reuniões para acompanhamento e análise da evolução dos indicadores.' } ],
    links: [ { t: 'Nexus Web', u: 'https://www.nexusweb.com.br/work/', k: 'sistema' } ] },

  { id: 'chamado-rh', dept: 'DP/RH/Folha', titulo: 'Solicitações ao RH / DP / Folha', novo: true,
    sub: 'Desde 16/11/2026 todas as solicitações devem ser feitas por chamado.',
    todos: true, per: ['Quando necessário'], sis: ['Portal de chamados'], papeis: [],
    links: [ { t: 'Abrir chamado para RH/DP/Folha', u: 'https://estaparjsm.atlassian.net/servicedesk/customer/portal/2267', k: 'chamado' } ] },

  { id: 'brsupply', dept: 'Compras (Insumos)', titulo: 'Compras BRSupply',
    sub: 'Prazos para solicitação de itens e planejamento de estoque para os meses de: novembro e dezembro',
    sis: ['BRSupply'],
    papeis: [
      { r: 'Liderança',  p: ['Mensal'], tag: 'Pedido',    o: 'Faça o pedido dentro da janela de pedidos, conforme o calendário.' },
      { r: 'Analista',   p: ['Mensal'], tag: 'Cadastro',  o: 'Conforme o calendário.' },
      { r: 'Supervisão', p: ['Mensal'], tag: 'Aprovação', o: 'Aprove os pedidos até a data indicada no calendário.' } ],
    janelas: [
      { nome: 'Novembro', y: 2026, m: 10, ini: 16, fim: 23, ap: 24 },
      { nome: 'Dezembro', y: 2026, m: 11, ini: 10, fim: 16, ap: 17 } ],
    nota: 'Caso esteja sem seu acesso ao BRSupply, faça agora mesmo a solicitação do seu acesso para o <b>Analista de Prestação de Contas</b>.',
    escl: '<p>Os pedidos devem estar devidamente aprovados para seguirem para as etapas de separação e entrega.</p>' +
      '<p><b>Acompanhamento dos pedidos:</b> o prazo de entrega pode ser acompanhado pelo Portal de Compras &gt; Tracking, onde também é possível consultar as informações do pedido e baixar a nota fiscal.</p>' +
      '<p><b>Contatos e canais de atendimento:</b> para esclarecimentos sobre o processo, dúvidas sobre pedidos ou informações sobre os itens adquiridos, fale diretamente com o fornecedor responsável pelos canais de atendimento ao cliente da Estapar:</p>' +
      '<p>Fornecedor Autopel: <a href="mailto:sac.estapar@autopel.com">sac.estapar@autopel.com</a>; <a href="mailto:tainara.bela@autopel.com">tainara.bela@autopel.com</a><br>' +
      'Fornecedor Personalize: <a href="mailto:vendas13@personalizepapeis.com.br">vendas13@personalizepapeis.com.br</a><br>' +
      'Fornecedor BRSupply: <a href="mailto:atendimento.estapar@brsupply.com.br">atendimento.estapar@brsupply.com.br</a></p>' +
      '<p><b>Eventualidades ou exceções:</b> o comprador responsável deve ser acionado para avaliação e direcionamento.<br>' +
      'BRSupply: <a href="mailto:leticia.ramalho@estapar.com.br">leticia.ramalho@estapar.com.br</a><br>' +
      'Autopel / Personalize: <a href="mailto:marcos.lopes@estapar.com.br">marcos.lopes@estapar.com.br</a></p>',
    links: [
      { t: 'BRSupply — fazer pedido', u: 'https://www.supplymanager.com.br/app/Login/', k: 'portal' },
      { t: 'Solicitar acesso ao BRSupply', u: 'https://docs.google.com/forms/d/1ZztR1kJw_SyP5LJg2LikLagggk0YioykOmZEH_quSLo/viewform?edit_requested=true', k: 'planilha' } ] },

  { id: 'epi', dept: 'SSBE', titulo: 'Acompanhamento de EPI',
    sis: ['SOC'],
    papeis: [ { r: 'Liderança', p: ['Quando necessário'], o: 'Faça o cadastro de acordo com a entrega.' } ],
    links: [ { t: 'SOC', u: 'https://sistema.soc.com.br/WebSoc/', k: 'sistema' } ] },

  { id: 'pc-caixa', dept: 'Financeiro', grupo: 'Prestação de contas', titulo: 'Prestação de contas — Caixa da Operação',
    sis: ['PDV Estapar / WPS ou outros', 'Sistema Caixa da Operação'],
    papeis: [ { r: 'Liderança', p: ['Diária'], o: 'Realize a prestação de contas no sistema Caixa da Operação.' } ],
    prazo: 'Dias úteis até as <b>16:59</b> · primeiro dia útil do mês até as <b>10:00</b>', links: [] },

  { id: 'pc-pos', dept: 'Financeiro', grupo: 'Prestação de contas', titulo: 'Prestação de contas — Relatórios POS',
    sis: ['Adyen ou outra'],
    papeis: [ { r: 'Liderança', p: ['Diária'], o: 'Extraia os relatórios POS.' } ],
    prazo: 'Dias úteis até as <b>16:59</b> · primeiro dia útil do mês até as <b>10:00</b>', links: [] },

  { id: 'pc-ficha', dept: 'Financeiro', grupo: 'Prestação de contas', titulo: 'Prestação de contas — Ficha de Exceção',
    sis: ['Ficha de Exceção'],
    papeis: [ { r: 'Liderança', p: ['Quando necessário'], o: 'Utilize a ficha conforme o padrão da operação.' } ],
    prazo: 'Dias úteis até as <b>16:59</b> · primeiro dia útil do mês até as <b>10:00</b>', links: [] },

  { id: 'pc-ged', dept: 'Financeiro', grupo: 'Prestação de contas', titulo: 'Prestação de contas — GED',
    sis: ['GED'],
    papeis: [ { r: 'Liderança', p: ['Diária'], o: 'Faça a prestação de contas utilizando o GED.' } ],
    prazo: 'Dias úteis até as <b>16:59</b> · primeiro dia útil do mês até as <b>10:00</b>',
    links: [ { t: 'GED', u: 'https://site.estapar.com.br/admin-login?Solicitante=KEPxKAgTh6t8EkSph2+GoV8+GkkkRCvxPCX63v0bC0Li/57ZxjbD5C9PC2xdRXzr&Aplicacao=56', k: 'sistema' } ] },

  { id: 'receita', dept: 'Financeiro', titulo: 'Planilha de Acompanhamento de Receita',
    sis: ['Planilha Financeira'],
    papeis: [ { r: 'Liderança', p: ['Diária'], o: '' }, { r: 'Analista', p: ['Diária'], o: '' }, { r: 'Supervisão', p: ['Diária'], o: '' } ],
    prazo: 'Dias úteis até as <b>16:59</b> · primeiro dia útil do mês até as <b>10:00</b>',
    links: [ { t: 'FCT Faturamento SPI — Novembro 2026', u: 'https://docs.google.com/spreadsheets/d/1tWSr2q42kstbIkc6HLQ4fkGb9enaQ-UzRQOfIGmXj7s/edit?gid=603841185', k: 'planilha' } ] },

  { id: 'contest', dept: 'Financeiro', titulo: 'Contestações de Tags / OSAs',
    sis: ['ConectCar', 'Sem Parar', 'Veloe'],
    papeis: [ { r: 'Liderança', p: ['Diária', 'Mensal'], o: '' }, { r: 'Analista', p: ['Diária', 'Mensal'], o: '' }, { r: 'Supervisão', p: ['Diária', 'Mensal'], o: '' } ],
    prazo: 'Prazo para contestar: <b>ConectCar até 15 dias</b> · <b>Sem Parar até 30 dias</b> · <b>Veloe até 5 dias</b>', links: [] },

  { id: 'outras', dept: 'Financeiro', titulo: 'Outras Receitas (Fluxo e Gestão)',
    sub: 'Credenciados / Mensalistas (PJ e PF) / Selos / Eventos faturados',
    sis: ['Retaguarda', 'Portal de Gestão', 'Portal Admin'],
    papeis: [
      { r: 'Liderança',  p: ['Diária'], o: 'Apresente indicadores para acompanhamento e defina o plano de ações.' },
      { r: 'Analista',   p: ['Diária'], o: 'Apresente indicadores para acompanhamento e defina o plano de ações.' },
      { r: 'Supervisão', p: ['Diária'], o: 'Apresente indicadores para acompanhamento e defina o plano de ações.' } ],
    links: [
      { t: 'Retaguarda', u: 'http://10.200.0.52/AutenticadorV2/NewLogin.aspx?Solicitante=JvinUsBzIO6MueW43Djc9n11ZbgMWzOU6rLfbPXFz0E=&Aplicacao=16', k: 'sistema', rede: true },
      { t: 'Portal de Gestão', u: 'https://gestao.estapar.com.br/login', k: 'portal' },
      { t: 'Portal Admin', u: 'https://site.estapar.com.br/admin-login?Solicitante=Dk8VilAbIP063GIGUUd/49H+UO3a0KKGq6PCc5jo74PFzsTH0tgYktGfp3EJjl0rE78vMd6iFDOVeUprzubFFnlXJz64cZN7wLtyMpXE4bI=&Aplicacao=31', k: 'portal' } ] },

  { id: 'chamados', dept: 'Acionamento Técnico', titulo: 'Abertura e acompanhamento de chamados',
    sis: ['Jira', 'Diário de Bordo'],
    papeis: [
      { r: 'Liderança',  p: ['Diária'], o: 'Preencha conforme a abertura do chamado e atualize diariamente de acordo com o acompanhamento na ferramenta de chamados.' },
      { r: 'Analista',   p: ['Diária'], o: 'Preencha conforme a abertura do chamado e atualize diariamente de acordo com o acompanhamento na ferramenta de chamados.' },
      { r: 'Supervisão', p: ['Diária'], o: 'Preencha conforme a abertura do chamado e atualize diariamente de acordo com o acompanhamento na ferramenta de chamados.' } ],
    links: [
      { t: 'Jira — abrir e acompanhar chamado', u: 'https://estaparjsm.atlassian.net/servicedesk/customer/portals', k: 'chamado' },
      { t: 'Diário de Bordo (acompanhamento de chamados)', u: 'https://docs.google.com/spreadsheets/d/11lzbitWuULt8pcRxGzEhqzkO1LjiHYvKqlDRBwSJjsg/edit?gid=881233098', k: 'planilha' } ] },

  { id: 'cancela', dept: 'Operação', titulo: 'Cancelamento de ticket ou abertura manual de cancela',
    sub: 'Sempre que cancelar um ticket ou abrir a cancela manualmente, registre na planilha.',
    todos: true, per: ['Quando necessário'], sis: ['Planilha de registro'], papeis: [],
    links: [ { t: 'Abertura manual de cancela e cancelamento de ticket', u: 'https://docs.google.com/spreadsheets/d/1zHzsCe1V5iOalQpOPDowBXLKXCjtbwOxe8b0RGhw05w/edit?gid=434386130', k: 'planilha' } ] }
];
