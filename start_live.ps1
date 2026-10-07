# Intense World Gym - Automated Live Cloudflare Deployer & Server

$port = 8080
$prefix = "http://localhost:$port/"

# 1. Start Background HTTP Server Job
$serverJob = Start-Job -ScriptBlock {
    param($rootPath, $port)
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }
        $filePath = Join-Path $rootPath $relPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".mp4"  { $response.ContentType = "video/mp4" }
                default { $response.ContentType = "application/octet-stream" }
            }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} -ArgumentList $PSScriptRoot, $port

Write-Host "Local web server started on port $port"
Write-Host "Starting Cloudflare Public Tunnel..."

# 2. Start Cloudflare Tunnel
$cloudflaredPath = Join-Path $PSScriptRoot "cloudflared.exe"
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $cloudflaredPath
$processInfo.Arguments = "tunnel --url http://localhost:$port"
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo
$process.Start() | Out-Null

$liveUrl = $null
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

while ($process.HasExited -eq $false -and $stopwatch.ElapsedMilliseconds -lt 25000) {
    $line = $process.StandardError.ReadLine()
    if ($line) {
        Write-Host $line
        if ($line -match "(https://[a-zA-Z0-9-]+\.trycloudflare\.com)") {
            $liveUrl = $matches[1]
            break
        }
    }
}

if ($liveUrl) {
    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host "🎉 LIVE PUBLIC URL GENERATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "URL: $liveUrl" -ForegroundColor Yellow
    Write-Host "=======================================================`n" -ForegroundColor Green
    [System.IO.File]::WriteAllText((Join-Path $PSScriptRoot "live_url.txt"), $liveUrl)
    Start-Process $liveUrl
} else {
    Write-Host "Could not find live URL within timeout." -ForegroundColor Red
}
