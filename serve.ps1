$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Serving $root at http://localhost:8080/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = $req.Url.LocalPath
  if ($path -eq "/" ) { $path = "/index.html" }
  $file = Join-Path $root $path.TrimStart("/")
  if (Test-Path $file -PathType Leaf) {
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $mime = switch ($ext) {
      ".html" {"text/html"} ".css" {"text/css"} ".js" {"application/javascript"}
      ".png" {"image/png"} ".jpg" {"image/jpeg"} ".svg" {"image/svg+xml"}
      default {"application/octet-stream"}
    }
    $bytes = [IO.File]::ReadAllBytes($file)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes,0,$bytes.Length)
  } else {
    $res.StatusCode = 404
    $b = [Text.Encoding]::UTF8.GetBytes("Not found")
    $res.OutputStream.Write($b,0,$b.Length)
  }
  $res.OutputStream.Close()
}