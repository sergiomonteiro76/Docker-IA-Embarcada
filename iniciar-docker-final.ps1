# Script PowerShell para iniciar a API de IA com Docker
# Versão corrigida com limpeza de cache

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " API de Inteligencia Artificial com Docker" -ForegroundColor Cyan
Write-Host " Versao Corrigida - Compatibilidade NumPy" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se o Docker está rodando
Write-Host "Verificando Docker Desktop..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "[OK] Docker Desktop detectado" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERRO] Docker Desktop nao esta rodando!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abra o Docker Desktop"
    Write-Host "2. Aguarde ate o icone ficar verde na bandeja"
    Write-Host "3. Execute este script novamente"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Pergunta se quer limpar cache
Write-Host "IMPORTANTE: Para corrigir o erro de NumPy, e necessario limpar o cache." -ForegroundColor Yellow
Write-Host ""
$limpar = Read-Host "Deseja limpar imagens antigas do Docker? (S/N)"

if ($limpar -eq "S" -or $limpar -eq "s") {
    Write-Host ""
    Write-Host "Limpando imagens antigas..." -ForegroundColor Yellow
    docker-compose down 2>$null
    docker system prune -a -f
    Write-Host "Cache limpo!" -ForegroundColor Green
    Write-Host ""
}

# Para containers anteriores
Write-Host "Parando containers anteriores..." -ForegroundColor Yellow
docker-compose -f docker-compose-final.yml down 2>$null
Write-Host ""

# Inicia o build
Write-Host "Construindo e iniciando a API..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Isso pode levar 3-5 minutos na primeira execucao" -ForegroundColor Cyan
Write-Host "Aguarde ate ver a mensagem 'Running on http://0.0.0.0:5000'" -ForegroundColor Cyan
Write-Host ""

# Executa o docker-compose com o arquivo corrigido
docker-compose -f docker-compose-final.yml up --build

# Verifica se houve erro
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "[ERRO] Falha ao iniciar o container" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Consulte o arquivo SOLUCAO_ERRO_NUMPY.md" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Parando containers..." -ForegroundColor Yellow
    docker-compose -f docker-compose-final.yml down
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "[SUCESSO] API iniciada com sucesso!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para sair"

