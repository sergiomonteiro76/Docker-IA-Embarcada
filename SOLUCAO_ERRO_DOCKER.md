# Solução para Erro no Build do Docker

## 📋 Análise do Problema

Analisei os logs e identifiquei **dois problemas principais**:

### 1. **Erro Principal: Timeout de Conexão**
```
failed to receive status: rpc error: code = Unavailable desc = error reading from server: EOF
```

**Causa:** O build demorou **848 segundos (14 minutos)** para instalar as dependências Python (especialmente PyTorch), e a conexão com o Docker daemon foi perdida. Isso geralmente acontece quando:
- A instalação do PyTorch demora muito (é um pacote muito grande, ~800 MB)
- Problemas de rede ou proxy
- Timeout do Docker Desktop
- Recursos insuficientes (CPU/memória)

### 2. **Warning Secundário: Versão Obsoleta**
```
the attribute `version` is obsolete, it will be ignored
```

**Causa:** O docker-compose.yml usa a sintaxe antiga com `version: '3.8'`, que foi deprecada nas versões mais recentes do Docker Compose.

---

## ✅ Soluções

### **Solução 1: Aumentar Timeout e Recursos do Docker Desktop**

1. **Abra o Docker Desktop**
2. **Vá em Settings (Configurações)**
3. **Na aba "Resources" (Recursos):**
   - Aumente a **memória** para pelo menos **6 GB** (recomendado 8 GB)
   - Aumente os **CPUs** para pelo menos **4 cores**
   - Aumente o **Disk image size** se necessário

4. **Na aba "Docker Engine"**, adicione configuração de timeout:
   ```json
   {
     "builder": {
       "gc": {
         "defaultKeepStorage": "20GB",
         "enabled": true
       }
     },
     "experimental": false,
     "max-concurrent-downloads": 3,
     "max-concurrent-uploads": 5,
     "registry-mirrors": [],
     "timeout": 3600
   }
   ```

5. **Clique em "Apply & Restart"**

---

### **Solução 2: Corrigir o docker-compose.yml**

Remova a linha `version: '3.8'` do arquivo `docker-compose.yml`. Ela não é mais necessária.

**Arquivo corrigido:**

```yaml
# docker-compose.yml
# Configuração para orquestração da API de IA

services:
  api-ia:
    # Nome do serviço
    container_name: api-ia-flask
    
    # Construir a partir do Dockerfile local
    build:
      context: .
      dockerfile: Dockerfile
    
    # Mapeamento de portas (host:container)
    ports:
      - "5000:5000"
    
    # Variáveis de ambiente
    environment:
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    
    # Volumes para persistir cache dos modelos
    volumes:
      - modelos-cache:/root/.cache/huggingface
    
    # Política de reinicialização
    restart: unless-stopped
    
    # Healthcheck para monitorar saúde do container
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # Limites de recursos
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G

# Definição de volumes nomeados
volumes:
  modelos-cache:
    driver: local
```

---

### **Solução 3: Usar Imagem Python com PyTorch Pré-instalado (RECOMENDADO)**

Para evitar o longo tempo de instalação do PyTorch, vamos usar uma imagem base que já tem o PyTorch instalado.

**Crie um novo arquivo `Dockerfile.fast`:**

```dockerfile
# Dockerfile.fast
# Versão otimizada usando imagem com PyTorch pré-instalado

# Imagem base com Python e PyTorch já instalados
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Diretório de trabalho
WORKDIR /app

# Instala dependências do sistema necessárias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copia apenas o arquivo de requisitos primeiro (cache layer)
COPY requirements_corrigido.txt requirements.txt

# Instala apenas as dependências que não são PyTorch
# (PyTorch já vem na imagem base)
RUN pip install --no-cache-dir \
    flask \
    flask-cors \
    transformers \
    && rm -rf /tmp/*

# Copia o código da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "app_docker.py"]
```

**Atualize o docker-compose.yml para usar o novo Dockerfile:**

```yaml
services:
  api-ia:
    container_name: api-ia-flask
    build:
      context: .
      dockerfile: Dockerfile.fast  # <-- Usar o novo Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    volumes:
      - modelos-cache:/root/.cache/huggingface
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G

volumes:
  modelos-cache:
    driver: local
```

---

### **Solução 4: Build em Duas Etapas (Alternativa)**

Se preferir manter o Dockerfile original, faça o build em duas etapas:

**Etapa 1: Build da imagem**
```bash
docker-compose build --no-cache
```

**Etapa 2: Iniciar o container**
```bash
docker-compose up
```

Isso separa o processo e evita timeouts.

---

## 🚀 Passo a Passo Recomendado

### **Opção A: Usando Dockerfile.fast (MAIS RÁPIDO)**

1. **Crie o arquivo `Dockerfile.fast`** com o conteúdo acima
2. **Atualize o `docker-compose.yml`** para usar `Dockerfile.fast`
3. **Execute:**
   ```bash
   docker-compose up --build
   ```
4. **Tempo estimado:** 3-5 minutos (muito mais rápido!)

### **Opção B: Corrigindo o Dockerfile Original**

1. **Aumente recursos no Docker Desktop** (Solução 1)
2. **Remova `version:` do docker-compose.yml** (Solução 2)
3. **Execute o build separadamente:**
   ```bash
   docker-compose build --no-cache
   docker-compose up
   ```
4. **Tempo estimado:** 15-20 minutos

---

## 📊 Comparação das Soluções

| Solução | Tempo de Build | Complexidade | Recomendação |
|---------|---------------|--------------|--------------|
| **Dockerfile.fast** | 3-5 min | Baixa | ⭐⭐⭐⭐⭐ MELHOR |
| **Build em 2 etapas** | 15-20 min | Baixa | ⭐⭐⭐ |
| **Aumentar recursos** | 10-15 min | Média | ⭐⭐ |

---

## 🔍 Verificação

Após aplicar a solução, verifique se está funcionando:

```bash
# Verificar se o container está rodando
docker ps

# Verificar logs
docker-compose logs -f

# Testar a API
curl http://localhost:5000/api/status
```

---

## ⚠️ Problemas Comuns Adicionais

### Se ainda der erro de memória:
```bash
# Limpar cache do Docker
docker system prune -a --volumes

# Verificar espaço em disco
docker system df
```

### Se o proxy estiver causando problemas:
Adicione no Dockerfile (antes do RUN pip install):
```dockerfile
ENV HTTP_PROXY=http://http.docker.internal:3128
ENV HTTPS_PROXY=http://http.docker.internal:3128
```

---

## 📝 Resumo

**Problema:** Build do Docker falhou por timeout ao instalar PyTorch (14 minutos de instalação).

**Causa Raiz:** PyTorch é muito grande (~800 MB) e demora para instalar.

**Solução Recomendada:** Usar imagem base com PyTorch pré-instalado (`Dockerfile.fast`) - reduz tempo de build de 15 minutos para 3-5 minutos.

**Próximos Passos:**
1. Criar `Dockerfile.fast`
2. Atualizar `docker-compose.yml`
3. Executar `docker-compose up --build`
4. Acessar `http://localhost:5000`

---

## 💡 Dica Extra

Para builds ainda mais rápidos no futuro, considere:
- Usar Docker BuildKit: `DOCKER_BUILDKIT=1 docker-compose build`
- Fazer cache de layers: não use `--no-cache` após o primeiro build
- Usar registry privado com imagens pré-buildadas

---

Se precisar de ajuda adicional, me avise! 🚀

