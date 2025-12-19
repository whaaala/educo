param(
  [int]$Port = 8093,
  [switch]$StartExpo,
  [string]$ExpoGoApk = ""
)

$ErrorActionPreference = "Stop"

function Get-AdbPath {
  $sdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
  $adb = Join-Path $sdk "platform-tools\adb.exe"
  if (Test-Path $adb) { return $adb }
  throw "adb.exe not found at $adb. Install Android SDK Platform-Tools in Android Studio."
}

function Get-ProjectDir {
  return (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

function Stop-ProcessOnPort([int]$port) {
  $pids = @()

  try {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($null -ne $conns) {
      $pids = @($conns | Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue) |
        Where-Object { $_ -gt 0 } | Select-Object -Unique
    }
  } catch {
    $matches = netstat -ano | Select-String (":$port\s")
    foreach ($m in $matches) {
      $parts = ($m -split "\s+") | Where-Object { $_ -ne "" }
      if ($parts.Count -gt 0) {
        $pidRaw = $parts[$parts.Count - 1]
        if ($pidRaw -match "^\d+$") { $pids += [int]$pidRaw }
      }
    }
    $pids = $pids | Select-Object -Unique
  }

  foreach ($procId in $pids) {
    try {
      $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
      if ($null -ne $proc) {
        Write-Host ("Killing process on port " + $port + ": " + $proc.ProcessName + " (PID " + $procId + ")")
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      }
    } catch { }
  }
}

function Start-ExpoServer([string]$projectDir, [int]$port) {
  # Keep the window open even if Expo crashes, and persist logs for debugging.
  $logDir = Join-Path $projectDir ".expo"
  if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
  $logFile = Join-Path $logDir "expo-server.log"

  # Do not pass --non-interactive here (some Expo CLI versions reject it). We already kill the port to avoid prompts.
  $cmd = "cd `"$projectDir`"; npx expo start --clear --host localhost --port $port 2>&1 | Tee-Object -FilePath `"$logFile`""
  Write-Host "Starting Expo dev server in a new PowerShell window..."
  Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $cmd) | Out-Null
}

function Find-ExpoGoApkFromCache {
  $cacheDir = Join-Path $env:USERPROFILE ".expo\android-apk-cache"
  if (!(Test-Path $cacheDir)) { return "" }

  $candidates = Get-ChildItem -Path $cacheDir -Filter "*.apk" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "(?i)expo|exponent" } |
    Sort-Object LastWriteTime -Descending

  if ($candidates.Count -gt 0) {
    return $candidates[0].FullName
  }

  return ""
}

function Get-EmulatorStates([string]$adb) {
  $lines = & $adb devices
  $rows = @()
  foreach ($line in $lines) {
    if ($line -match "^(emulator-\d+)\s+(\S+)$") {
      $rows += [PSCustomObject]@{ Id = $Matches[1]; State = $Matches[2] }
    }
  }
  return $rows
}

function Wait-ForOnlineEmulators([string]$adb, [int]$timeoutSeconds = 90) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    $states = Get-EmulatorStates -adb $adb
    $online = @($states | Where-Object { $_.State -eq "device" } | ForEach-Object { $_.Id })
    if ($online.Count -gt 0) { return $online }
    Start-Sleep -Seconds 2
  }
  return @()
}

function Has-ExpoGo([string]$adb, [string]$deviceId) {
  $out = & $adb -s $deviceId shell pm list packages host.exp.exponent
  foreach ($line in $out) {
    if ($line -match "^package:host\.exp\.exponent$") { return $true }
  }
  return $false
}

function Install-ExpoGo([string]$adb, [string[]]$deviceIds, [string]$apkPath) {
  if ([string]::IsNullOrWhiteSpace($apkPath)) { return }
  if (!(Test-Path $apkPath)) { throw "ExpoGoApk not found at: $apkPath" }

  foreach ($id in $deviceIds) {
    Write-Host "Installing Expo Go on $id..."
    & $adb -s $id wait-for-device | Out-Null
    & $adb -s $id install -r $apkPath | Out-Null
  }
}

function Setup-AdbReverse([string]$adb, [string[]]$deviceIds, [int]$port) {
  foreach ($id in $deviceIds) {
    try {
      & $adb -s $id wait-for-device | Out-Null
      # Forward device localhost:$port -> host localhost:$port
      & $adb -s $id reverse ("tcp:" + $port) ("tcp:" + $port) | Out-Null
    } catch {
      Write-Host ("WARN: adb reverse failed for " + $id + ". We'll fall back to 10.0.2.2 if needed.")
    }
  }
}

function Open-ExpoUrl([string]$adb, [string[]]$deviceIds, [int]$port) {
  # With adb reverse, 127.0.0.1 on the emulator routes to host localhost.
  $url = "exp://127.0.0.1:$port"
  foreach ($id in $deviceIds) {
    Write-Host "Opening $url on $id..."
    & $adb -s $id wait-for-device | Out-Null
    & $adb -s $id shell am force-stop host.exp.exponent | Out-Null
    & $adb -s $id shell am start -a android.intent.action.VIEW -d $url | Out-Null
  }
  Write-Host ""
  Write-Host "If you see 'unable to resolve Intent', install Expo Go on that emulator first (use -ExpoGoApk)."
}

$adb = Get-AdbPath
$projectDir = Get-ProjectDir

if ($StartExpo) {
  Stop-ProcessOnPort -port $Port
  Write-Host ("Using dev server port: " + $Port)
  Start-ExpoServer -projectDir $projectDir -port $Port
  Start-Sleep -Seconds 3
}

Write-Host "Ensuring adb server is running..."
& $adb start-server | Out-Null

$deviceIds = Wait-ForOnlineEmulators -adb $adb -timeoutSeconds 90
if ($deviceIds.Count -lt 1) {
  Write-Host ""
  Write-Host "ADB output (for debugging):"
  & $adb devices
  Write-Host ""
  throw "No ONLINE Android emulators detected (state must be 'device'). Start your phone/tablet emulators, wait until fully booted, then re-run."
}

Write-Host ("Detected ONLINE emulators: " + ($deviceIds -join ", "))

if ([string]::IsNullOrWhiteSpace($ExpoGoApk)) {
  $fromCache = Find-ExpoGoApkFromCache
  if (![string]::IsNullOrWhiteSpace($fromCache)) {
    Write-Host ("Found Expo Go APK in cache: " + $fromCache)
    $ExpoGoApk = $fromCache
  }
}

$missingExpoGo = @()
foreach ($id in $deviceIds) {
  if (!(Has-ExpoGo -adb $adb -deviceId $id)) { $missingExpoGo += $id }
}

if ($missingExpoGo.Count -gt 0) {
  if ([string]::IsNullOrWhiteSpace($ExpoGoApk)) {
    Write-Host ""
    Write-Host ("Expo Go is NOT installed on: " + ($missingExpoGo -join ", "))
    Write-Host "No Expo Go APK provided and none found in cache."
    Write-Host "Download the Expo Go APK from https://expo.dev/go and re-run with:"
    Write-Host "  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/open-android-both.ps1 -Port 8093 -StartExpo -ExpoGoApk C:\\Path\\To\\ExpoGo.apk"
    throw "Cannot open exp:// URL without Expo Go installed."
  }
  Install-ExpoGo -adb $adb -deviceIds $missingExpoGo -apkPath $ExpoGoApk
}

Setup-AdbReverse -adb $adb -deviceIds $deviceIds -port $Port
Open-ExpoUrl -adb $adb -deviceIds $deviceIds -port $Port


