param(
  [Parameter(Mandatory = $true)]
  [string[]]$Urls
)

$key = "b7b3dc9f844a4ad39a7db382ae36c38f"
$payload = @{
  host = "weieryang.com"
  key = $key
  keyLocation = "https://weieryang.com/$key.txt"
  urlList = $Urls
} | ConvertTo-Json -Depth 3

$response = Invoke-WebRequest `
  -Uri "https://yandex.com/indexnow" `
  -Method Post `
  -ContentType "application/json; charset=utf-8" `
  -Body $payload `
  -UseBasicParsing

Write-Output "IndexNow response: $($response.StatusCode)"
