$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "LivelyWorms"
$livelyPath = "$env:LOCALAPPDATA\Lively Wallpaper\Library\wallpapers"
$dest = Join-Path $livelyPath "LivelyWorms"

Write-Host "Checking for Lively Wallpaper library..."
if (!(Test-Path $livelyPath)) {
    Write-Error "Lively Wallpaper library not found at: $livelyPath"
}

Write-Host "Installing LivelyWorms to: $dest"

if (Test-Path $dest) {
    Write-Host "Removing existing installation..."
    Remove-Item -Path $dest -Recurse -Force
}

Write-Host "Copying files..."
Copy-Item -Path $source -Destination $dest -Recurse

Write-Host "Installation complete! Please restart Lively Wallpaper or refresh the library." -ForegroundColor Green
