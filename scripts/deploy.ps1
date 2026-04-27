# =============================================================
# DALVA — Script de Deploy para Hostinger VPS
# Execute este script no PowerShell do seu computador
# =============================================================
#
# COMO USAR:
#   1. Abra o PowerShell como Administrador
#   2. Cole este comando e pressione Enter:
#      Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   3. Depois rode: .\scripts\deploy.ps1
#
# =============================================================

param(
    [string]$ServerIP = "187.127.30.81",
    [string]$ServerUser = "root",
    [string]$ServerPath = "/var/www/dalva"
)

$ProjectPath = "C:\Users\Dr.Amorim\.gemini\antigravity\scratch\dalva"
$ZipName = "dalva-deploy.zip"
$ZipPath = "$env:TEMP\$ZipName"

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     DALVA — Deploy para Hostinger VPS    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── PASSO 1: Criar ZIP do projeto (sem node_modules e .next) ──
Write-Host "[1/4] Criando pacote de deploy..." -ForegroundColor Yellow

# Remove zip antigo se existir
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

# Lista de pastas/arquivos a IGNORAR no zip
$ExcludeDirs = @("node_modules", ".next", ".git", "scripts")

# Copia arquivos para uma pasta temporária limpa
$TempDir = "$env:TEMP\dalva-clean"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir | Out-Null

Get-ChildItem -Path $ProjectPath | Where-Object {
    $_.Name -notin $ExcludeDirs
} | Copy-Item -Destination $TempDir -Recurse -Force

# Cria o ZIP
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force
Remove-Item $TempDir -Recurse -Force

$ZipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host "   ✅ Pacote criado: $ZipSize MB" -ForegroundColor Green

# ── PASSO 2: Instruções para enviar ao servidor ──
Write-Host ""
Write-Host "[2/4] Enviando para o servidor..." -ForegroundColor Yellow
Write-Host "   Será solicitada a senha do servidor" -ForegroundColor Gray

# Envia o ZIP para o servidor
$ScpResult = scp "$ZipPath" "${ServerUser}@${ServerIP}:/tmp/${ZipName}" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ ERRO ao enviar arquivo!" -ForegroundColor Red
    Write-Host "   Verifique: servidor ligado? Senha correta? IP correto?" -ForegroundColor Red
    Write-Host "   IP usado: $ServerIP" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Arquivo enviado com sucesso!" -ForegroundColor Green

# ── PASSO 3: Executar instalação no servidor ──
Write-Host ""
Write-Host "[3/4] Instalando no servidor..." -ForegroundColor Yellow
Write-Host "   Será solicitada a senha novamente" -ForegroundColor Gray

$SetupCommands = @'
set -e
echo '=== Preparando servidor ==='

# Instalar NVM e Node.js se não existir
if ! command -v node &> /dev/null; then
    echo 'Instalando Node.js...'
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
    nvm alias default 20
fi

# Instalar PM2 se não existir
if ! command -v pm2 &> /dev/null; then
    echo 'Instalando PM2...'
    npm install -g pm2
fi

# Criar pasta da aplicação
mkdir -p {{SERVER_PATH}}
echo "=== Extraindo arquivos ==="
unzip -o /tmp/{{ZIP_NAME}} -d {{SERVER_PATH}}
cd {{SERVER_PATH}}

echo "=== Instalando dependências ==="
npm install

echo "=== Gerando Prisma Client ==="
npx prisma generate

echo "=== CONFIGURAÇÃO NECESSÁRIA ==="
echo ""
echo "Agora você precisa criar o arquivo .env.production.local"
echo "Execute: nano {{SERVER_PATH}}/.env.production.local"
echo ""
echo "=== Instalação concluída! ==="
'@

$SetupCommands = $SetupCommands.Replace("{{SERVER_PATH}}", $ServerPath).Replace("{{ZIP_NAME}}", $ZipName)

# Envia os comandos via pipe para o SSH
$SetupCommands | ssh "${ServerUser}@${ServerIP}" "bash"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erro durante instalação no servidor" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Instalação concluída!" -ForegroundColor Green

# ── PASSO 4: Instruções finais ──
Write-Host ""
Write-Host "[4/4] Próximos passos manuais no servidor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Conecte ao servidor:" -ForegroundColor Cyan
Write-Host "  ssh root@$ServerIP" -ForegroundColor White
Write-Host ""
Write-Host "  Depois execute estes comandos:" -ForegroundColor Cyan
Write-Host "  nano $ServerPath/.env.production.local" -ForegroundColor White
Write-Host "  (configure as variáveis e salve com Ctrl+O, Enter, Ctrl+X)" -ForegroundColor Gray
Write-Host ""
Write-Host "  cd $ServerPath" -ForegroundColor White
Write-Host "  npx prisma migrate deploy" -ForegroundColor White
Write-Host "  npm run build" -ForegroundColor White
Write-Host "  pm2 start 'npm start' --name dalva" -ForegroundColor White
Write-Host "  pm2 save ; pm2 startup" -ForegroundColor White
Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         Deploy enviado com sucesso!      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
