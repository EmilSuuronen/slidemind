param (
    [string]$pptxPath,
    [string]$outputDir
)

# Ensure output directory exists
if (!(Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Get output PDF path from PPTX file name
$outputPdfPath = Join-Path -Path $outputDir -ChildPath ([System.IO.Path]::GetFileNameWithoutExtension($pptxPath) + ".pdf")

# Initialize PowerPoint application
$powerPoint = New-Object -ComObject PowerPoint.Application
$powerPoint.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

try {
    # Open the presentation
    $presentation = $powerPoint.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoCTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse)

    # Export to PDF
    $presentation.SaveAs($outputPdfPath, [Microsoft.Office.Interop.PowerPoint.PpSaveAsFileType]::ppSaveAsPDF)
    $presentation.Close()

    # Output the PDF path
    Write-Output $outputPdfPath
} catch {
    Write-Error "Failed to convert PPTX to PDF: $_"
} finally {
    # Quit PowerPoint
    $powerPoint.Quit()
}
