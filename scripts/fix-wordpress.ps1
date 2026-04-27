param(
    [string]$ServerIP = "187.127.30.81",
    [string]$ServerUser = "root",
    [string]$Domain = "dalvanodecore.com"
)

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "  LIMPANDO WORDPRESS E ATIVANDO DALVA NO SERVIDOR   " -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host ""

$FixCommands = @"
set -e
echo '=== 1. Removendo configuracoes do WordPress ==='
# Desativa sites padrao que podem estar conflitando
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/wordpress
rm -f /etc/nginx/sites-enabled/000-default || true

echo '=== 2. Criando configuracao para dalvanodecore.com ==='
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
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }
}
EOF

echo '=== 3. Ativando o novo site e reiniciando Nginx ==='
ln -sf /etc/nginx/sites-available/dalva /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx || echo 'Nginx restart falhou, tentando instalar nginx...'

# Se o nginx nao estiver instalado (caso de template Apache/LiteSpeed)
if ! command -v nginx &> /dev/null; then
    apt-get update && apt-get install -y nginx
    systemctl restart nginx
fi

echo '=== 4. Iniciando a Dalva via PM2 ==='
cd /var/www/dalva

# Garante que as dependencias estao la
npm install --production

# Faz o build de producao (isso pode demorar uns 2 minutos)
echo 'Gerando build de producao... (aguarde)'
npm run build

# Inicia o processo
pm2 delete dalva || true
pm2 start npm --name "dalva" -- start
pm2 save

echo ""
echo "=== TUDO PRONTO! Tente acessar: http://$Domain ==="
"@

# Envia via SSH
$FixCommands | ssh "${ServerUser}@${ServerIP}" "bash"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERRO: Nao foi possivel completar a limpeza. Verifique a senha." -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "Limpeza concluida com sucesso!" -ForegroundColor Green
}
