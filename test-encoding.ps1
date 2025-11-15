# Configurar saída UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# Fazer requisição
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/cursos" -UseBasicParsing
$response.Content | Out-File -FilePath "response.json" -Encoding UTF8

# Ler e exibir
$json = Get-Content "response.json" -Encoding UTF8 -Raw
Write-Host $json

# Converter para objeto
$data = $json | ConvertFrom-Json
Write-Host "`n=== DADOS DECODIFICADOS ===" -ForegroundColor Green
$data.value | ForEach-Object {
    Write-Host "Código: $($_.codigo)" -ForegroundColor Cyan
    Write-Host "Nome: $($_.nome)" -ForegroundColor Yellow
    Write-Host "---"
}
