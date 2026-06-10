$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$nodeBin = "C:\Users\liu\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$node = Join-Path $nodeBin "node.exe"
$env:PATH = "$nodeBin;$env:PATH"
Set-Location $root
& $node ".\node_modules\vite\bin\vite.js" "--host" "127.0.0.1"
