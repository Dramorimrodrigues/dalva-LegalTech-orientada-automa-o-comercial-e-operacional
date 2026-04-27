# =============================================================
# DALVA — Script de Configuração do Banco de Dados
# Cria o banco 'dalva_dev' e o usuário 'dalva_user'
# =============================================================

$pgBin = "C:\Program Files\PostgreSQL\17\bin"
$env:Path = "$pgBin;" + $env:Path
$env:PGPASSWORD = "postgres"

Write-Host "Criando banco de dados 'dalva_dev'..." -ForegroundColor Cyan

# Criar o usuário da aplicação
& "$pgBin\psql" -U postgres -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dalva_user') THEN CREATE USER dalva_user WITH PASSWORD 'dalva_secure_2026'; END IF; END `$`$;" 2>$null

# Criar o banco
& "$pgBin\psql" -U postgres -c "CREATE DATABASE dalva_dev OWNER dalva_user;" 2>$null

# Garantir privilégios
& "$pgBin\psql" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE dalva_dev TO dalva_user;" 2>$null
& "$pgBin\psql" -U postgres -d dalva_dev -c "GRANT ALL ON SCHEMA public TO dalva_user;" 2>$null

Write-Host "Banco configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "DATABASE_URL: postgresql://dalva_user:dalva_secure_2026@localhost:5432/dalva_dev" -ForegroundColor Yellow
