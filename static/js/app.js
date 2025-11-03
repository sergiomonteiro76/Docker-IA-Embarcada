/**
 * Aplicação JavaScript para Interface da API de IA
 * Este arquivo contém todas as funções para interagir com a API
 */

// URL base da API
const URL_BASE = 'http://localhost:5000/api';

// ==================== FUNÇÕES UTILITÁRIAS ====================

/**
 * Exibe uma mensagem de loading em um elemento
 * @param {string} idElemento - ID do elemento onde exibir o loading
 */
function mostrarLoading(idElemento) {
    const elemento = document.getElementById(idElemento);
    elemento.innerHTML = '<div class="loading"></div> <span>Processando...</span>';
    elemento.classList.add('visivel');
    elemento.classList.remove('sucesso', 'erro');
}

/**
 * Exibe uma mensagem de sucesso
 * @param {string} idElemento - ID do elemento onde exibir a mensagem
 * @param {string} mensagem - Mensagem a ser exibida
 */
function mostrarSucesso(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.innerHTML = mensagem;
    elemento.classList.add('visivel', 'sucesso');
    elemento.classList.remove('erro');
}

/**
 * Exibe uma mensagem de erro
 * @param {string} idElemento - ID do elemento onde exibir o erro
 * @param {string} mensagem - Mensagem de erro
 */
function mostrarErro(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.innerHTML = `<h3>❌ Erro</h3><p>${mensagem}</p>`;
    elemento.classList.add('visivel', 'erro');
    elemento.classList.remove('sucesso');
}

/**
 * Faz uma requisição para a API
 * @param {string} endpoint - Endpoint da API
 * @param {string} metodo - Método HTTP (GET ou POST)
 * @param {object} dados - Dados a serem enviados (para POST)
 * @returns {Promise} - Promise com a resposta da API
 */
async function fazerRequisicao(endpoint, metodo = 'GET', dados = null) {
    const opcoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (dados && metodo === 'POST') {
        opcoes.body = JSON.stringify(dados);
    }
    
    try {
        const resposta = await fetch(`${URL_BASE}${endpoint}`, opcoes);
        const json = await resposta.json();
        return json;
    } catch (erro) {
        throw new Error(`Erro na requisição: ${erro.message}`);
    }
}

// ==================== FUNÇÕES DE STATUS ====================

/**
 * Verifica o status da API
 */
async function verificarStatus() {
    const elementoStatus = document.getElementById('status-api');
    
    try {
        elementoStatus.innerHTML = '<div class="loading"></div> <span>Verificando...</span>';
        
        const resultado = await fazerRequisicao('/status');
        
        if (resultado.status === 'online') {
            const numEndpoints = resultado.endpoints ? Object.keys(resultado.endpoints).length : 0;
            elementoStatus.innerHTML = `
                <h3>✅ ${resultado.mensagem}</h3>
                <p><strong>Versão:</strong> ${resultado.versao}</p>
                <p><strong>Ambiente:</strong> ${resultado.ambiente || 'local'}</p>
                <p><strong>Endpoints disponíveis:</strong> ${numEndpoints}</p>
                <p style="font-size: 0.9rem; color: var(--cor-texto-secundario); margin-top: 8px;">
                    Última verificação: ${new Date().toLocaleTimeString('pt-BR')}
                </p>
            `;
        }
    } catch (erro) {
        elementoStatus.innerHTML = `
            <h3>❌ Erro ao verificar status</h3>
            <p>${erro.message}</p>
        `;
    }
}

/**
 * Carrega as informações do modelo de IA
 */
async function carregarInformacoesModelo() {
    const elementoInfo = document.getElementById('info-modelo');
    
    try {
        elementoInfo.innerHTML = '<div class="loading"></div> <span>Carregando...</span>';
        
        const resultado = await fazerRequisicao('/modelo');
        
        const capacidadesHTML = resultado.capacidades && resultado.capacidades.length > 0
            ? resultado.capacidades.map(cap => `<li>✓ ${cap}</li>`).join('')
            : '<li>Informações não disponíveis</li>';
        
        // Exibe os modelos usados
        let modelosHTML = '';
        if (resultado.modelos) {
            modelosHTML = `
                <p><strong>Modelos:</strong></p>
                <ul style="margin-left: 20px; font-size: 0.9rem;">
                    <li>Sentimento: ${resultado.modelos.sentimento}</li>
                    <li>Geração: ${resultado.modelos.geracao}</li>
                    <li>Resumo: ${resultado.modelos.resumo}</li>
                </ul>
            `;
        }
        
        elementoInfo.innerHTML = `
            <h3>🤖 Hugging Face (Modelos Locais)</h3>
            <p><strong>Provedor:</strong> ${resultado.provedor}</p>
            <p><strong>Dispositivo:</strong> ${resultado.dispositivo}</p>
            <p><strong>Descrição:</strong> ${resultado.descricao}</p>
            ${modelosHTML}
            <p><strong>Capacidades:</strong></p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                ${capacidadesHTML}
            </ul>
        `;
    } catch (erro) {
        elementoInfo.innerHTML = `
            <h3>❌ Erro ao carregar informações</h3>
            <p>${erro.message}</p>
        `;
    }
}

// ==================== ANÁLISE DE SENTIMENTO ====================

/**
 * Analisa o sentimento de um texto
 */
async function analisarSentimento() {
    const textoInput = document.getElementById('texto-sentimento');
    const texto = textoInput.value.trim();
    
    // Validação
    if (!texto) {
        mostrarErro('resultado-sentimento', 'Por favor, digite um texto para análise.');
        return;
    }
    
    // Mostra loading
    mostrarLoading('resultado-sentimento');
    
    try {
        // Faz a requisição
        const resultado = await fazerRequisicao('/sentimento', 'POST', { texto });
        
        if (resultado.sucesso) {
            // Define a classe do badge baseado no sentimento
            let classeBadge = 'badge-neutro';
            let emoji = '😐';
            
            if (resultado.sentimento === 'POSITIVO') {
                classeBadge = 'badge-positivo';
                emoji = '😊';
            } else if (resultado.sentimento === 'NEGATIVO') {
                classeBadge = 'badge-negativo';
                emoji = '😞';
            }
            
            // Exibe o resultado
            const mensagem = `
                <h3>✅ Análise Concluída</h3>
                <p><strong>Texto analisado:</strong> "${resultado.texto_original}"</p>
                <p><strong>Sentimento detectado:</strong></p>
                <div class="badge-sentimento ${classeBadge}">
                    ${emoji} ${resultado.sentimento}
                </div>
                <p style="font-size: 0.85rem; color: var(--cor-texto-secundario); margin-top: 12px;">
                    Tokens utilizados: ${resultado.tokens_usados}
                </p>
            `;
            
            mostrarSucesso('resultado-sentimento', mensagem);
        } else {
            mostrarErro('resultado-sentimento', resultado.mensagem || resultado.erro);
        }
    } catch (erro) {
        mostrarErro('resultado-sentimento', erro.message);
    }
}

// ==================== GERAÇÃO DE TEXTO ====================

/**
 * Gera um texto sobre um tema
 */
async function gerarTexto() {
    const temaInput = document.getElementById('tema-texto');
    const tamanhoSelect = document.getElementById('tamanho-texto');
    
    const tema = temaInput.value.trim();
    const tamanho = tamanhoSelect.value;
    
    // Validação
    if (!tema) {
        mostrarErro('resultado-geracao', 'Por favor, digite um tema para gerar o texto.');
        return;
    }
    
    // Mostra loading
    mostrarLoading('resultado-geracao');
    
    try {
        // Faz a requisição
        const resultado = await fazerRequisicao('/gerar', 'POST', { tema, tamanho });
        
        if (resultado.sucesso) {
            // Exibe o resultado
            const mensagem = `
                <h3>✅ Texto Gerado com Sucesso</h3>
                <p><strong>Tema:</strong> ${resultado.tema}</p>
                <p><strong>Tamanho:</strong> ${resultado.tamanho_solicitado}</p>
                <div style="background-color: var(--cor-fundo); padding: 16px; border-radius: 8px; margin-top: 12px; border-left: 4px solid var(--cor-primaria);">
                    <p style="white-space: pre-wrap; line-height: 1.8;">${resultado.texto_gerado}</p>
                </div>
                <p style="font-size: 0.85rem; color: var(--cor-texto-secundario); margin-top: 12px;">
                    Tokens utilizados: ${resultado.tokens_usados}
                </p>
            `;
            
            mostrarSucesso('resultado-geracao', mensagem);
        } else {
            mostrarErro('resultado-geracao', resultado.mensagem || resultado.erro);
        }
    } catch (erro) {
        mostrarErro('resultado-geracao', erro.message);
    }
}

// ==================== RESUMO DE TEXTO ====================

/**
 * Resume um texto
 */
async function resumirTexto() {
    const textoInput = document.getElementById('texto-resumir');
    const tamanhoSelect = document.getElementById('tamanho-resumo');
    
    const texto = textoInput.value.trim();
    const tamanho_resumo = tamanhoSelect.value;
    
    // Validação
    if (!texto) {
        mostrarErro('resultado-resumo', 'Por favor, digite um texto para resumir.');
        return;
    }
    
    // Mostra loading
    mostrarLoading('resultado-resumo');
    
    try {
        // Faz a requisição
        const resultado = await fazerRequisicao('/resumir', 'POST', { texto, tamanho_resumo });
        
        if (resultado.sucesso) {
            // Exibe o resultado
            const mensagem = `
                <h3>✅ Resumo Gerado com Sucesso</h3>
                <p><strong>Tamanho do resumo:</strong> ${resultado.tamanho_resumo}</p>
                <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin-top: 12px; border-left: 4px solid var(--cor-sucesso);">
                    <p style="white-space: pre-wrap; line-height: 1.8;"><strong>📝 Resumo:</strong><br>${resultado.resumo}</p>
                </div>
                <details style="margin-top: 12px;">
                    <summary style="cursor: pointer; color: var(--cor-primaria); font-weight: 600;">
                        Ver texto original
                    </summary>
                    <div style="background-color: var(--cor-fundo); padding: 16px; border-radius: 8px; margin-top: 8px;">
                        <p style="white-space: pre-wrap; line-height: 1.8;">${resultado.texto_original}</p>
                    </div>
                </details>
                <p style="font-size: 0.85rem; color: var(--cor-texto-secundario); margin-top: 12px;">
                    Tokens utilizados: ${resultado.tokens_usados}
                </p>
            `;
            
            mostrarSucesso('resultado-resumo', mensagem);
        } else {
            mostrarErro('resultado-resumo', resultado.mensagem || resultado.erro);
        }
    } catch (erro) {
        mostrarErro('resultado-resumo', erro.message);
    }
}

// ==================== INICIALIZAÇÃO ====================

/**
 * Função executada quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Interface da API de IA carregada!');
    console.log('📍 URL Base:', URL_BASE);
    
    // Carrega informações iniciais
    verificarStatus();
    carregarInformacoesModelo();
    
    // Adiciona listeners para Enter nos campos de texto
    document.getElementById('texto-sentimento').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analisarSentimento();
        }
    });
    
    document.getElementById('tema-texto').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            gerarTexto();
        }
    });
    
    console.log('✅ Todos os event listeners configurados!');
});

