# HopeTrack Apps Script Setup

## Overview

This guide explains how to install the HopeTrack Google Apps Script layer for:

- visual enhancements inside Google Sheets
- custom menu actions
- data quality checks
- PDF export
- email sending
- monthly report generation

## Files

- Apps Script code: [HopeTrackTools.gs](C:/EPx/Mon%20portefolio/projects/unified-marketing-reporting-template/apps-script/HopeTrackTools.gs)
- Workbook brief: [README.md](C:/EPx/Mon%20portefolio/projects/unified-marketing-reporting-template/README.md)

## Installation

1. Open the Google Sheet.
2. Go to `Extensions` > `Apps Script`.
3. Delete the default `Code.gs` content.
4. Create a new script file named `HopeTrackTools`.
5. Paste the content of [HopeTrackTools.gs](C:/EPx/Mon%20portefolio/projects/unified-marketing-reporting-template/apps-script/HopeTrackTools.gs).
6. Save the project.
7. Refresh the spreadsheet.
8. Confirm that the menu `🚀 HopeTrack Tools` appears.

## First Run

Run these functions once from the Apps Script editor:

1. `onOpen`
2. `applyVisualEnhancements`
3. `refreshAllKPIs`
4. `checkDataQuality`

## Add Physical Buttons

1. In Google Sheets, go to `Insert` > `Drawing`.
2. Create a rounded rectangle button with a label such as `Check Data Quality`.
3. Save and place it on the relevant sheet.
4. Click the drawing menu `⋮` > `Assign script`.
5. Use one of these function names:
   - `checkDataQuality`
   - `refreshAllKPIs`
   - `exportWeeklyReportPDF`
   - `sendWeeklyReport`
   - `generateMonthlyReport`
   - `applyVisualEnhancements`

Recommended placement:

- `KPI_Dashboard`: `refreshAllKPIs`, `applyVisualEnhancements`
- `Data_Quality_Log`: `checkDataQuality`
- `Weekly_Report`: `exportWeeklyReportPDF`, `sendWeeklyReport`
- `Monthly_Report`: `generateMonthlyReport`

## Google Permissions Required

At first execution, Google will ask for permissions for:

- `SpreadsheetApp`
  Needed to read, write, format sheets, formulas, charts, and menus.
- `DriveApp`
  Needed to create the `HopeTrack Reports` folder and save PDFs.
- `GmailApp`
  Needed to send the weekly report email.
- `UrlFetchApp`
  Needed to export the sheet as PDF through Google’s export endpoint.
- `ScriptApp`
  Needed to obtain the OAuth token for secure PDF export.

## Suggested Rollout Order

1. Run `applyVisualEnhancements`
2. Run `refreshAllKPIs`
3. Run `checkDataQuality`
4. Run `generateMonthlyReport`
5. Test `exportWeeklyReportPDF`
6. Test `sendWeeklyReport` with your own email first

## Notes

- The script is designed for Google Sheets, not Excel.
- Error messages are intentionally written in French, as requested.
- Generated stakeholder-facing text remains in English.
