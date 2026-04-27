param(
    [string]$ServerIP = "187.127.30.81",
    [string]$ServerUser = "root",
    [string]$Domain = "dalvanodecore.com"
)

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "  RESTAURANDO HTTPS (SSL) NO SERVIDOR               " -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host ""

$SslCommands = @"
set -e
echo "=== Instalando/Verificando Certbot ==="
apt-get update
apt-get install -y certbot python3-certbot-nginx

echo "=== Configurando Certificado SSL para $Domain ==="
# O --nginx automaticamente edita o arquivo /etc/nginx/sites-available/dalva
# e o --redirect forca HTTP a redirecionar para HTTPS
certbot --nginx -d $Domain -d www.$Domain --non-interactive --agree-tos -m contato@$Domain --redirect --expand

echo "=== Reiniciando Nginx ==="
systemctl restart nginx

echo ""
echo "=== TUDO PRONTO! Tente acessar: https://$Domain ==="
"@

$SslCommands | ssh "${ServerUser}@${ServerIP}" "bash"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERRO: Falha ao configurar o SSL. Verifique a senha." -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "HTTPS configurado com sucesso!" -ForegroundColor Green
}