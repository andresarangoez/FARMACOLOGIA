# Servidor estático mínimo para ver la página en http://localhost:8080
# (opcional: index.html también funciona abriéndolo con doble clic).
param([int]$Puerto = 8080)
$raiz = Split-Path -Parent $PSScriptRoot
$tipos = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
            '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.md'='text/plain; charset=utf-8'; '.json'='application/json' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Puerto/")
$l.Start()
Write-Host "Sirviendo $raiz en http://localhost:$Puerto/"
while ($l.IsListening) {
    $c = $l.GetContext()
    $ruta = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
    if ($ruta -eq '') { $ruta = 'index.html' }
    $f = Join-Path $raiz $ruta
    if ((Test-Path $f -PathType Leaf) -and ((Resolve-Path $f).Path.StartsWith($raiz))) {
        $b = [IO.File]::ReadAllBytes($f)
        $t = $tipos[[IO.Path]::GetExtension($f).ToLower()]
        if (-not $t) { $t = 'application/octet-stream' }
        $c.Response.ContentType = $t
        $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $c.Response.StatusCode = 404 }
    $c.Response.Close()
}
