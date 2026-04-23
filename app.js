// app.js - Gerenciamento da Lista de Compras
// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicialização (comentada para funcionar offline)
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const db = firebase.firestore();

// Estado da aplicação
let listaCompras = [];
let filtroAtual = 'todos';
let usuarioAtual = null;

// Dados simulados para teste
const dadosMockados = [
    {
        id: 1,
        nome: "Peito de Frango",
        categoria: "carnes",
        quantidade: 2,
        comprado: false,
        dataAdicao: new Date().toISOString(),
        emoji: "🍗"
    },
    {
        id: 2,
        nome: "Alface",
        categoria: "vegetais",
        quantidade: 1,
        comprado: true,
        dataAdicao: new Date().toISOString(),
        emoji: "🥬"
    },
    {
        id: 3,
        nome: "Banana",
        categoria: "frutas",
        quantidade: 6,
        comprado: false,
        dataAdicao: new Date().toISOString(),
        emoji: "🍌"
    },
    {
        id: 4,
        nome: "Leite",
        categoria: "laticinios",
        quantidade: 2,
        comprado: false,
        dataAdicao: new Date().toISOString(),
        emoji: "🥛"
    },
    {
        id: 5,
        nome: "Detergente",
        categoria: "limpeza",
        quantidade: 1,
        comprado: false,
        dataAdicao: new Date().toISOString(),
        emoji: "🧴"
    }
];

// Mapeamento de categorias com emojis
const categoriasEmojis = {
    'carnes': '🥩',
    'vegetais': '🥬',
    'frutas': '🍎',
    'laticinios': '🧀',
    'padaria': '🍞',
    'bebidas': '🥤',
    'limpeza': '🧹',
    'higiene': '🧴',
    'enlatados': '🥫',
    'graos': '🌾',
    'temperos': '🌶️',
    'outros': '📦'
};

// Sistema de classificação automática
const classificacaoAutomatica = {
    carnes: ['carne', 'frango', 'peixe', 'porco', 'boi', 'bacon', 'presunto', 'salsicha', 'linguiça', 'hambúrguer', 'mortadela', 'salame', 'peito de frango', 'filé', 'costela', 'picanha', 'alcatra', 'carne moída'],
    vegetais: ['alface', 'tomate', 'cebola', 'alho', 'cenoura', 'batata', 'brócolis', 'couve', 'espinafre', 'repolho', 'abóbora', 'berinjela', 'abobrinha', 'pepino', 'pimentão', 'beterraba', 'chuchu', 'vagem', 'milho verde'],
    frutas: ['banana', 'maçã', 'laranja', 'uva', 'morango', 'abacaxi', 'manga', 'melancia', 'melão', 'pera', 'kiwi', 'limão', 'abacate', 'ameixa', 'pêssego', 'cereja', 'framboesa', 'mirtilo', 'coco', 'maracujá', 'goiaba', 'acerola'],
    laticinios: ['leite', 'queijo', 'manteiga', 'iogurte', 'requeijão', 'creme de leite', 'leite condensado', 'margarina', 'ricota', 'cottage', 'mussarela', 'parmesão', 'provolone', 'catupiry', 'leite em pó', 'nata'],
    padaria: ['pão', 'bolo', 'biscoito', 'torrada', 'bolacha', 'croissant', 'baguete', 'pão de queijo', 'sonho', 'rosca', 'brioche', 'pão integral', 'pão francês', 'pão doce'],
    bebidas: ['água', 'refrigerante', 'suco', 'cerveja', 'vinho', 'café', 'chá', 'energético', 'achocolatado', 'leite de soja', 'água de coco', 'isotônico', 'champanhe', 'vodka', 'whisky'],
    limpeza: ['detergente', 'sabão', 'desinfetante', 'água sanitária', 'limpador', 'esponja', 'pano', 'balde', 'vassoura', 'rodo', 'luva', 'saco de lixo', 'lustra móveis', 'limpa vidros', 'álcool', 'amaciante', 'alvejante'],
    higiene: ['shampoo', 'condicionador', 'sabonete', 'pasta de dente', 'escova de dente', 'desodorante', 'perfume', 'creme', 'protetor solar', 'algodão', 'fio dental', 'enxaguante bucal', 'absorvente', 'lâmina', 'barbeador'],
    enlatados: ['sardinha', 'atum', 'milho', 'ervilha', 'leite condensado', 'creme de leite', 'molho de tomate', 'extrato de tomate', 'seleta', 'palmito', 'azeitona', 'picles', 'patê'],
    graos: ['arroz', 'feijão', 'lentilha', 'grão de bico', 'aveia', 'farinha', 'macarrão', 'quinoa', 'soja', 'trigo', 'granola', 'cereal', 'farinha de rosca', 'amido de milho', 'fubá'],
    temperos: ['sal', 'açúcar', 'pimenta', 'orégano', 'cominho', 'colorau', 'canela', 'noz moscada', 'cravo', 'louro', 'vinagre', 'óleo', 'azeite', 'molho shoyu', 'ketchup', 'mostarda', 'maionese', 'catchup', 'tempero', 'caldo']
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App inicializado com sucesso!');
    inicializarApp();
});

function inicializarApp() {
    // Esconder loader
    const loader = document.getElementById('loader');
    if (loader) {
        loader.hidden = true;
    }
    
    // Verificar autenticação (simulada)
    verificarAutenticacao();
    
    // Carregar dados
    carregarDados();
    
    // Atualizar interface
    atualizarInterface();
    
    // Adicionar event listeners
    adicionarEventListeners();
    
    // Mostrar mensagem de boas-vindas
    mostrarMensagemBoasVindas();
}

function verificarAutenticacao() {
    // Simular usuário logado
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        usuarioAtual = JSON.parse(userData);
    } else {
        // Usuário de demonstração
        usuarioAtual = {
            nome: 'Usuário Demo',
            email: 'demo@lista2026.com'
        };
        localStorage.setItem('userData', JSON.stringify(usuarioAtual));
    }
    
    // Atualizar informações do usuário na interface
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    
    if (userNameElement) userNameElement.textContent = usuarioAtual.nome;
    if (userEmailElement) userEmailElement.textContent = usuarioAtual.email;
}

function carregarDados() {
    // Tentar carregar do localStorage
    const dadosSalvos = localStorage.getItem('listaCompras');
    
    if (dadosSalvos) {
        try {
            listaCompras = JSON.parse(dadosSalvos);
            console.log('📝 Dados carregados do localStorage');
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            listaCompras = [...dadosMockados];
        }
    } else {
        // Usar dados de demonstração
        listaCompras = [...dadosMockados];
        salvarDados();
        console.log('🎯 Dados de demonstração carregados');
    }
    
    console.log(`📊 ${listaCompras.length} itens carregados`);
}

function salvarDados() {
    try {
        localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
        console.log('💾 Dados salvos com sucesso');
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

function adicionarEventListeners() {
    // Adicionar item com Enter
    const inputItem = document.getElementById('item');
    if (inputItem) {
        inputItem.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                adicionarItem();
            }
        });
    }
    
    // Pesquisa em tempo real
    const inputPesquisa = document.getElementById('pesquisa');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', function() {
            filtrarItens();
            
            // Mostrar/ocultar botão limpar
            const clearBtn = document.querySelector('.clear-search');
            if (clearBtn) {
                clearBtn.hidden = this.value.length === 0;
            }
        });
    }
    
    // Limpar pesquisa ao pressionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            limparPesquisa();
        }
    });
}

function mostrarMensagemBoasVindas() {
    const hora = new Date().getHours();
    let saudacao = '';
    
    if (hora < 12) {
        saudacao = 'Bom dia';
    } else if (hora < 18) {
        saudacao = 'Boa tarde';
    } else {
        saudacao = 'Boa noite';
    }
    
    console.log(`👋 ${saudacao}, ${usuarioAtual.nome}!`);
}

// Função principal para adicionar item
function adicionarItem() {
    const inputItem = document.getElementById('item');
    const inputQuantidade = document.getElementById('quantidade');
    const selectCategoria = document.getElementById('categoria');
    
    if (!inputItem || !inputQuantidade || !selectCategoria) {
        console.error('❌ Elementos do formulário não encontrados');
        return;
    }
    
    const nomeItem = inputItem.value.trim();
    const quantidade = parseInt(inputQuantidade.value) || 1;
    let categoria = selectCategoria.value;
    
    // Validação
    if (!nomeItem) {
        mostrarFeedback('Por favor, digite o nome do item', 'erro');
        inputItem.focus();
        return;
    }
    
    if (nomeItem.length < 2) {
        mostrarFeedback('O nome do item deve ter pelo menos 2 caracteres', 'erro');
        return;
    }
    
    // Classificação automática
    if (categoria === 'auto') {
        categoria = classificarItem(nomeItem.toLowerCase());
    }
    
    // Criar novo item
    const novoItem = {
        id: Date.now(),
        nome: nomeItem,
        categoria: categoria,
        quantidade: quantidade,
        comprado: false,
        dataAdicao: new Date().toISOString(),
        emoji: categoriasEmojis[categoria] || '📦'
    };
    
    // Adicionar à lista
    listaCompras.unshift(novoItem);
    
    // Salvar dados
    salvarDados();
    
    // Atualizar interface
    atualizarInterface();
    
    // Limpar formulário
    inputItem.value = '';
    inputQuantidade.value = '1';
    selectCategoria.value = 'auto';
    
    // Feedback
    mostrarFeedback(`${novoItem.emoji} ${nomeItem} adicionado à lista!`, 'sucesso');
    
    // Focar no input para próximo item
    inputItem.focus();
    
    console.log(`✅ Item adicionado: ${nomeItem} (${categoria})`);
}

function classificarItem(nomeItem) {
    const nomeLower = nomeItem.toLowerCase();
    
    for (const [categoria, palavrasChave] of Object.entries(classificacaoAutomatica)) {
        for (const palavra of palavrasChave) {
            if (nomeLower.includes(palavra)) {
                console.log(`🔍 Item classificado automaticamente: "${nomeItem}" → ${categoria}`);
                return categoria;
            }
        }
    }
    
    return 'outros';
}

function removerItem(id) {
    const item = listaCompras.find(i => i.id === id);
    
    if (confirm(`Deseja remover "${item.nome}" da lista?`)) {
        listaCompras = listaCompras.filter(i => i.id !== id);
        salvarDados();
        atualizarInterface();
        mostrarFeedback(`🗑️ ${item.nome} removido da lista`, 'info');
        console.log(`❌ Item removido: ${item.nome}`);
    }
}

function toggleItem(id) {
    const item = listaCompras.find(i => i.id === id);
    
    if (item) {
        item.comprado = !item.comprado;
        salvarDados();
        atualizarInterface();
        
        if (item.comprado) {
            mostrarFeedback(`✅ ${item.nome} marcado como comprado!`, 'sucesso');
        } else {
            mostrarFeedback(`↩️ ${item.nome} desmarcado`, 'info');
        }
        
        console.log(`🔄 Item atualizado: ${item.nome} → ${item.comprado ? 'Comprado' : 'Pendente'}`);
    }
}

function filtrarItens() {
    const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase().trim();
    
    atualizarInterface(termoPesquisa);
}

function filtrarPorCategoria(filtro) {
    filtroAtual = filtro;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filtro) {
            btn.classList.add('active');
        }
    });
    
    atualizarInterface();
}

function atualizarInterface(termoPesquisa = '') {
    const listaElement = document.getElementById('lista');
    const emptyState = document.getElementById('empty-state');
    
    if (!listaElement || !emptyState) {
        console.error('❌ Elementos da lista não encontrados');
        return;
    }
    
    // Filtrar itens
    let itensFiltrados = [...listaCompras];
    
    // Aplicar filtro de categoria
    if (filtroAtual === 'comprados') {
        itensFiltrados = itensFiltrados.filter(item => item.comprado);
    } else if (filtroAtual === 'pendentes') {
        itensFiltrados = itensFiltrados.filter(item => !item.comprado);
    }
    
    // Aplicar pesquisa
    if (termoPesquisa) {
        itensFiltrados = itensFiltrados.filter(item => 
            item.nome.toLowerCase().includes(termoPesquisa) ||
            item.categoria.toLowerCase().includes(termoPesquisa)
        );
    }
    
    // Ordenar: não comprados primeiro, depois por data
    itensFiltrados.sort((a, b) => {
        if (a.comprado === b.comprado) {
            return new Date(b.dataAdicao) - new Date(a.dataAdicao);
        }
        return a.comprado ? 1 : -1;
    });
    
    // Atualizar lista
    if (itensFiltrados.length === 0) {
        listaElement.innerHTML = '';
        emptyState.hidden = false;
    } else {
        emptyState.hidden = true;
        listaElement.innerHTML = itensFiltrados.map(item => `
            <li class="${item.comprado ? 'comprado' : ''}" data-id="${item.id}">
                <div class="item-info">
                    <span class="item-emoji">${item.emoji}</span>
                    <div class="item-details">
                        <span class="item-nome">${item.nome}</span>
                        <span class="item-categoria">${item.categoria}</span>
                    </div>
                    <span class="item-quantidade">x${item.quantidade}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-toggle" onclick="toggleItem(${item.id})" 
                            title="${item.comprado ? 'Desmarcar' : 'Marcar como comprado'}">
                        <i class="fas ${item.comprado ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn-delete" onclick="removerItem(${item.id})" 
                            title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }
    
    // Atualizar estatísticas
    atualizarEstatisticas();
    
    // Atualizar data
    atualizarDataAtualizacao();
}

function atualizarEstatisticas() {
    const totalItens = listaCompras.length;
    const itensComprados = listaCompras.filter(item => item.comprado).length;
    const categoriasUnicas = new Set(listaCompras.map(item => item.categoria)).size;
    
    const totalElement = document.getElementById('total-itens');
    const compradosElement = document.getElementById('itens-comprados');
    const categoriasElement = document.getElementById('categorias-count');
    
    if (totalElement) totalElement.textContent = totalItens;
    if (compradosElement) compradosElement.textContent = itensComprados;
    if (categoriasElement) categoriasElement.textContent = categoriasUnicas;
}

function atualizarDataAtualizacao() {
    const dataElement = document.getElementById('data-atualizacao');
    
    if (dataElement) {
        const agora = new Date();
        const formato = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        dataElement.textContent = `Última atualização: ${formato.format(agora)}`;
    }
}

function mostrarFeedback(mensagem, tipo = 'info') {
    // Criar elemento de feedback
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-message feedback-${tipo}`;
    feedbackDiv.innerHTML = `
        <i class="fas fa-${tipo === 'sucesso' ? 'check-circle' : tipo === 'erro' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    // Adicionar ao container
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(feedbackDiv, container.firstChild);
        
        // Remover após 3 segundos
        setTimeout(() => {
            feedbackDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (feedbackDiv.parentNode) {
                    feedbackDiv.parentNode.removeChild(feedbackDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Função de Logout (chamada pelo HTML)
function logout() {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
        // Limpar dados
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // Feedback de saída
        mostrarFeedback('Saindo... Até logo! 👋', 'info');
        
        // Redirecionar após breve delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Função para compartilhar lista
function compartilharLista() {
    const itens = listaCompras.map(item => 
        `${item.comprado ? '✅' : '⬜'} ${item.quantidade}x ${item.nome}`
    ).join('\n');
    
    const texto = `🛒 Minha Lista de Compras:\n\n${itens}\n\nTotal: ${listaCompras.length} itens`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Minha Lista de Compras',
            text: texto,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copiar para clipboard
        navigator.clipboard.writeText(texto).then(() => {
            mostrarFeedback('📋 Lista copiada para a área de transferência!', 'sucesso');
        }).catch(() => {
            alert('Lista de Compras:\n\n' + texto);
        });
    }
}

// Funções auxiliares expostas globalmente
window.adicionarItem = adicionarItem;
window.removerItem = removerItem;
window.toggleItem = toggleItem;
window.filtrarItens = filtrarItens;
window.filtrarPorCategoria = filtrarPorCategoria;
window.logout = logout;
window.compartilharLista = compartilharLista;

// Exportar funções
export {
    adicionarItem,
    removerItem,
    toggleItem,
    filtrarItens,
    filtrarPorCategoria,
    logout,
    compartilharLista
};

console.log('✅ App.js carregado e pronto para uso!');