// ===== Posts de exemplo =====
const POSTS = [
  {
    id: 1,
    titulo: "Simples Nacional: o que muda em 2025",
    categoria: "Impostos",
    legenda: "Tributário",
    data: "2025-03-14",
    destaque: true,
    descricao_curta: "Principais alterações previstas e como se preparar para não pagar a mais.",
    corpo: `<p>O regime do Simples Nacional pode sofrer mudanças em 2025. Nesta matéria, a equipe da NOPAPER resume os pontos de atenção mais comuns: reenquadramento de anexos, sublimites e novas obrigações acessórias.</p>
    <p>Para empresas de serviços, vale revisar o fator <em>R</em> e simular os cenários com e sem folha de pagamento. O planejamento tributário continua sendo essencial.</p>`
  },
  {
    id: 2,
    titulo: "eSocial: checklist trabalhista para o primeiro semestre",
    categoria: "Trabalhista",
    legenda: "Pessoal & RH",
    data: "2025-02-02",
    descricao_curta: "Calendário prático para cumprir eventos periódicos sem dor de cabeça.",
    corpo: `<p>Reunimos um checklist com os eventos do eSocial e prazos do primeiro semestre. Agende a admissão com antecedência, mantenha os dados cadastrais atualizados e valide as rubricas da folha.</p>`
  },
  {
    id: 3,
    titulo: "Controle de caixa: 5 indicadores para micro e pequenas",
    categoria: "Gestão",
    legenda: "Finanças",
    data: "2025-01-21",
    descricao_curta: "Fluxo de caixa, ciclo financeiro e outros indicadores fáceis de acompanhar.",
    corpo: `<p>Para ganhar previsibilidade, acompanhe entradas e saídas semanalmente, calcule o ciclo financeiro e defina um mínimo de reserva.</p>`
  },
  {
    id: 4,
    titulo: "Obrigações de fim de ano para empresas do Lucro Presumido",
    categoria: "Impostos",
    legenda: "Checklist",
    data: "2024-12-10",
    descricao_curta: "Confira o calendário de declarações e guias para não perder prazos.",
    corpo: `<p>Encerramento de ano exige atenção a ECF, ECD, DCTF, dentre outras. Nosso time preparou um resumo com prazos e documentos necessários.</p>`
  },
  {
    id: 5,
    titulo: "Por que terceirizar o BPO Financeiro?",
    categoria: "Gestão",
    legenda: "BPO",
    data: "2024-11-02",
    descricao_curta: "Vantagens práticas para PME: eficiência, controle e foco no core.",
    corpo: `<p>Terceirizar o financeiro reduz riscos operacionais e libera tempo do empreendedor. Veja como funciona nossa metodologia de BPO e quando faz sentido para sua empresa.</p>`
  },
  {
    id: 6,
    titulo: "Atualização: carteira de serviços NOPAPER 2025",
    categoria: "Atualizações",
    legenda: "Novidades",
    data: "2025-03-05",
    descricao_curta: "Conheça os novos pacotes e integrações com ERPs populares.",
    corpo: `<p>Lançamos novos pacotes com integrações nativas a ERPs e bancos. Fale com nosso time para um diagnóstico gratuito.</p>`
  }
];

const CATEGORIES = [...new Set(POSTS.map(p => p.categoria))];

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'});
}
function badgeClass(cat){
  const map = {
    "Impostos":"cat-impostos",
    "Gestão":"cat-gestao",
    "Trabalhista":"cat-trabalhista",
    "Atualizações":"cat-atualizacao"
  };
  return map[cat] || "";
}

function renderFilters(){
  const select = document.getElementById('categoryFilter');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    select.appendChild(opt);
  });
}

function cardTemplate(post){
  return `
  <article class="card" data-id="${post.id}">
    <div class="card-media">
      <span class="badge ${badgeClass(post.categoria)}">${post.legenda || post.categoria}</span>
    </div>
    <div class="card-body">
      <h3>${post.titulo}</h3>
      <p>${post.descricao_curta}</p>
      <div class="meta">
        <span>${post.categoria}</span>
        <span>•</span>
        <time datetime="${post.data}">${formatDate(post.data)}</time>
      </div>
    </div>
  </article>`;
}

function renderCards(list){
  const grid = document.getElementById('cards');
  if(!Array.isArray(list) || list.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;color:#64748b">Nenhuma notícia encontrada.</div>`;
    return;
  }
  grid.innerHTML = list.map(cardTemplate).join('');
  grid.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', () => {
      const id = +el.getAttribute('data-id');
      openModal(POSTS.find(p => p.id === id));
    });
  });
}

function openModal(post){
  const dlg = document.getElementById('postModal');
  document.getElementById('modalBadge').textContent = post.legenda || post.categoria;
  document.getElementById('modalTitle').textContent = post.titulo;
  document.getElementById('modalMeta').textContent = `${post.categoria} • ${formatDate(post.data)}`;
  document.getElementById('modalBody').innerHTML = post.corpo;
  dlg.showModal();
}
function closeModal(){ document.getElementById('postModal').close(); }

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  console.log("NOPAPER blog: carregando", POSTS.length, "posts"); // ajuda a depurar

  renderFilters();
  renderCards(POSTS);

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  function applyFilters(){
    const q = (searchInput.value || "").toLowerCase();
    const cat = categoryFilter.value;
    const filtered = POSTS.filter(p => {
      const matchesText = p.titulo.toLowerCase().includes(q) || p.descricao_curta.toLowerCase().includes(q);
      const matchesCat = !cat || p.categoria === cat;
      return matchesText && matchesCat;
    });
    renderCards(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  const modal = document.getElementById('postModal');
  modal.querySelector('.close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
});
