# Portal de Atribuição de Responsabilidades — Estapar

Portal de consulta para líderes, analistas e supervisão das garagens Estapar. Ele mostra **o que fazer, quando fazer e onde fazer**: rotinas diárias, semanais, mensais e eventuais, com acesso direto a cada sistema ou planilha.

- **Somente consulta:** o preenchimento continua nos sistemas e planilhas oficiais.
- **Acesso sem login:** abre para qualquer pessoa com o link e não aparece em buscadores (`noindex`).
- **Sem custo:** hospedado no GitHub Pages.
- **Modelo reutilizável:** outra regional ou gestor cria o próprio portal editando um único arquivo.

---

## Estrutura

```
├── index.html          Página do portal (estrutura)
├── dados.js            CONTEÚDO: área, garagens, tarefas, prazos, links, avisos e dúvidas
├── 404.html            Página de erro com a identidade Estapar
└── assets/
    ├── css/site.css    Identidade visual (Poppins, verde Estapar, animações)
    ├── js/site.js      Filtros, links compartilháveis e animações
    └── img/            Logo Estapar, Esta Power e selo GPTW (arquivos oficiais, não redesenhar)
```

> Para atualizar o conteúdo, edite **apenas o `dados.js`**. Os demais arquivos formam o padrão visual e não devem ser alterados por regional.

---

## Como atualizar o conteúdo

1. Abra o repositório no GitHub e clique em **`dados.js`**.
2. Clique no ícone de lápis (**Edit this file**).
3. Faça a alteração e clique em **Commit changes**.
4. O portal é atualizado automaticamente em 1 a 2 minutos.

### O que cada bloco do `dados.js` controla

| Bloco | O que controla |
|---|---|
| `SITE` | Nome da área/regional, data de atualização, versão e responsável pelo conteúdo (cargo) |
| `GARAGENS` | Lista de garagens (`obs` exibe um selo, por exemplo "Em implantação") |
| `AVISOS` | Faixa de destaque abaixo da capa |
| `ATIVIDADES` | Tarefas: departamento, quem faz, periodicidade, o que fazer, prazo e links |
| `PRAZOS` | Cartões da seção "Prazos de entrega" |
| `DUVIDAS` | Perguntas frequentes |

### Valores aceitos

- **Periodicidade (`p`)**: `'Diária'`, `'Semanal'`, `'Mensal'`, `'Quando necessário'`
- **Função (`r`)**: `'Liderança'`, `'Analista'`, `'Supervisão'`
- **Tipo de link (`k`)**: `'planilha'`, `'sistema'`, `'chamado'`, `'portal'`
- **`rede: true`**: indica um link que só abre na rede Estapar ou pela VPN
- **Link por garagem**: `g: { 'Hopi Hari': 'https://...', 'CES II': 'https://...' }`

### Exemplo de tarefa

```js
{ id: 'exemplo', dept: 'Financeiro', titulo: 'Nome da tarefa',
  sub: 'Descrição curta (opcional)',
  sis: ['Sistema ou planilha usada'],
  papeis: [
    { r: 'Liderança',  p: ['Diária'],  o: 'O que a liderança deve fazer.' },
    { r: 'Supervisão', p: ['Mensal'],  o: 'O que a supervisão deve fazer.' } ],
  prazo: 'Até as <b>16:59</b> em dias úteis',
  links: [ { t: 'Nome do link', u: 'https://...', k: 'planilha' } ] },
```

### Cuidados

- Textos sempre entre aspas simples: `'assim'`. Use o apóstrofo curvo (’) dentro do texto.
- Mantenha as vírgulas entre os blocos.
- Antes de salvar, confira se a página continua abrindo normalmente.

---

## Links compartilháveis

O endereço guarda os filtros. O líder pode receber um link que já abre na garagem e na função dele:

```
.../atribuicao-responsabilidades/?garagem=Hopi%20Hari&funcao=Lideran%C3%A7a#rotina
```

No portal, use **Compartilhar** (no topo) ou **Copiar link desta visão**.

---

## Criar o portal de outra regional (gestores)

1. Neste repositório, clique em **Use this template › Create a new repository**.
2. Escolha a organização Estapar como proprietária e dê um nome, por exemplo `responsabilidades-regional-sp`.
3. Em **Settings › Pages**, selecione *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. Edite o `dados.js` com a área, as garagens e as tarefas da regional.
5. Em `404.html`, troque `/atribuicao-responsabilidades/` pelo nome do novo repositório.
6. O endereço será `https://<organizacao>.github.io/<nome-do-repositorio>/`.

---

## Permissões

- **Edição:** somente membros da organização com acesso ao repositório (**Settings › Collaborators and teams**).
- **Visualização:** qualquer pessoa com o link. Os sistemas acessados pelos botões continuam exigindo login próprio.

## Identidade visual

Poppins; verde Estapar `#70D44B`, verde-água `#73E0C1`, grafite `#151618`. Logo Estapar, Esta Power e selo GPTW em arquivos oficiais. A capa usa a animação de estacionamento padrão dos painéis Estapar. O layout se adapta a computador, tablet e celular, e o portal respeita a preferência do sistema por menos movimento.
