# Resizes the hero frame sequence (and poster) shipped to public/.
# Source art is 3840x2176 (~664 KB/frame). The hero canvas never exceeds 1280 px,
# so 4K sources waste ~90% of bytes and ~97% of decoded memory.
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/optimize-frames.ps1
param(
  [string]$Root = (Join-Path $PSScriptRoot "..\public"),
  [int]$HeroW = 1280,
  [int]$HeroH = 720,
  [int]$Quality = 72,
  [switch]$IncludeAutoPlay
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

function Resize-Jpeg([string]$src, [int]$w, [int]$h) {
  $before = (Get-Item $src).Length
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    if ($img.Width -le $w -and $img.Height -le $h) { $img.Dispose(); return $before }
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $w, $h)
      } finally { $g.Dispose() }
      $tmp = "$src.opt"
      $bmp.Save($tmp, $jpegCodec, $encParams)
    } finally { $bmp.Dispose() }
  } finally { $img.Dispose() }
  Move-Item -Force "$src.opt" $src | Out-Null
  return $before
}

function Process-Set([string]$dir, [int]$w, [int]$h, [string]$label) {
  if (-not (Test-Path $dir)) { return }
  $files = Get-ChildItem $dir -File -Filter *.jpg
  if (-not $files) { return }
  $startTotal = ($files | Measure-Object Length -Sum).Sum
  $i = 0
  foreach ($f in $files) {
    Resize-Jpeg $f.FullName $w $h | Out-Null
    $i++
    if ($i % 40 -eq 0) { Write-Host ("  {0}: {1}/{2}" -f $label, $i, $files.Count) }
  }
  $endTotal = (Get-ChildItem $dir -File -Filter *.jpg | Measure-Object Length -Sum).Sum
  Write-Host ("{0}: {1:N1} MB -> {2:N1} MB ({3} files)" -f $label, ($startTotal/1MB), ($endTotal/1MB), $files.Count)
}

Process-Set (Join-Path $Root "frames\v1") $HeroW $HeroH "frames/v1"

$poster = Join-Path $Root "images\hero-poster.jpg"
if (Test-Path $poster) {
  $pb = (Get-Item $poster).Length
  Resize-Jpeg $poster $HeroW $HeroH | Out-Null
  Write-Host ("hero-poster.jpg: {0:N0} KB -> {1:N0} KB" -f ($pb/1KB), ((Get-Item $poster).Length/1KB))
}

if ($IncludeAutoPlay) {
  Process-Set (Join-Path $Root "frames\2.1") 480 854 "frames/2.1"
  Process-Set (Join-Path $Root "frames\2.2") 480 854 "frames/2.2"
  Process-Set (Join-Path $Root "frames\2.3") 480 854 "frames/2.3"
}

Write-Host "Done."
