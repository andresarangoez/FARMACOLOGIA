# Consulta las presentaciones comerciales en Colombia de cada fármaco del listado
# y escribe data/presentaciones.js (window.FARMA_PRES).
#
# Fuente: INVIMA · datos abiertos (datos.gov.co, conjunto i7cb-raxc "Medicamentos con registro sanitario").
# Sólo cuenta registros VIGENTES con presentación (CUM) ACTIVA. No es el vademécum completo: si una presentación
# no aparece aquí, no se muestra (no se inventa). Para volver a consultar:  powershell -File tools\presentaciones-invima.ps1
#
# Cada fármaco del listado se busca por uno o más términos del principio activo (sin tildes, en mayúsculas).
# Excluir = términos que no deben contar (p. ej. CLOROQUINA no debe contar HIDROXICLOROQUINA).
param([string]$Salida = (Join-Path (Split-Path -Parent $PSScriptRoot) 'data\presentaciones.js'))

$base = 'https://www.datos.gov.co/resource/i7cb-raxc.json'

# clave (= nombre sin tildes ni signos, en minúscula) -> @{ Nombre; Buscar; Excluir }
$f = [ordered]@{}
function Add-F($clave, $nombre, $buscar, $excluir = @(), $producto = @()) { $script:f[$clave] = @{ Nombre = $nombre; Buscar = $buscar; Excluir = $excluir; Producto = $producto } }

Add-F 'ambroxol' 'Ambroxol' @('AMBROXOL')
Add-F 'azatioprina' 'Azatioprina' @('AZATIOPRINA')
Add-F 'bosentan' 'Bosentan' @('BOSENTAN')
Add-F 'bromhexina' 'Bromhexina' @('BROMHEXINA')
Add-F 'calcio' 'Calcio' @('GLUCONATO DE CALCIO','CLORURO DE CALCIO')
Add-F 'cetirizina' 'Cetirizina' @('CETIRIZINA')
Add-F 'ciclofosfamida' 'Ciclofosfamida' @('CICLOFOSFAMIDA')
Add-F 'ciclosporina' 'Ciclosporina' @('CICLOSPORINA')
Add-F 'ciprofloxacino' 'Ciprofloxacino' @('CIPROFLOXACINO')
Add-F 'clofazimina' 'Clofazimina' @('CLOFAZIMINA')
Add-F 'cloranfenicol' 'Cloranfenicol' @('CLORANFENICOL')
Add-F 'clorfeniramina' 'Clorfeniramina' @('CLORFENIRAMINA')
Add-F 'cloroquina' 'Cloroquina' @('CLOROQUINA') @('HIDROXI')
Add-F 'codeina' 'Codeína' @('CODEINA') @('DIHIDRO')
Add-F 'colistina' 'Colistina' @('COLISTINA','COLISTIMETATO')
Add-F 'curosurf' 'Curosurf (poractant alfa)' @() @() @('CUROSURF')
Add-F 'dalfopristina' 'Dalfopristina' @('DALFOPRISTINA')
Add-F 'dapsona' 'Dapsona' @('DAPSONA')
Add-F 'daptomicina' 'Daptomicina' @('DAPTOMICINA')
Add-F 'desloratadina' 'Desloratadina' @('DESLORATADINA')
Add-F 'dextrometorfano' 'Dextrometorfano' @('DEXTROMETORFANO')
Add-F 'difenhidramina' 'Difenhidramina' @('DIFENHIDRAMINA')
Add-F 'dihidrocodeina' 'Dihidrocodeína' @('DIHIDROCODEINA')
Add-F 'dornasaalfa' 'Dornasa alfa' @('DORNASA')
Add-F 'doxiciclina' 'Doxiciclina' @('DOXICICLINA')
Add-F 'eltrombopag' 'Eltrombopag' @('ELTROMBOPAG')
Add-F 'eritropoyetina' 'Eritropoyetina' @('ERITROPOYETINA','EPOETINA')
Add-F 'epo' 'EPO' @('ERITROPOYETINA','EPOETINA')
Add-F 'etambutol' 'Etambutol' @('ETAMBUTOL')
Add-F 'fexofenadina' 'Fexofenadina' @('FEXOFENADINA')
Add-F 'filgrastim' 'Filgrastim' @('FILGRASTIM') @('PEG')
Add-F 'pegfilgrastim' 'Pegfilgrastim' @('PEGFILGRASTIM')
Add-F 'guaifenesina' 'Guaifenesina' @('GUAIFENESINA','GUAYACOLATO')
Add-F 'hidroxicina' 'Hidroxicina' @('HIDROXICINA')
Add-F 'hidroxicloroquina' 'Hidroxicloroquina' @('HIDROXICLOROQUINA')
Add-F 'isoniazida' 'Isoniazida' @('ISONIAZIDA')
Add-F 'levofloxacino' 'Levofloxacino' @('LEVOFLOXACINO')
Add-F 'linezolid' 'Linezolid' @('LINEZOLID')
Add-F 'loratadina' 'Loratadina' @('LORATADINA') @('DESLORATADINA')
Add-F 'magnesio' 'Magnesio' @('SULFATO DE MAGNESIO')
Add-F 'mesalazina' 'Mesalazina' @('MESALAZINA','MESALAMINA')
Add-F 'metotrexato' 'Metotrexato' @('METOTREXATO')
Add-F 'montelukast' 'Montelukast' @('MONTELUKAST')
Add-F 'moxifloxacino' 'Moxifloxacino' @('MOXIFLOXACINO')
Add-F 'nacetilcisteina' 'N-acetilcisteína' @('ACETILCISTEINA')
Add-F 'omalizumab' 'Omalizumab' @('OMALIZUMAB')
Add-F 'palivizumab' 'Palivizumab' @('PALIVIZUMAB')
Add-F 'pirazinamida' 'Pirazinamida' @('PIRAZINAMIDA')
Add-F 'polimixinab' 'Polimixina B' @('POLIMIXINA')
Add-F 'potasio' 'Potasio' @('CLORURO DE POTASIO')
Add-F 'quinupristina' 'Quinupristina' @('QUINUPRISTINA')
Add-F 'raxibacumab' 'Raxibacumab' @('RAXIBACUMAB')
Add-F 'rifampicina' 'Rifampicina' @('RIFAMPICINA')
Add-F 'roflumilast' 'Roflumilast' @('ROFLUMILAST')
Add-F 'sildenafil' 'Sildenafil' @('SILDENAFIL')
Add-F 'sulfacetamida' 'Sulfacetamida' @('SULFACETAMIDA')
Add-F 'sulfadiazina' 'Sulfadiazina' @('SULFADIAZINA')
Add-F 'sulfadoxina' 'Sulfadoxina' @('SULFADOXINA')
Add-F 'sulfasalazina' 'Sulfasalazina' @('SULFASALAZINA')
Add-F 'survanta' 'Survanta (beractant)' @() @() @('SURVANTA')
Add-F 'tadalafil' 'Tadalafil' @('TADALAFIL')
Add-F 'talidomida' 'Talidomida' @('TALIDOMIDA')
Add-F 'teicoplanina' 'Teicoplanina' @('TEICOPLANINA')
Add-F 'teofilina' 'Teofilina' @('TEOFILINA')
Add-F 'tigeciclina' 'Tigeciclina' @('TIGECICLINA')
Add-F 'tmpsmx' 'TMP-SMX (trimetoprim/sulfametoxazol)' @('SULFAMETOXAZOL')
Add-F 'vancomicina' 'Vancomicina' @('VANCOMICINA')
Add-F 'zafirlukast' 'Zafirlukast' @('ZAFIRLUKAST')
Add-F 'antitrombinaiii' 'Antitrombina III' @('ANTITROMBINA')

function Categoria($forma, $via) {
    $t = ($forma + ' ' + $via).ToUpper()
    if ($t -match 'INYECTABLE|INFUSION|PARENTERAL|LIOFILIZ|RECONSTITUIR|INTRAVEN|INTRAMUSC|SUBCUTAN|INTRATRAQUEAL') { return 'ampolla' }
    if ($t -match 'JARABE|SUSPENSION ORAL|SOLUCION ORAL|ELIXIR|GOTAS|EMULSION ORAL|SUSPENSION|POLVO PARA SUSPENSION|GRANULOS') { if ($via -match 'ORAL') { return 'jarabe' } }
    if ($t -match 'TABLETA|CAPSULA|GRAGEA|COMPRIMIDO|CAPLET') { return 'pastilla' }
    return 'otra'
}
function Bonito($s) { if (-not $s) { return '' }; $x = $s.ToLower(); return $x.Substring(0,1).ToUpper() + $x.Substring(1) }

$items = [ordered]@{}
foreach ($k in $f.Keys) {
    $d = $f[$k]
    $conds = @()
    foreach ($t in $d.Buscar)   { $conds += "upper(principioactivo) like '%$t%'" }
    foreach ($t in $d.Producto) { $conds += "upper(producto) like '%$t%'" }
    $where = "(" + ($conds -join ' OR ') + ") AND estadoregistro='Vigente' AND estadocum='Activo'"
    foreach ($x in $d.Excluir) { $where += " AND upper(principioactivo) not like '%$x%'" }
    $url = $base + '?$select=expediente,producto,formafarmaceutica,viaadministracion&$limit=5000&$where=' + [Uri]::EscapeDataString($where)
    try { $filas = Invoke-RestMethod -Uri $url -TimeoutSec 60 } catch { Write-Warning "$k : $($_.Exception.Message)"; continue }

    # ¿Cada registro es de un solo principio activo o es una combinación? (una fila por principio activo y presentación)
    $combo = @{}
    $exps = @($filas | ForEach-Object { $_.expediente } | Sort-Object -Unique)
    for ($i = 0; $i -lt $exps.Count; $i += 150) {
        $lote = $exps[$i..([Math]::Min($i + 149, $exps.Count - 1))]
        $lista = ($lote | ForEach-Object { "'$_'" }) -join ','
        $u2 = $base + '?$select=expediente,principioactivo&$group=expediente,principioactivo&$limit=50000&$where=' + [Uri]::EscapeDataString("expediente in ($lista)")
        try {
            $r2 = Invoke-RestMethod -Uri $u2 -TimeoutSec 60
            $r2 | Group-Object expediente | ForEach-Object { if ($_.Count -gt 1) { $combo[$_.Name] = 1 } }
        } catch { Write-Warning "$k combos: $($_.Exception.Message)" }
    }

    $porForma = @{}
    foreach ($r in $filas) {
        $forma = (Bonito $r.formafarmaceutica); $via = (Bonito $r.viaadministracion)
        $clave = "$forma|$via"
        if (-not $porForma.ContainsKey($clave)) { $porForma[$clave] = @{ forma = $forma; via = $via; cat = (Categoria $r.formafarmaceutica $r.viaadministracion); solo = @{}; comb = @{}; prod = @{} } }
        if ($combo.ContainsKey($r.expediente)) { $porForma[$clave].comb[$r.expediente] = 1 }
        else {
            $porForma[$clave].solo[$r.expediente] = 1
            if ($r.producto -and $porForma[$clave].prod.Count -lt 3) { $p = ($r.producto -replace '\s+', ' ').Trim(); if ($p.Length -gt 60) { $p = $p.Substring(0, 60) }; $porForma[$clave].prod[$p] = 1 }
        }
    }
    $formas = @($porForma.Values | Sort-Object { -($_.solo.Count * 1000 + $_.comb.Count) } | ForEach-Object {
        [ordered]@{ cat = $_.cat; forma = $_.forma; via = $_.via; n = $_.solo.Count; comb = $_.comb.Count; ej = @($_.prod.Keys) }
    })
    $items[$k] = [ordered]@{ nombre = $d.Nombre; registros = $exps.Count; solos = ($exps.Count - $combo.Count); formas = $formas }
    Write-Host ("{0,-18} {1,4} registros ({2} solos)  {3}" -f $k, $exps.Count, ($exps.Count - $combo.Count), ((($formas | Where-Object { $_.n -gt 0 } | ForEach-Object { $_.cat }) | Sort-Object -Unique) -join ','))
}

# ── Complementos: fármacos que NO salen en los datos abiertos de INVIMA pero sí en el Vademécum Colombia o en las
# normas farmacológicas de INVIMA (consultados a mano). Cada forma lleva su fuente. Sólo presentaciones colombianas.
function Complemento($k, $nombre, $formas, $nota) {
    $script:items[$k] = [ordered]@{ nombre = $nombre; registros = $formas.Count; solos = $formas.Count; formas = $formas; nota = $nota }
}
$vc = 'Vademécum Colombia (vademecum.es/colombia)'
Complemento 'etambutol' 'Etambutol' @(
    [ordered]@{ cat = 'pastilla'; forma = 'Tableta recubierta'; via = 'Oral'; n = 1; comb = 0; ej = @('ECOX 400 mg (Vesalius Pharma)'); fuente = $vc; url = 'https://www.vademecum.es/colombia/medicamento/1560022/ecox-400-mg-tab-recubierta' }
) 'No aparece en los datos abiertos de INVIMA; sí en el Vademécum Colombia.'
Complemento 'teicoplanina' 'Teicoplanina' @(
    [ordered]@{ cat = 'ampolla'; forma = 'Liofilizado para solución inyectable'; via = 'Inyectable'; n = 1; comb = 0; ej = @('Teicoston 200 mg (Blau Farmacéutica)'); fuente = $vc; url = 'https://www.vademecum.es/colombia/equivalencias/1558401/teicoston-200-mg-liof-para-sol-iny-' },
    [ordered]@{ cat = 'ampolla'; forma = 'Polvo y disolvente para solución inyectable'; via = 'Inyectable'; n = 1; comb = 0; ej = @('Teicoston 400 mg (Blau Farmacéutica)'); fuente = $vc; url = 'https://www.vademecum.es/colombia/equivalencias/1559258/teicoston-400-mg-polvo-y-disolv-para-sol-iny-' }
) 'No aparece en los datos abiertos de INVIMA; sí en el Vademécum Colombia.'
$norma = 'Normas farmacológicas de INVIMA (agosto 2022)'
$urlNorma = 'https://www.invima.gov.co/sites/default/files/medicamentos-productos-biologicos/Normas%20farmacologicas%20AGOSTO%202022%20(2).pdf'
foreach ($par in @(@('quinupristina','Quinupristina'), @('dalfopristina','Dalfopristina'))) {
    Complemento $par[0] $par[1] @(
        [ordered]@{ cat = 'ampolla'; forma = 'Polvo liofilizado para solución inyectable (vial 350 mg + 150 mg)'; via = 'Inyectable'; n = 1; comb = 0; ej = @('Quinupristina + dalfopristina (Synercid)'); fuente = $norma; url = $urlNorma }
    ) 'Figura en las normas farmacológicas de INVIMA; no se confirmó una presentación comercial activa.'
}

# Sin presentación colombiana encontrada (se muestra tal cual, sin inventar)
foreach ($s in @(@('zafirlukast','Zafirlukast'), @('raxibacumab','Raxibacumab'), @('antitrombinaiii','Antitrombina III'))) {
    $items[$s[0]] = [ordered]@{ nombre = $s[1]; registros = 0; solos = 0; formas = @(); nota = 'No se encontró presentación colombiana en los datos abiertos de INVIMA ni en el Vademécum Colombia.' }
}
$items['talidomida'] = [ordered]@{ nombre = 'Talidomida'; registros = 0; solos = 0; formas = @(); nota = 'Tiene registro sanitario vigente en INVIMA (108 presentaciones), pero ninguna con estado activo en los datos abiertos.' }

$obj = [ordered]@{
    fuente = 'INVIMA · datos abiertos (datos.gov.co, conjunto i7cb-raxc): registros sanitarios vigentes con presentación comercial activa'
    fecha  = (Get-Date -Format 'yyyy-MM-dd')
    items  = $items
}
$json = $obj | ConvertTo-Json -Depth 8 -Compress
[IO.File]::WriteAllText($Salida, "/* Generado por tools/presentaciones-invima.ps1 — no editar a mano */`r`nwindow.FARMA_PRES = $json;`r`n", (New-Object Text.UTF8Encoding($false)))
Write-Host "Listo: $($items.Count) fármacos -> $Salida"
