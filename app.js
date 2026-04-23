// Função auxiliar para criar item com novo design
function criarItemElement(texto, id) {
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    
    // Container do conteúdo
    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    
    // Checkbox customizado
    const checkbox = document.createElement('div');
    checkbox.className = 'item-checkbox';
    checkbox.onclick = (e) => {
        e.stopPropagation();
        checkbox.classList.toggle('checked');
        const itemText = li.querySelector('.item-text');
        itemText.classList.toggle('completed');
        // Aqui você pode adicionar lógica para salvar estado
    };
    
    // Texto do item
    const itemText = document.createElement('span');
    itemText.className = 'item-text';
    itemText.textContent = texto;
    
    itemContent.appendChild(checkbox);
    itemContent.appendChild(itemText);
    
    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', 'Remover item');
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        li.classList.add('removing');
        setTimeout(() => {
            li.remove();
            atualizarContador();
            // Chamar sua função de remoção do backend aqui
        }, 300);
    };
    
    li.appendChild(itemContent);
    li.appendChild(deleteBtn);
    
    return li;
}

// Sobrescrever adicionarItem para usar novo design
const originalAdicionarItem = window.adicionarItem;
window.adicionarItem = function() {
    const input = document.getElementById('item');
    const texto = input.value.trim();
    
    if (texto) {
        const lista = document.getElementById('lista');
        const novoItem = criarItemElement(texto, Date.now());
        lista.appendChild(novoItem);
        input.value = '';
        input.focus();
        atualizarContador();
        
        // Chamar função original se existir (para backend)
        if (typeof originalAdicionarItem === 'function') {
            originalAdicionarItem();
        }
    } else {
        // Feedback visual para input vazio
        input.style.borderColor = 'var(--cor-danger)';
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.animation = '';
        }, 500);
    }
};

// Adicionar animação shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);