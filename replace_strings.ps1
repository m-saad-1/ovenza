$files = Get-ChildItem -Path . -Recurse -File -Include *.html,*.js,*.css,*.md

foreach ($file in $files) {
    # Skip binary files if any accidentally get included, though filters above restrict to text
    $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw

    if ($null -eq $content) { continue }

    $originalContent = $content

    # Colors
    $content = $content -replace "719397", "EB1C24"
    $content = $content -replace "719397", "EB1C24" # lowercase fallback just in case

    # Names
    $content = $content -replace "imbiss", "meldough"
    $content = $content -replace "Imbiss", "Meldough"
    $content = $content -replace "IMBISS", "MELDOUGH"

    # Phone numbers
    $content = $content -replace "3232000888", "3111163536"
    $content = $content -replace "03232000888", "03111163536"

    # Location
    $content = $content -replace "Lahore : Opposite Jinnah Hospital", "Royal Garden, Burewala"
    $content = $content -replace "Opposite Jinnah Hospital Lahore", "Royal Garden, Burewala"
    $content = $content -replace "8A Commercial, Pak Arab, Lahore", "Royal Garden, Burewala"

    if ($content -cne $originalContent) {
        Write-Host "Updating file: $($file.FullName)"
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}
