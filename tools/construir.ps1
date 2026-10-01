# Empaqueta content/sesion-*/*.md en data/contenido.js para que la página
# funcione sin servidor (doble clic en index.html). Ejecutar cada vez que se
# agregue o edite un .md:   powershell -ExecutionPolicy Bypass -File tools\construir.ps1
$raiz = Split-Path -Parent $PSScriptRoot
$cont = Join-Path $raiz 'content'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$items = @()
Get-ChildItem $cont -Directory -Filter 'sesion-*' | Sort-Object Name | ForEach-Object {
    $dir = $_
    Get-ChildItem $dir.FullName -Filter '*.md' | Sort-Object Name | ForEach-Object {
        $items += [pscustomobject]@{
            ruta = ($dir.Name + '/' + $_.Name)
            md   = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8)
        }
    }
}
$json = ConvertTo-Json -InputObject @($items) -Depth 3 -Compress
$salida = "/* GENERADO por tools/construir.ps1 - no editar a mano; edita los .md de /content */`r`nwindow.FARMA_RAW = $json;`r`n"
[IO.File]::WriteAllText((Join-Path $raiz 'data\contenido.js'), $salida, $utf8)
Write-Host ("Listo: {0} archivos empaquetados en data\contenido.js" -f $items.Count)
