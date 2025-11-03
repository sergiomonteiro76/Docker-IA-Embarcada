# 🚀 Início Rápido - API de IA com Docker

## ⚡ Método Mais Rápido (1 Comando)

Abra o **PowerShell** na pasta do projeto e execute:

```powershell
docker-compose -f docker-compose-final.yml up --build
```

**Pronto!** Aguarde 3-5 minutos e acesse: **http://localhost:5000**

---

## 📋 Pré-requisitos

- ✅ Docker Desktop instalado e **rodando** (ícone verde na bandeja)
- ✅ Estar na pasta do projeto no terminal

---

## 🎯 Passo a Passo Detalhado

### **1. Abrir PowerShell na Pasta do Projeto**

**Opção A:** Pelo Explorador de Arquivos
1. Navegue até a pasta do projeto
2. Clique com botão direito em um espaço vazio
3. Selecione "Abrir no Terminal" ou "Abrir janela do PowerShell aqui"

**Opção B:** Manualmente
1. Abra o PowerShell
2. Use `cd` para navegar até a pasta:
   ```powershell
   cd "C:\IBMEC\02 - Conteinerizando com Docker"
   ```

### **2. Verificar se o Docker Está Rodando**

```powershell
docker info
```

Se aparecer informações do Docker, está tudo OK! ✅

Se aparecer erro, abra o Docker Desktop e aguarde.

### **3. Iniciar a Aplicação**

```powershell
docker-compose -f docker-compose-final.yml up --build
```

**O que vai acontecer:**
- Download da imagem base Python (primeira vez)
- Instalação das dependências (Flask, PyTorch, Transformers)
- Build da imagem Docker
- Inicialização do container
- Download dos modelos de IA (primeira vez)

**Tempo estimado:** 3-5 minutos na primeira execução

### **4. Acessar a Aplicação**

Quando aparecer mensagens como:
```
✔ Container api-ia-flask  Started
 * Running on http://0.0.0.0:5000
```

Abra o navegador e acesse: **http://localhost:5000**

---

## 🛑 Para Parar

Pressione **Ctrl+C** no terminal onde o Docker está rodando.

Ou abra outro PowerShell e execute:
```powershell
docker-compose -f docker-compose-final.yml down
```

---

## 🔄 Executar Novamente

Nas próximas vezes, o processo é muito mais rápido (30 segundos):

```powershell
docker-compose -f docker-compose-final.yml up
```

**Nota:** Remova o `--build` se não fez mudanças no código.

---

## 📊 Comandos Úteis

| Ação | Comando |
|------|---------|
| **Iniciar** | `docker-compose -f docker-compose-final.yml up` |
| **Iniciar em background** | `docker-compose -f docker-compose-final.yml up -d` |
| **Parar** | `docker-compose -f docker-compose-final.yml down` |
| **Ver logs** | `docker-compose -f docker-compose-final.yml logs -f` |
| **Ver containers** | `docker ps` |
| **Rebuild** | `docker-compose -f docker-compose-final.yml up --build` |

---

## 🐛 Problemas Comuns

### **Erro: "Cannot connect to Docker daemon"**
**Solução:** Abra o Docker Desktop e aguarde o ícone ficar verde.

### **Erro: "port is already allocated"**
**Solução:** Outra aplicação está usando a porta 5000. Pare-a ou mude a porta no `docker-compose-final.yml`:
```yaml
ports:
  - "8080:5000"  # Mude para 8080
```

### **Erro: "no space left on device"**
**Solução:** Limpe o cache do Docker:
```powershell
docker system prune -a
```

### **Build muito lento**
**Solução:** Aumente a memória do Docker Desktop:
1. Docker Desktop → Settings → Resources
2. Memory: 6-8 GB
3. Apply & Restart

---

## 🎓 Alternativas

### **Usar Script PowerShell**

Se preferir um script com mensagens coloridas:

```powershell
# Permitir execução de scripts (apenas uma vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Executar o script
.\iniciar-docker.ps1
```

### **Usar Docker Desktop Interface**

1. Abra Docker Desktop
2. Vá em "Images" → "Build"
3. Selecione o `Dockerfile.fast`
4. Clique em "Build"
5. Depois vá em "Containers" e inicie o container

---

## ✅ Checklist de Sucesso

- [ ] Docker Desktop rodando (ícone verde)
- [ ] PowerShell aberto na pasta do projeto
- [ ] Comando executado sem erros
- [ ] Mensagem "Container api-ia-flask Started" apareceu
- [ ] http://localhost:5000 acessível no navegador

---

## 📞 Precisa de Ajuda?

Consulte os arquivos:
- **EXECUTAR_MANUALMENTE.md** - Guia completo de execução
- **SOLUCAO_ERRO_DOCKER.md** - Troubleshooting detalhado
- **SOBRE_ALERTA_VIRUS.md** - Explicação sobre falsos positivos

---

## 🎉 Pronto!

Agora você tem uma API de IA rodando em Docker! 🚀

**Teste os endpoints:**
- Interface: http://localhost:5000
- Status: http://localhost:5000/api/status
- Modelo: http://localhost:5000/api/modelo

