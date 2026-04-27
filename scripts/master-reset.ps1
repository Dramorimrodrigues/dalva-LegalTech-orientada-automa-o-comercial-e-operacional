param(
    [string]$ServerIP = "187.127.30.81",
    [string]$ServerUser = "root",
    [string]$Domain = "dalvanodecore.com"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   DALVA — MASTER RESET E DEPLOY COMPLETO NO SERVIDOR   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Este script vai apagar o servidor antigo e configurar TUDO do zero." -ForegroundColor Yellow
Write-Host "Será solicitada a sua senha do servidor algumas vezes." -ForegroundColor Yellow

$ProjectPath = "C:\Users\Dr.Amorim\.gemini\antigravity\scratch\dalva"
$ZipName = "dalva-deploy.zip"
$ZipPath = "$env:TEMP\$ZipName"

# 1. Zipar o projeto
Write-Host "`n[1/3] Preparando arquivos locais..." -ForegroundColor Cyan
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
$ExcludeDirs = @("node_modules", ".next", ".git", "scripts")
$TempDir = "$env:TEMP\dalva-clean"
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir | Out-Null
Get-ChildItem -Path $ProjectPath | Where-Object { $_.Name -notin $ExcludeDirs } | Copy-Item -Destination $TempDir -Recurse -Force
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force
Remove-Item $TempDir -Recurse -Force
Write-Host "✅ Arquivos preparados!" -ForegroundColor Green

# 2. Enviar Zip
Write-Host "`n[2/3] Enviando arquivos para o servidor (PODE PEDIR SENHA)..." -ForegroundColor Cyan
scp "$ZipPath" "${ServerUser}@${ServerIP}:/tmp/${ZipName}"
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Erro ao enviar. Verifique a senha." -ForegroundColor Red; exit 1 }
Write-Host "✅ Arquivos enviados!" -ForegroundColor Green

# 3. Executar Reset Master no Servidor
Write-Host "`n[3/3] Instalando banco, Nginx, Node e SSL no servidor (PODE PEDIR SENHA)..." -ForegroundColor Cyan

$SetupCommands = @"
set -e
echo "=== 1. Limpeza Profunda ==="
systemctl stop apache2 || true
systemctl stop lsws || true
systemctl disable apache2 || true
systemctl disable lsws || true
apt-get remove -y apache2 openlitespeed || true
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/000-default

echo "=== 2. Instalando Dependencias Essenciais ==="
apt-get update
apt-get install -y curl unzip nginx certbot python3-certbot-nginx postgresql postgresql-contrib ufw

echo "=== 3. Configurando Firewall (UFW) ==="
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https

echo "=== 4. Configurando Banco de Dados PostgreSQL no Servidor ==="
sudo -u postgres psql -c "DO \\$\\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dalva_user') THEN CREATE USER dalva_user WITH PASSWORD 'dalva_secure_2026'; END IF; END \\$\\$;" || true
sudo -u postgres psql -c "CREATE DATABASE dalva_dev OWNER dalva_user;" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dalva_dev TO dalva_user;" || true

echo "=== 5. Instalando Node.js e PM2 ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo "=== 6. Preparando Aplicacao Dalva ==="
mkdir -p /var/www/dalva
unzip -o /tmp/dalva-deploy.zip -d /var/www/dalva
cd /var/www/dalva

# Criar arquivo .env
cat <<EOF > .env.production.local
DATABASE_URL="postgresql://dalva_user:dalva_secure_2026@localhost:5432/dalva_dev"
NEXTAUTH_SECRET="dalva_super_secret_key_2026"
NEXTAUTH_URL="https://$Domain"
EOF
cp .env.production.local .env

npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed || true
npm run build

pm2 delete dalva || true
pm2 start npm --name "dalva" -- start
pm2 save
pm2 startup | tail -n 1 | bash || true

echo "=== 7. Configurando Nginx ==="
cat <<EOF > /etc/nginx/sites-available/dalva
server {
    listen 80;
    server_name $Domain www.$Domain;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF
ln -sf /etc/nginx/sites-available/dalva /etc/nginx/sites-enabled/
systemctl restart nginx

echo "=== 8. Configurando SSL Certbot ==="
certbot --nginx -d $Domain -d www.$Domain --non-interactive --agree-tos -m contato@$Domain --redirect --expand || echo "Aviso: Falha ao gerar SSL, mas HTTP estara disponivel."

echo "=== TUDO PRONTO! ==="
"@

$SetupCommands | ssh "${ServerUser}@${ServerIP}" "bash"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Erro durante a configuração no servidor." -ForegroundColor Red
} else {
    Write-Host "`n✅ DEPLOY E CONFIGURAÇÃO CONCLUÍDOS COM SUCESSO!" -ForegroundColor Green
    Write-Host "Abra no seu navegador: https://$Domain" -ForegroundColor Cyan
}
