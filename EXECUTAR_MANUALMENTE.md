# Como Executar Manualmente (Sem Script BAT)

Se os scripts `.bat` estiverem dando erro, você pode executar os comandos manualmente no PowerShell ou CMD.

## 📋 Pré-requisitos

1. Docker Desktop **rodando** (ícone verde na bandeja)
2. Estar na pasta do projeto no terminal

---

## 🚀 Método 1: PowerShell (RECOMENDADO)

Abra o **PowerShell** na pasta do projeto e execute:

```powershell
# Verificar se o Docker está rodando
docker info

# Se o comando acima funcionar, continue:

# Parar containers anteriores (se existirem)
docker-compose -f docker-compose-corrigido.yml down

# Construir e iniciar
docker-compose -f docker-compose-corrigido.yml up --build
```

---

## 🚀 Método 2: CMD (Prompt de Comando)

Abra o **CMD** na pasta do projeto e execute:

```cmd
docker info

docker-compose -f docker-compose-corrigido.yml down

docker-compose -f docker-compose-corrigido.yml up --build
```

---

## 🚀 Método 3: Usando o docker-compose.yml Original

Se você não quiser usar o arquivo corrigido, pode corrigir o original:

1. **Abra o arquivo `docker-compose.yml`**
2. **Remova a primeira linha** que contém `version: '3.8'`
3. **Salve o arquivo**
4. **Execute:**

```powershell
docker-compose up --build
```

---

## 🚀 Método 4: Interface do Docker Desktop

1. **Abra o Docker Desktop**
2. **Vá na aba "Images"**
3. **Clique em "Build"**
4. **Selecione o `Dockerfile.fast`**
5. **Dê um nome para a imagem:** `api-ia-flask`
6. **Clique em "Build"**
7. **Depois vá em "Containers"**
8. **Clique em "Run"** e configure:
   - **Port:** 5000:5000
   - **Volume:** Adicione um volume para `/root/.cache/huggingface`

---

## ⚡ Atalho Rápido (Uma Linha)

Se você só quer iniciar rapidamente:

```powershell
docker-compose -f docker-compose-corrigido.yml up --build -d
```

O `-d` faz rodar em background (detached mode).

---

## 🛑 Para Parar

```powershell
# Parar e remover containers
docker-compose -f docker-compose-corrigido.yml down

# OU apenas parar (sem remover)
docker-compose -f docker-compose-corrigido.yml stop
```

---

## 🔍 Verificar se Está Rodando

```powershell
# Ver containers rodando
docker ps

# Ver logs em tempo real
docker-compose -f docker-compose-corrigido.yml logs -f

# Testar a API
curl http://localhost:5000/api/status
```

---

## ❓ Troubleshooting

### Erro: "docker-compose: command not found"

Use `docker compose` (com espaço) ao invés de `docker-compose`:

```powershell
docker compose -f docker-compose-corrigido.yml up --build
```

### Erro: "Cannot connect to Docker daemon"

O Docker Desktop não está rodando. Abra-o e aguarde o ícone ficar verde.

### Erro: "port is already allocated"

A porta 5000 está em uso. Pare o outro processo ou mude a porta no `docker-compose-corrigido.yml`:

```yaml
ports:
  - "8080:5000"  # Mude de 5000 para 8080
```

### Erro: "no space left on device"

Limpe o cache do Docker:

```powershell
docker system prune -a --volumes
```

---

## 📝 Resumo dos Comandos Essenciais

| Ação | Comando |
|------|---------|
| **Iniciar** | `docker-compose -f docker-compose-corrigido.yml up --build` |
| **Parar** | `docker-compose -f docker-compose-corrigido.yml down` |
| **Ver logs** | `docker-compose -f docker-compose-corrigido.yml logs -f` |
| **Ver containers** | `docker ps` |
| **Limpar cache** | `docker system prune -a` |

---

## 🎯 Recomendação Final

Use o **PowerShell** e execute os comandos manualmente. É mais confiável do que scripts `.bat` que podem ter problemas de codificação.

**Comando completo em uma linha:**

```powershell
docker-compose -f docker-compose-corrigido.yml down; docker-compose -f docker-compose-corrigido.yml up --build
```

Isso para qualquer container anterior e inicia um novo build.

---

## ✅ Acesso

Após iniciar, acesse:
- **Interface Web:** http://localhost:5000
- **API Status:** http://localhost:5000/api/status
- **API Modelo:** http://localhost:5000/api/modelo

---

Se ainda tiver problemas, me avise qual erro específico está aparecendo! 🚀

