param(
  [int]$Port = 8081,
  [switch]$StartExpo,
  [switch]$Build,
  [string]$ExpoGoApk = ""
)

$ErrorActionPreference = "Stop"

$AndroidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$Adb = Join-Path $AndroidSdk "platform-tools\adb.exe"
$Emulator = Join-Path $AndroidSdk "emulator\emulator.exe"
$ProjectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ApkPath = Join-Path $ProjectDir "android\app\build\outputs\apk\debug\app-debug.apk"
$PackageName = "com.anonymous.educomobile"
$JavaHome = "C:\Program Files\Android\Android Studio\jbr"

# AVD names
$MobileAvd = "Pixel"
$TabletAvd = "Pixel_Tablet"

function Get-EmulatorStates {
  $lines = & $Adb devices
  $rows = @()
  foreach ($line in $lines) {
    if ($line -match "^(emulator-\d+)\s+(\S+)$") {
      $rows += [PSCustomObject]@{ Id = $Matches[1]; State = $Matches[2] }
    }
  }
  return $rows
}

function Start-Emulators {
  $states = Get-EmulatorStates
  $running = @($states | Where-Object { $_.State -eq "device" })

  if ($running.Count -ge 2) {
    Write-Host "✅ Both emulators already running"
    return
  }

  Write-Host "📱 Starting emulators..."

  # Check if emulators are running
  $avds = & $Emulator -list-avds

  if ($avds -contains $MobileAvd) {
    $proc = Get-Process -Name "qemu-system-x86_64" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match $MobileAvd }
    if ($null -eq $proc) {
      Write-Host "  Starting $MobileAvd..."
      Start-Process -FilePath $Emulator -ArgumentList "-avd", $MobileAvd -WindowStyle Hidden
    }
  }

  if ($avds -contains $TabletAvd) {
    $proc = Get-Process -Name "qemu-system-x86_64" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match $TabletAvd }
    if ($null -eq $proc) {
      Write-Host "  Starting $TabletAvd..."
      Start-Process -FilePath $Emulator -ArgumentList "-avd", $TabletAvd -WindowStyle Hidden
    }
  }

  Write-Host "⏳ Waiting for emulators to boot..."
  $timeout = 90
  $elapsed = 0
  while ($elapsed -lt $timeout) {
    $states = Get-EmulatorStates
    $online = @($states | Where-Object { $_.State -eq "device" })
    if ($online.Count -ge 2) {
      Write-Host "✅ Both emulators online!"
      return
    }
    Start-Sleep -Seconds 3
    $elapsed += 3
    Write-Host "  Waiting... ($elapsed/$timeout seconds)"
  }

  Write-Host "⚠️  Timeout waiting for emulators. Continuing anyway..."
}

function Stop-ProcessOnPort([int]$port) {
  try {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($null -ne $conns) {
      $pids = @($conns | Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue) |
        Where-Object { $_ -gt 0 } | Select-Object -Unique
      foreach ($procId in $pids) {
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($null -ne $proc) {
          Write-Host "  Killing process on port $port`: $($proc.ProcessName) (PID $procId)"
          Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
      }
    }
  } catch { }
}

function Build-App {
  Write-Host "🔨 Building app (this may take a few minutes on first run)..."

  $env:JAVA_HOME = $JavaHome
  $env:ANDROID_HOME = $AndroidSdk

  Push-Location $ProjectDir
  try {
    & npx expo run:android --no-install 2>&1
  } finally {
    Pop-Location
  }
}

function Install-App([string[]]$deviceIds) {
  if (!(Test-Path $ApkPath)) {
    Write-Host "⚠️  APK not found at $ApkPath"
    Write-Host "   Run with -Build flag to build the app first"
    return $false
  }

  Write-Host "📦 Installing app on emulators..."
  foreach ($id in $deviceIds) {
    Write-Host "  Installing on $id..."
    & $Adb -s $id install -r $ApkPath 2>&1 | Out-Null
  }
  Write-Host "✅ App installed!"
  return $true
}

function Setup-AdbReverse([string[]]$deviceIds, [int]$port) {
  Write-Host "🔌 Setting up port forwarding..."
  foreach ($id in $deviceIds) {
    try {
      & $Adb -s $id reverse tcp:$port tcp:$port 2>&1 | Out-Null
    } catch {
      Write-Host "  WARN: adb reverse failed for $id"
    }
  }
}

function Start-Metro {
  Write-Host "🎯 Starting Metro bundler..."
  Stop-ProcessOnPort -port $Port

  $cmd = "cd `"$ProjectDir`"; npx expo start --dev-client --port $Port"
  Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $cmd)

  Write-Host "⏳ Waiting for Metro to start..."
  Start-Sleep -Seconds 8
}

function Launch-App([string[]]$deviceIds) {
  Write-Host "🚀 Launching app..."
  foreach ($id in $deviceIds) {
    Write-Host "  Launching on $id..."
    & $Adb -s $id shell am start -n "$PackageName/.MainActivity" 2>&1 | Out-Null
  }
}

# Main script
Write-Host ""
Write-Host "🚀 Educo Mobile - Development Environment Setup"
Write-Host "================================================"
Write-Host ""

# Ensure adb server is running
& $Adb start-server 2>&1 | Out-Null

# Start emulators
Start-Emulators

# Get online devices
$states = Get-EmulatorStates
$deviceIds = @($states | Where-Object { $_.State -eq "device" } | ForEach-Object { $_.Id })

if ($deviceIds.Count -eq 0) {
  throw "No emulators detected. Please start your emulators manually."
}

Write-Host "📱 Found emulators: $($deviceIds -join ', ')"

# Build if requested
if ($Build) {
  Build-App
}

# Install app
$installed = Install-App -deviceIds $deviceIds

# Setup port forwarding
Setup-AdbReverse -deviceIds $deviceIds -port $Port

# Start Metro if requested
if ($StartExpo) {
  Start-Metro
}

# Launch app
if ($installed) {
  Launch-App -deviceIds $deviceIds
}

Write-Host ""
Write-Host "✅ Done!"
Write-Host ""
Write-Host "📝 Usage tips:"
Write-Host "   - Metro bundler runs at http://localhost:$Port"
Write-Host "   - Press 'r' in Metro terminal to reload"
Write-Host "   - Run with -Build to rebuild the app"
Write-Host ""
