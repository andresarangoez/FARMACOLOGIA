# Empaqueta el contenido en data/contenido.js para que la página funcione sin
# servidor (doble clic en index.html):
#   content/sesion-*/*.md  -> window.FARMA_RAW    (temas de las sesiones)
#   content/examen/*.md    -> window.FARMA_EXAMEN (talleres y simulacros, páginas propias en "Datos de examen")
# Ejecutar cada vez que se agregue o edite un .md:   construir.bat
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

$extras = @()
$dirExamen = Join-Path $cont 'examen'
if (Test-Path $dirExamen) {
    Get-ChildItem $dirExamen -Filter '*.md' | Sort-Object Name | ForEach-Object {
        $extras += [pscustomobject]@{
            ruta = ('examen/' + $_.Name)
            md   = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8)
        }
    }
}

$json1 = ConvertTo-Json -InputObject @($items) -Depth 3 -Compress
$json2 = ConvertTo-Json -InputObject @($extras) -Depth 3 -Compress
$salida = "/* GENERADO por tools/construir.ps1 - no editar a mano; edita los .md de /content */`r`nwindow.FARMA_RAW = $json1;`r`nwindow.FARMA_EXAMEN = $json2;`r`n"
[IO.File]::WriteAllText((Join-Path $raiz 'data\contenido.js'), $salida, $utf8)
Write-Host ("Listo: {0} temas de sesiones y {1} recursos de examen empaquetados en data\contenido.js" -f $items.Count, $extras.Count)
