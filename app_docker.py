"""
==============================================================================
API de Inteligência Artificial com Flask - Versão Docker
==============================================================================
Aplicação Flask otimizada para execução em containers Docker.
Inclui configurações específicas para ambiente de produção.
==============================================================================
Autor: Prof. Sérgio Monteiro, D.Sc.
==============================================================================
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import sys

# Importa o serviço de IA
try:
    from servicos.servico_ia import ServicoIA
except ImportError as erro:
    print(f"❌ Erro ao importar serviços: {erro}")
    sys.exit(1)

# ==============================================================================
# Configuração da Aplicação Flask
# ==============================================================================

app = Flask(__name__)

# Habilita CORS para permitir requisições de qualquer origem
CORS(app)

# Configurações específicas para Docker
app.config['JSON_AS_ASCII'] = False  # Suporte correto para caracteres UTF-8
app.config['JSON_SORT_KEYS'] = False  # Mantém ordem das chaves JSON

# ==============================================================================
# Inicialização do Serviço de IA
# ==============================================================================

print("\n" + "="*60)
print("🚀 API de Inteligência Artificial - Versão Docker")
print("="*60)
print(f"📍 Interface Web: http://0.0.0.0:5000")
print(f"📍 API Base URL: http://0.0.0.0:5000/api")
print(f"💡 Executando em container Docker")
print("="*60)

# Inicializa o serviço de IA
servico_ia = ServicoIA()

print("\n" + "="*60)
print("🤖 Pré-carregando modelos de IA...")
print("="*60)

try:
    servico_ia.pre_carregar_modelos()
    print("\n✅ Modelos carregados com sucesso!")
except Exception as erro:
    print(f"\n⚠️  Aviso: Erro ao pré-carregar modelos: {erro}")
    print("Os modelos serão carregados sob demanda.")

# ==============================================================================
# Rotas da Interface Web
# ==============================================================================

@app.route('/')
def pagina_inicial():
    """Renderiza a página inicial da aplicação"""
    return render_template('index.html')

# ==============================================================================
# Rotas da API REST
# ==============================================================================

@app.route('/api/status', methods=['GET'])
def status_api():
    """
    Retorna o status de funcionamento da API
    
    Returns:
        JSON com informações sobre a API e seus endpoints
    """
    return jsonify({
        'status': 'online',
        'versao': '2.0.0',
        'ambiente': 'docker',
        'mensagem': 'API de IA funcionando corretamente em container Docker',
        'endpoints': {
            'status': '/api/status',
            'modelo': '/api/modelo',
            'sentimento': '/api/sentimento',
            'gerar': '/api/gerar',
            'resumir': '/api/resumir'
        }
    })

@app.route('/api/modelo', methods=['GET'])
def informacoes_modelo():
    """
    Retorna informações sobre os modelos de IA utilizados
    
    Returns:
        JSON com detalhes dos modelos
    """
    info = servico_ia.obter_informacoes_modelo()
    return jsonify(info)

@app.route('/api/sentimento', methods=['POST'])
def analisar_sentimento():
    """
    Analisa o sentimento de um texto
    
    Request Body:
        {
            "texto": "string"
        }
    
    Returns:
        JSON com o resultado da análise de sentimento
    """
    try:
        # Obtém os dados da requisição
        dados = request.get_json()
        
        # Validação
        if not dados or 'texto' not in dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Campo "texto" é obrigatório'
            }), 400
        
        texto = dados['texto']
        
        # Valida se o texto não está vazio
        if not texto.strip():
            return jsonify({
                'sucesso': False,
                'erro': 'O texto não pode estar vazio'
            }), 400
        
        # Faz a análise de sentimento
        resultado = servico_ia.analisar_sentimento(texto)
        
        return jsonify(resultado)
        
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': str(erro)
        }), 500

@app.route('/api/gerar', methods=['POST'])
def gerar_texto():
    """
    Gera um texto sobre um tema específico
    
    Request Body:
        {
            "tema": "string",
            "tamanho": "curto|medio|longo" (opcional, padrão: "medio")
        }
    
    Returns:
        JSON com o texto gerado
    """
    try:
        # Obtém os dados da requisição
        dados = request.get_json()
        
        # Validação
        if not dados or 'tema' not in dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Campo "tema" é obrigatório'
            }), 400
        
        tema = dados['tema']
        tamanho = dados.get('tamanho', 'medio')
        
        # Valida se o tema não está vazio
        if not tema.strip():
            return jsonify({
                'sucesso': False,
                'erro': 'O tema não pode estar vazio'
            }), 400
        
        # Gera o texto
        resultado = servico_ia.gerar_texto(tema, tamanho)
        
        return jsonify(resultado)
        
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': str(erro)
        }), 500

@app.route('/api/resumir', methods=['POST'])
def resumir_texto():
    """
    Resume um texto
    
    Request Body:
        {
            "texto": "string",
            "tamanho_resumo": "curto|medio|longo" (opcional, padrão: "medio")
        }
    
    Returns:
        JSON com o resumo do texto
    """
    try:
        # Obtém os dados da requisição
        dados = request.get_json()
        
        # Validação
        if not dados or 'texto' not in dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Campo "texto" é obrigatório'
            }), 400
        
        texto = dados['texto']
        tamanho_resumo = dados.get('tamanho_resumo', 'medio')
        
        # Valida se o texto não está vazio
        if not texto.strip():
            return jsonify({
                'sucesso': False,
                'erro': 'O texto não pode estar vazio'
            }), 400
        
        # Faz o resumo
        resultado = servico_ia.resumir_texto(texto, tamanho_resumo)
        
        return jsonify(resultado)
        
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': str(erro)
        }), 500

# ==============================================================================
# Inicialização do Servidor
# ==============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🌐 Iniciando servidor Flask em modo Docker...")
    print("="*60 + "\n")
    
    # Configurações para Docker
    # 0.0.0.0 permite acesso de fora do container
    # port=5000 é a porta padrão
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False  # Desabilitado em produção
    )

