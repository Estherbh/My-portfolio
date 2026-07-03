/**
 * HopeTrack Unified Marketing Reporting Template
 * Google Apps Script toolkit
 *
 * Ce script ajoute :
 * - un menu personnalise
 * - des controles qualite
 * - un export PDF
 * - un envoi email
 * - une generation du Monthly Report
 * - des ameliorations visuelles
 * - une page Start_Here avec guide utilisateur
 */

const HT_CONFIG = {
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1yRjlZdXVFjySUQVqpP2nDmzuz1Gtw4lxJ_zyzdFmxhA/edit?usp=sharing',
  reportsFolderName: 'HopeTrack Reports',
  startSheet: 'Start_Here',
  dashboardSheet: 'KPI_Dashboard',
  weeklyReportSheet: 'Weekly_Report',
  monthlyReportSheet: 'Monthly_Report',
  qualitySheet: 'Data_Quality_Log',
  comparisonSheet: 'Channel_Comparison',
  rawSheets: ['RAW_Social', 'RAW_Web', 'RAW_Email', 'RAW_CRM'],
  timezone: Session.getScriptTimeZone() || 'Africa/Johannesburg',
  monthlyTarget: 16667,
};

/**
 * Cree le menu personnalise a l'ouverture du fichier.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('HopeTrack Tools')
    .addItem('Check Data Quality', 'checkDataQuality')
    .addSeparator()
    .addItem('Refresh All KPIs', 'refreshAllKPIs')
    .addSeparator()
    .addItem('Update Start Here Guide', 'createOrUpdateStartHereGuide')
    .addSeparator()
    .addItem('📄 Export Weekly Report PDF', 'exportWeeklyReportPDF')
    .addItem('Send Weekly Report by Email', 'sendWeeklyReport')
    .addSeparator()
    .addItem('Generate Monthly Report', 'generateMonthlyReport')
    .addSeparator()
    .addItem('Apply Visual Enhancements', 'applyVisualEnhancements')
    .addToUi();
}

/**
 * Utilitaire pratique pour installer la couche de base d'un coup.
 */
function setupHopeTrackWorkspace() {
  createOrUpdateStartHereGuide();
  applyVisualEnhancements();
  refreshAllKPIs();
  checkDataQuality();
  SpreadsheetApp.getUi().alert('HopeTrack workspace setup complete.');
}

/**
 * Cree ou met a jour la page Start_Here.
 * Cette page explique le role du fichier, les boutons et le workflow.
 */
function createOrUpdateStartHereGuide() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(HT_CONFIG.startSheet);

    if (!sheet) {
      sheet = ss.insertSheet(HT_CONFIG.startSheet, 0);
    }

    sheet.clear();
    sheet.clearConditionalFormatRules();
    sheet.setHiddenGridlines(true);

    sheet.getRange('A1:H1').merge().setValue('HopeTrack International | Start Here');
    sheet.getRange('A1:H1')
      .setBackground('#17324D')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(18)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.getRange('A2:H3').merge().setValue(
      'This page explains what the workbook does, where the HopeTrack Tools menu is located, how to update the data, and what each section is used for.'
    );
    sheet.getRange('A2:H3')
      .setBackground('#DDEDE3')
      .setFontColor('#17324D')
      .setWrap(true)
      .setVerticalAlignment('middle');

    writeSectionHeader_(sheet, 'A5:H5', '1. What this workbook does');
    sheet.getRange('A6:H8').merge().setValue(
      'This workbook combines Social, Web, Email, and CRM reporting into one operating view. It helps teams monitor performance, identify data issues, compare channels, and prepare weekly or monthly reporting outputs for non-technical stakeholders.'
    );
    formatContentBox_(sheet.getRange('A6:H8'));

    writeSectionHeader_(sheet, 'A10:B10', '2. Recommended workflow');
    sheet.getRange('A11:B16').setValues([
      ['Step 1', 'Update the RAW_Social, RAW_Web, RAW_Email, and RAW_CRM tabs with the latest source exports.'],
      ['Step 2', 'Review UTM_Tracker before campaign launch to confirm naming and validation status.'],
      ['Step 3', 'Open HopeTrack Tools in the top menu bar and run Check Data Quality first.'],
      ['Step 4', 'Run Refresh All KPIs, then review KPI_Dashboard and Channel_Comparison.'],
      ['Step 5', 'Use Weekly_Report for short weekly updates and Monthly_Report for a 3-month summary.'],
      ['Step 6', 'Export or share outputs after reviewing the Executive Summary and data health.'],
    ]);
    formatTwoColumnTable_(sheet.getRange('A11:B16'), '#DDEDE3');

    writeSectionHeader_(sheet, 'D10:H10', '3. Where the buttons are');
    sheet.getRange('D11:H13').merge().setValue(
      'In Google Sheets, the action menu appears in the top bar under HopeTrack Tools after Apps Script is installed and the file is refreshed. The menu is not inside a tab.'
    );
    formatContentBox_(sheet.getRange('D11:H13'));

    writeSectionHeader_(sheet, 'D15:H15', '4. What each menu action does');
    sheet.getRange('D16:E22').setValues([
      ['Check Data Quality', 'Scans key sheets and highlights structural issues before interpretation.'],
      ['Refresh All KPIs', 'Recalculates KPI logic and stamps the latest update time on the dashboard.'],
      ['Update Start Here Guide', 'Rebuilds this onboarding page if the guide is missing or outdated.'],
      ['Export Weekly Report PDF', 'Creates a PDF file of the Weekly_Report sheet in Google Drive.'],
      ['Send Weekly Report by Email', 'Sends a stakeholder-friendly HTML summary by email.'],
      ['Generate Monthly Report', 'Updates the monthly narrative section with top insights and recommendations.'],
      ['Apply Visual Enhancements', 'Applies formatting, charts, and display improvements to the workbook.'],
    ]);
    formatTwoColumnTable_(sheet.getRange('D16:E22'), '#F5F1E8');

    writeSectionHeader_(sheet, 'A18:B18', '5. What each sheet is for');
    sheet.getRange('A19:B29').setValues([
      ['Start_Here', 'Onboarding guide and usage instructions for new users.'],
      ['RAW_Social / RAW_Web / RAW_Email / RAW_CRM', 'Source tabs where fresh exports are updated.'],
      ['UTM_Tracker', 'Campaign naming control and UTM validation before launch.'],
      ['KPI_Dashboard', 'Executive KPI view with health score, deltas, and action flags.'],
      ['Weekly_Report', 'Short narrative reporting page for weekly updates.'],
      ['Monthly_Report', 'Three-month view with insights and recommendations.'],
      ['Data_Quality_Log', 'Quality review tab listing warnings, errors, and recommendations.'],
      ['Channel_Comparison', 'Cross-channel comparison with ROI and channel recommendations.'],
      ['KPI_Framework', 'Definitions and business interpretation of each KPI.'],
      ['Governance_Notes', 'Assumptions, limits, ownership, and reporting guardrails.'],
      ['Best practice', 'Always validate data quality before sharing insights externally.'],
    ]);
    formatTwoColumnTable_(sheet.getRange('A19:B29'), '#F6F8FA');

    sheet.getRange('G25:H29').merge().setValue(
      'Quick start: Run onOpen once in Apps Script, refresh the spreadsheet, then use HopeTrack Tools from the top menu.'
    );
    sheet.getRange('G25:H29')
      .setBackground('#FFF4E5')
      .setFontColor('#17324D')
      .setFontWeight('bold')
      .setWrap(true)
      .setBorder(true, true, true, true, true, true, '#E6EAEE', SpreadsheetApp.BorderStyle.SOLID);

    setColumnWidths_(sheet, {
      1: 150,
      2: 430,
      4: 170,
      5: 380,
      7: 150,
      8: 150,
    });
    sheet.setRowHeights(1, 29, 28);
    sheet.setRowHeights(2, 2, 34);
    sheet.setFrozenRows(3);
    ss.setActiveSheet(sheet);

    SpreadsheetApp.getUi().alert('Start_Here guide updated successfully.');
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur guide Start_Here : ${error.message}`);
  }
}

/**
 * Verifie la qualite des donnees des onglets RAW, journalise les resultats
 * et colore les cellules problematiques.
 */
function checkDataQuality() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const qualitySheet = ss.getSheetByName(HT_CONFIG.qualitySheet);
    if (!qualitySheet) throw new Error(`Onglet introuvable : ${HT_CONFIG.qualitySheet}`);

    const results = [];
    let overallIssues = 0;

    HT_CONFIG.rawSheets.forEach((sheetName) => {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) throw new Error(`Onglet introuvable : ${sheetName}`);

      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      if (lastRow < 4) return;

      const dataRange = sheet.getRange(4, 1, lastRow - 3, lastCol);
      const values = dataRange.getValues();
      const backgrounds = dataRange.getBackgrounds();

      let emptyCount = 0;
      let duplicateCount = 0;
      let outlierCount = 0;
      const rowSignatures = new Map();
      const numericStats = buildNumericStats(values);

      values.forEach((row, rowIndex) => {
        const signature = JSON.stringify(row);
        rowSignatures.set(signature, (rowSignatures.get(signature) || 0) + 1);

        row.forEach((cell, colIndex) => {
          const isEmpty = cell === '' || cell === null;
          if (isEmpty) {
            emptyCount += 1;
            backgrounds[rowIndex][colIndex] = '#FFF4E5';
            return;
          }

          if (typeof cell === 'number') {
            const stat = numericStats[colIndex];
            if (stat && stat.mean > 0 && cell > stat.mean * 3) {
              outlierCount += 1;
              backgrounds[rowIndex][colIndex] = '#FDECEC';
            }
          }
        });
      });

      values.forEach((row, rowIndex) => {
        const signature = JSON.stringify(row);
        if ((rowSignatures.get(signature) || 0) > 1) {
          duplicateCount += 1;
          for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
            backgrounds[rowIndex][colIndex] = '#FFF4E5';
          }
        }
      });

      dataRange.setBackgrounds(backgrounds);

      const issueCount = emptyCount + duplicateCount + outlierCount;
      overallIssues += issueCount;
      const status = issueCount === 0 ? 'OK' : issueCount >= 5 ? 'Error' : 'Warning';
      const notes = issueCount === 0
        ? 'No structural issues detected during scripted QA.'
        : `${emptyCount} empty cells, ${duplicateCount} duplicates, ${outlierCount} outliers flagged.`;

      results.push([
        new Date(),
        sheetName,
        values.length,
        emptyCount,
        duplicateCount,
        issueCount === 0 ? 'None' : `${outlierCount} outliers / ${emptyCount} empties`,
        status,
        notes,
        status === 'Error'
          ? 'Contact source team immediately'
          : status === 'Warning'
            ? 'Verify before next report'
            : 'No action required',
      ]);
    });

    writeQualityResults(qualitySheet, results);
    updateOverallDataHealth_(qualitySheet, results);

    const totalRows = results.length || 1;
    const healthyRows = results.filter((row) => row[6] === 'OK').length;
    const warningRows = results.filter((row) => row[6] === 'Warning').length;
    const overallHealth = Math.round(((healthyRows + warningRows * 0.5) / totalRows) * 100);

    SpreadsheetApp.getUi().alert(
      'Data Quality Check Complete\n' +
      `Overall Health : ${overallHealth}%\n` +
      `Issues found : ${overallIssues}\n` +
      'See Data_Quality_Log for details'
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur lors du controle qualite : ${error.message}`);
  }
}

/**
 * Exporte l'onglet Weekly_Report en PDF dans un dossier Drive dedie.
 */
function exportWeeklyReportPDF() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HT_CONFIG.weeklyReportSheet);
    if (!sheet) throw new Error(`Onglet introuvable : ${HT_CONFIG.weeklyReportSheet}`);

    const folder = getOrCreateFolder_(HT_CONFIG.reportsFolderName);
    const spreadsheetId = ss.getId();
    const gid = sheet.getSheetId();
    const dateLabel = Utilities.formatDate(new Date(), HT_CONFIG.timezone, 'yyyy-MM-dd');
    const filename = `HopeTrack_Weekly_Report_${dateLabel}.pdf`;

    const exportUrl =
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export` +
      `?format=pdf&portrait=true&size=A4&fitw=true&sheetnames=false&printtitle=false` +
      `&pagenumbers=false&gridlines=false&fzr=true&gid=${gid}`;

    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(exportUrl, {
      headers: { Authorization: `Bearer ${token}` },
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() >= 300) {
      throw new Error(`Export PDF echoue (${response.getResponseCode()})`);
    }

    const blob = response.getBlob().setName(filename);
    folder.createFile(blob);

    SpreadsheetApp.getUi().alert('PDF exported successfully to Google Drive.');
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur export PDF : ${error.message}`);
  }
}

/**
 * Envoie le rapport hebdomadaire par email avec resume HTML des KPI.
 */
function sendWeeklyReport() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(
      'Envoyer le Weekly Report',
      'Veuillez saisir l adresse email du destinataire :',
      ui.ButtonSet.OK_CANCEL
    );

    if (response.getSelectedButton() !== ui.Button.OK) return;

    const email = response.getResponseText().trim();
    if (!email || email.indexOf('@') === -1) {
      throw new Error('Adresse email invalide.');
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboard = ss.getSheetByName(HT_CONFIG.dashboardSheet);
    if (!dashboard) throw new Error(`Onglet introuvable : ${HT_CONFIG.dashboardSheet}`);

    const kpiRows = dashboard.getRange('A9:I22').getDisplayValues();
    const healthScore = dashboard.getRange('A3').getDisplayValue();
    const executiveSummary = dashboard.getRange('A4').getDisplayValue();

    const highlightRows = [
      findKpiRow_(kpiRows, 'Total Impressions'),
      findKpiRow_(kpiRows, 'Engagement Rate'),
      findKpiRow_(kpiRows, 'Click-Through Rate'),
      findKpiRow_(kpiRows, 'Total Donations (USD)'),
    ].filter(Boolean);

    const html = `
      <div style="font-family:Arial,sans-serif;color:#17324D;line-height:1.5;">
        <div style="background:#17324D;color:#FFFFFF;padding:16px 20px;border-radius:10px 10px 0 0;">
          <h2 style="margin:0;">HopeTrack International</h2>
          <p style="margin:6px 0 0;">Weekly Performance Summary</p>
        </div>
        <div style="border:1px solid #E6EAEE;border-top:0;padding:20px;border-radius:0 0 10px 10px;">
          <p><strong>${healthScore}</strong></p>
          <p>${executiveSummary}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr style="background:#2A7F80;color:#FFFFFF;">
                <th style="padding:10px;border:1px solid #E6EAEE;">KPI</th>
                <th style="padding:10px;border:1px solid #E6EAEE;">Current</th>
                <th style="padding:10px;border:1px solid #E6EAEE;">Delta</th>
                <th style="padding:10px;border:1px solid #E6EAEE;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${highlightRows.map((row) => `
                <tr>
                  <td style="padding:10px;border:1px solid #E6EAEE;">${row[1]}</td>
                  <td style="padding:10px;border:1px solid #E6EAEE;">${row[2]}</td>
                  <td style="padding:10px;border:1px solid #E6EAEE;">${row[4]}</td>
                  <td style="padding:10px;border:1px solid #E6EAEE;">${row[8]}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <p>Open the full workbook here: <a href="${HT_CONFIG.spreadsheetUrl}">${HT_CONFIG.spreadsheetUrl}</a></p>
          <p style="font-size:12px;color:#5F6B76;">Confidential - HopeTrack International</p>
        </div>
      </div>
    `;

    GmailApp.sendEmail(email, 'HopeTrack Weekly Report', 'Please view this email in HTML format.', {
      htmlBody: html,
      name: 'HopeTrack Reporting Bot',
    });

    ui.alert(`Weekly report sent to ${email}.`);
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur envoi email : ${error.message}`);
  }
}

/**
 * Force le recalcul global des KPI, applique les visuels et enregistre l'heure.
 */
function refreshAllKPIs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    SpreadsheetApp.flush();

    const dashboard = ss.getSheetByName(HT_CONFIG.dashboardSheet);
    if (!dashboard) throw new Error(`Onglet introuvable : ${HT_CONFIG.dashboardSheet}`);

    dashboard.getRange('K23')
      .setValue(`Last update: ${Utilities.formatDate(new Date(), HT_CONFIG.timezone, 'yyyy-MM-dd HH:mm:ss')}`)
      .setFontWeight('bold')
      .setFontColor('#17324D');

    const errors = scanFormulaErrors_(ss);
    applyVisualEnhancements();
    SpreadsheetApp.flush();

    if (errors.length > 0) {
      SpreadsheetApp.getUi().alert(
        'Refresh completed with warnings.\n' +
        `Erreurs detectees : ${errors.length}\n` +
        errors.slice(0, 5).join('\n')
      );
      return;
    }

    SpreadsheetApp.getUi().alert(
      `All KPIs refreshed - Last update : ${Utilities.formatDate(new Date(), HT_CONFIG.timezone, 'yyyy-MM-dd HH:mm:ss')}`
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur lors du refresh des KPI : ${error.message}`);
  }
}

/**
 * Recalcule et reformate le Monthly_Report puis regenere les insights.
 */
function generateMonthlyReport() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const monthly = ss.getSheetByName(HT_CONFIG.monthlyReportSheet);
    const dashboard = ss.getSheetByName(HT_CONFIG.dashboardSheet);
    if (!monthly || !dashboard) {
      throw new Error('Onglets Monthly_Report ou KPI_Dashboard introuvables.');
    }

    SpreadsheetApp.flush();

    const kpiTable = dashboard.getRange('A9:I22').getDisplayValues();
    const insights = buildMonthlyInsights_(kpiTable);
    const recommendations = buildMonthlyRecommendations_(kpiTable);

    monthly.getRange('G5:J7').breakApart().merge();
    monthly.getRange('G5').setValue(insights.join('\n'));
    monthly.getRange('G10:J12').breakApart().merge();
    monthly.getRange('G10').setValue(recommendations.join('\n'));

    applyMonthlyReportDesign_(monthly);
    SpreadsheetApp.flush();

    SpreadsheetApp.getUi().alert('Monthly Report generated.');
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur generation Monthly Report : ${error.message}`);
  }
}

/**
 * Applique les ameliorations visuelles principales sur les onglets.
 */
function applyVisualEnhancements() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    createOrUpdateStartHereGuideSilently_(ss);
    styleDashboardVisuals_(ss.getSheetByName(HT_CONFIG.dashboardSheet));
    styleRawSheets_(ss);
    styleComparisonSheet_(ss.getSheetByName(HT_CONFIG.comparisonSheet));
    applyReportDesign_(ss.getSheetByName(HT_CONFIG.weeklyReportSheet), 'Weekly Performance Report');
    applyMonthlyReportDesign_(ss.getSheetByName(HT_CONFIG.monthlyReportSheet));
    SpreadsheetApp.flush();
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Erreur amelioration visuelle : ${error.message}`);
  }
}

function styleDashboardVisuals_(sheet) {
  if (!sheet) throw new Error('KPI_Dashboard introuvable.');

  const cards = [
    { range: 'K26:M29', color: '#DCEAFE', title: 'AWARENESS', valueCell: 'C9', deltaCell: 'E9', label: 'Total Impressions', numberFormat: '#,##0' },
    { range: 'N26:P29', color: '#DCFCE7', title: 'ENGAGEMENT', valueCell: 'C12', deltaCell: 'E12', label: 'Engagement Rate', numberFormat: '0.0%' },
    { range: 'Q26:S29', color: '#FEF3C7', title: 'CONSIDERATION', valueCell: 'C15', deltaCell: 'E15', label: 'Click-Through Rate', numberFormat: '0.0%' },
    { range: 'T26:V29', color: '#FEE2E2', title: 'CONVERSION', valueCell: 'C18', deltaCell: 'E18', label: 'Total Donations', numberFormat: '$#,##0' },
  ];

  cards.forEach((card) => {
    const range = sheet.getRange(card.range);
    range.breakApart().merge();
    range
      .setBackground(card.color)
      .setBorder(true, true, true, true, true, true, '#E6EAEE', SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
      .setVerticalAlignment('middle')
      .setHorizontalAlignment('left')
      .setWrap(true);

    const current = formatValueForCard_(sheet.getRange(card.valueCell).getValue(), card.numberFormat);
    const delta = formatValueForCard_(sheet.getRange(card.deltaCell).getValue(), card.numberFormat);
    range.setValue(`${card.title}\n${card.label}\n${current}\nDelta: ${delta}`);
    range.setFontSize(12).setFontWeight('bold').setFontColor('#17324D');
  });

  ensureChart_(sheet, 'Marketing Funnel - Education for All 2026', () => {
    const helperRange = sheet.getRange('R1:S4');
    helperRange.setValues([
      ['Stage', 'Normalized'],
      ['Awareness', 1],
      ['Engagement', '=C12'],
      ['Consideration', '=C15'],
    ]);
    const chart = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(helperRange)
      .setPosition(6, 11, 0, 0)
      .setOption('title', 'Marketing Funnel - Education for All 2026')
      .setOption('legend', { position: 'none' })
      .setOption('colors', ['#17324D'])
      .build();
    sheet.insertChart(chart);
  });

  ensureChart_(sheet, 'Monthly Donations vs Target', () => {
    const helperRange = sheet.getRange('U1:W4');
    helperRange.setValues([
      ['Month', 'Donations', 'Target'],
      ['Jan 2026', '=L2', HT_CONFIG.monthlyTarget],
      ['Feb 2026', '=L3', HT_CONFIG.monthlyTarget],
      ['Mar 2026', '=L4', HT_CONFIG.monthlyTarget],
    ]);
    const chart = sheet.newChart()
      .setChartType(Charts.ChartType.COMBO)
      .addRange(helperRange)
      .setPosition(6, 16, 0, 0)
      .setOption('title', 'Monthly Donations vs Target')
      .setOption('series', {
        0: { type: 'bars', color: '#2A7F80' },
        1: { type: 'line', color: '#C62828' },
      })
      .build();
    sheet.insertChart(chart);
  });
}

function styleRawSheets_(ss) {
  HT_CONFIG.rawSheets.forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 4) return;

    sheet.getRange(3, 1, 1, lastCol)
      .setBackground('#17324D')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');

    const summaryRow = lastRow + 2;
    sheet.getRange(summaryRow, 1).setValue('Summary');
    sheet.getRange(summaryRow, 1, 1, lastCol).setBackground('#DDEDE3').setFontWeight('bold');

    for (let col = 2; col <= lastCol; col += 1) {
      const letter = columnToLetter_(col);
      const dataRange = `${letter}4:${letter}${lastRow}`;
      sheet.getRange(summaryRow, col).setFormula(
        `=IF(COUNT(${dataRange})=0,"",IF(COUNTIF(${dataRange},">0")=COUNT(${dataRange}),SUM(${dataRange}),AVERAGE(${dataRange})))`
      );
    }

    const sparklineCol = lastCol + 2;
    sheet.getRange(3, sparklineCol)
      .setValue('Sparkline')
      .setBackground('#2A7F80')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');

    const metricColumn = sheetName === 'RAW_Social' ? 'D' : sheetName === 'RAW_Web' ? 'C' : sheetName === 'RAW_Email' ? 'J' : 'D';
    sheet.getRange(4, sparklineCol).setFormula(
      `=SPARKLINE(${metricColumn}4:${metricColumn}${lastRow},{"charttype","column";"color","#2A7F80"})`
    );

    applyPercentileFormatting_(sheet, 4, lastRow, 1, lastCol);
  });
}

function styleComparisonSheet_(sheet) {
  if (!sheet) return;
  ensureChart_(sheet, 'ROI by Channel', () => {
    const chart = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange('A4:E8'))
      .setPosition(10, 8, 0, 0)
      .setOption('title', 'ROI by Channel')
      .setOption('legend', { position: 'none' })
      .setOption('colors', ['#2A7F80'])
      .build();
    sheet.insertChart(chart);
  });
}

function applyReportDesign_(sheet, title) {
  if (!sheet) return;
  sheet.getRange('A1:H1').breakApart().merge().setValue(`HopeTrack International - ${title}`);
  sheet.getRange('A1:H1')
    .setBackground('#17324D')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(16);
  sheet.getRange('A2:H2').breakApart().merge().setValue(`Reporting date: ${Utilities.formatDate(new Date(), HT_CONFIG.timezone, 'yyyy-MM-dd')}`);
  sheet.getRange('A2:H2')
    .setBackground('#DDEDE3')
    .setFontColor('#17324D')
    .setFontWeight('bold');
  const lastRow = Math.max(sheet.getLastRow(), 12);
  sheet.getRange(lastRow + 2, 1, 1, 8).breakApart().merge().setValue('Confidential - HopeTrack International');
  sheet.getRange(lastRow + 2, 1, 1, 8)
    .setBackground('#F5F1E8')
    .setFontColor('#5F6B76')
    .setHorizontalAlignment('center');
}

function applyMonthlyReportDesign_(sheet) {
  applyReportDesign_(sheet, 'Monthly Performance Report');
}

function buildNumericStats(values) {
  const stats = {};
  values.forEach((row) => {
    row.forEach((cell, index) => {
      if (typeof cell !== 'number') return;
      if (!stats[index]) stats[index] = { total: 0, count: 0 };
      stats[index].total += cell;
      stats[index].count += 1;
    });
  });

  Object.keys(stats).forEach((key) => {
    stats[key].mean = stats[key].count === 0 ? 0 : stats[key].total / stats[key].count;
  });
  return stats;
}

function writeQualityResults(sheet, rows) {
  if (!sheet || rows.length === 0) return;
  sheet.getRange(6, 1, Math.max(sheet.getMaxRows() - 5, rows.length), 9).clearContent();
  sheet.getRange(6, 1, rows.length, rows[0].length).setValues(rows);
}

function updateOverallDataHealth_(sheet, rows) {
  if (!sheet) return;
  const totalRows = rows.length || 1;
  const healthyRows = rows.filter((row) => row[6] === 'OK').length;
  const warningRows = rows.filter((row) => row[6] === 'Warning').length;
  const overallHealth = Math.round(((healthyRows + warningRows * 0.5) / totalRows) * 100);

  sheet.getRange('A1:I1').breakApart().merge().setValue(`Overall Data Health : ${overallHealth}%`);
  sheet.getRange('A1:I1')
    .setBackground('#17324D')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}

function scanFormulaErrors_(ss) {
  const errors = [];
  ss.getSheets().forEach((sheet) => {
    const range = sheet.getDataRange();
    const displayValues = range.getDisplayValues();
    displayValues.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (typeof cell === 'string' && /^#(REF!|N\/A|VALUE!|DIV\/0!|NAME\?)$/.test(cell)) {
          errors.push(`${sheet.getName()}!${columnToLetter_(colIndex + 1)}${rowIndex + 1}: ${cell}`);
        }
      });
    });
  });
  return errors;
}

function buildMonthlyInsights_(kpiRows) {
  const byDelta = kpiRows
    .filter((row) => row[0] !== 'Funnel Stage')
    .map((row) => ({ name: row[1], delta: parseDisplayNumber_(row[4]), current: row[2], action: row[8] }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return byDelta.slice(0, 3).map((item, index) =>
    `${index + 1}. ${item.name} moved by ${item.delta} and now sits at ${item.current}. ${item.action}`
  );
}

function buildMonthlyRecommendations_(kpiRows) {
  const attentionRows = kpiRows.filter((row) => String(row[8]).indexOf('Action needed') !== -1).slice(0, 3);
  if (attentionRows.length === 0) {
    return [
      '1. Protect the strongest-performing channels.',
      '2. Keep testing creative variations while results are positive.',
      '3. Maintain weekly data quality checks to preserve reporting trust.',
    ];
  }
  return attentionRows.map((row, index) => `${index + 1}. Prioritize ${row[1]} because the dashboard flags: ${row[8]}.`);
}

function findKpiRow_(rows, kpiName) {
  return rows.find((row) => row[1] === kpiName);
}

function parseDisplayNumber_(value) {
  if (typeof value === 'number') return value;
  const normalized = String(value).replace(/[^0-9.\-]/g, '');
  return Number(normalized || 0);
}

function getOrCreateFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function columnToLetter_(column) {
  let temp = column;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

function applyPercentileFormatting_(sheet, startRow, endRow, startCol, endCol) {
  const existingRules = sheet.getConditionalFormatRules() || [];
  const newRules = [];

  for (let col = startCol; col <= endCol; col += 1) {
    const range = sheet.getRange(startRow, col, endRow - startRow + 1, 1);
    const colLetter = columnToLetter_(col);

    newRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=${colLetter}${startRow}>=PERCENTILE($${colLetter}$${startRow}:$${colLetter}$${endRow},0.8)`)
        .setBackground('#E8F5E9')
        .setFontColor('#2E7D32')
        .setRanges([range])
        .build()
    );

    newRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=${colLetter}${startRow}<=PERCENTILE($${colLetter}$${startRow}:$${colLetter}$${endRow},0.2)`)
        .setBackground('#FDECEC')
        .setFontColor('#C62828')
        .setRanges([range])
        .build()
    );
  }

  sheet.setConditionalFormatRules(existingRules.concat(newRules));
}

function ensureChart_(sheet, title, builder) {
  if (!sheet) return;
  const existing = sheet.getCharts().find((chart) => {
    const options = chart.getOptions();
    return options && options.get('title') === title;
  });
  if (existing) sheet.removeChart(existing);
  builder();
}

function createOrUpdateStartHereGuideSilently_(ss) {
  let sheet = ss.getSheetByName(HT_CONFIG.startSheet);
  if (!sheet) {
    sheet = ss.insertSheet(HT_CONFIG.startSheet, 0);
  }
  const currentTitle = sheet.getRange('A1').getDisplayValue();
  if (currentTitle !== 'HopeTrack International | Start Here') {
    createOrUpdateStartHereGuide();
  }
}

function writeSectionHeader_(sheet, rangeA1, value) {
  sheet.getRange(rangeA1).merge().setValue(value);
  sheet.getRange(rangeA1)
    .setBackground('#17324D')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('left');
}

function formatContentBox_(range) {
  range
    .setBackground('#FFFFFF')
    .setFontColor('#17324D')
    .setWrap(true)
    .setVerticalAlignment('top')
    .setBorder(true, true, true, true, true, true, '#E6EAEE', SpreadsheetApp.BorderStyle.SOLID);
}

function formatTwoColumnTable_(range, firstColColor) {
  range
    .setWrap(true)
    .setVerticalAlignment('top')
    .setBorder(true, true, true, true, true, true, '#E6EAEE', SpreadsheetApp.BorderStyle.SOLID);

  const rows = range.getNumRows();
  range.offset(0, 0, rows, 1)
    .setBackground(firstColColor)
    .setFontWeight('bold')
    .setFontColor('#17324D');
}

function setColumnWidths_(sheet, widths) {
  Object.keys(widths).forEach((col) => {
    sheet.setColumnWidth(Number(col), widths[col]);
  });
}

function formatValueForCard_(value, numberFormat) {
  if (numberFormat === '0.0%') {
    return `${(Number(value || 0) * 100).toFixed(1)}%`;
  }
  if (numberFormat === '$#,##0') {
    return `$${Math.round(Number(value || 0)).toLocaleString('en-US')}`;
  }
  return Math.round(Number(value || 0)).toLocaleString('en-US');
}
