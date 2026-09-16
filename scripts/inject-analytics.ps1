param(
  [string]$Version = "20260916a"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$tag = "  <script defer src=`"/assets/site-analytics.js?v=$Version`"></script>"
$pattern = '(?i)[ \t]*<script\s+defer\s+src="/assets/site-analytics\.js\?v=[^"]+"></script>'
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$updated = 0

Get-ChildItem -LiteralPath $root -Recurse -File -Filter "*.html" |
  Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' } |
  ForEach-Object {
    $originalContent = [System.IO.File]::ReadAllText($_.FullName)
    $content = $originalContent
    $content = [regex]::Replace($content, $pattern, "")

    if ($content -notmatch '</head>') {
      throw "Missing </head> in $($_.FullName)"
    }

    $newContent = [regex]::Replace(
      $content,
      '\s*</head>',
      "`n$tag`n</head>",
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    if ($newContent -ne $originalContent) {
      [System.IO.File]::WriteAllText($_.FullName, $newContent, $utf8NoBom)
      $updated++
    }
  }

Write-Output "Analytics tag updated in $updated HTML files."
