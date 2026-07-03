# HopeTrack Looker Studio Dashboard Build Guide

## Purpose

This guide explains how to build a polished Looker Studio dashboard from the HopeTrack Google Sheets source for a portfolio-ready **Data & Analytics Specialist** project.

Source Google Sheet:

- [HopeTrack Google Sheet](https://docs.google.com/spreadsheets/d/1yRjlZdXVFjySUQVqpP2nDmzuz1Gtw4lxJ_zyzdFmxhA/edit?usp=sharing)

Dashboard objective:

- transform multi-tab Google Sheets reporting into a premium stakeholder-facing dashboard
- tell the story of the **Education for All 2026** campaign in Q1 2026
- make performance understandable for non-technical teams at a glance

## 1. Create The Report

1. Open [Looker Studio](https://lookerstudio.google.com/).
2. Click `Create` > `Report`.
3. Choose `Google Sheets` as the connector.
4. Select the spreadsheet `HopeTrack Unified Marketing Reporting Template`.
5. Add these tabs as separate data sources:
   - `KPI_Dashboard`
   - `RAW_Social`
   - `RAW_Web`
   - `RAW_Email`
   - `RAW_CRM`
   - `Channel_Comparison`
   - `Monthly_Report`
6. Name the report:
   - `HopeTrack International - Q1 2026 Campaign Performance Dashboard`

## 2. Connect And Clean The Data Sources

For each source:

1. Confirm the first row is used as headers.
2. Confirm date fields are typed as `Date`.
3. Confirm numeric fields are typed as `Number`, `Percent`, or `Currency`.
4. Rename awkward fields into cleaner business names where needed.
5. Disable any unused columns that would clutter the field list.

Recommended field checks:

- `RAW_Social`
  - `Date` as Date
  - `Impressions`, `Reach`, `Clicks`, `Engagements`, `Followers_Gained`, `Spend_USD` as Number
- `RAW_Web`
  - `Date` as Date
  - `Sessions`, `Users`, `Goal_Completions` as Number
  - `Bounce_Rate`, `Conversion_Rate` as Percent
- `RAW_Email`
  - `Date` as Date
  - `Sent`, `Delivered`, `Opens`, `Clicks`, `Unsubscribes` as Number
  - `Open_Rate`, `Click_Rate` as Percent
  - `Donations_Generated` as Currency
- `RAW_CRM`
  - `Date` as Date
  - `Donation_Amount_USD` as Currency
- `KPI_Dashboard`
  - `Current Month`, `Previous Month`, `Delta`, `Target / Context` as Number or Currency depending on metric

## 3. Create Helpful Calculated Fields

Create these calculated fields inside the relevant sources.

### RAW_Social

- `Engagement Rate`
```text
SUM(Engagements) / SUM(Reach)
```

- `Cost per Click`
```text
SUM(Spend_USD) / SUM(Clicks)
```

- `Month Label`
```text
FORMAT_DATE("%b %Y", Date)
```

### RAW_Web

- `Month Label`
```text
FORMAT_DATE("%b %Y", Date)
```

- `Donation Funnel Step`
Use raw metrics for sessions and goal completions rather than a literal field if easier in chart setup.

### RAW_Email

- `Month Label`
```text
FORMAT_DATE("%b %Y", Date)
```

### RAW_CRM

- `Month Label`
```text
FORMAT_DATE("%b %Y", Date)
```

- `Total Donors`
```text
COUNT(Donor_ID)
```

- `Avg Donation`
```text
SUM(Donation_Amount_USD) / COUNT(Donor_ID)
```

## 4. Apply Theme And Layout

In `Theme and Layout`, use:

- Primary: `#1a5f7a`
- Secondary: `#22a6b3`
- Positive: `#4CAF50`
- Warning: `#FF9800`
- Negative: `#F44336`
- Background: `#FFFFFF`
- Text: `#2d3436`
- Grid and borders: `#f1f2f6`

Recommended style:

- page background white
- use rectangular panels with subtle gray borders
- keep 16px spacing between objects
- headers bold and clean
- KPI cards with strong fill color and white or dark text depending on contrast

Typography guidance:

- Page titles: 22 to 24px bold
- Section titles: 16 to 18px semibold
- Chart labels: 12 to 13px
- KPI values: 28 to 36px bold

## 5. Page 1 - Executive Overview

Page title:

- `HopeTrack International - Q1 2026 Campaign Overview`

Date range:

- January 1, 2026 to March 31, 2026

### 5.1 Header Bar

Add a full-width rectangle:

- fill color `#1a5f7a`
- no border

Add text boxes:

- `HopeTrack International`
- `Education for All 2026 - Q1 Performance Dashboard`
- `Date range: Jan 2026 - Mar 2026`
- `Last updated: ` plus report freshness text

Use white text on the teal background.

### 5.2 KPI Scorecards

Use four scorecards across the top row. Connect them either to `KPI_Dashboard` or to blended/clean source metrics if easier.

Scorecard 1:

- Label: `AWARENESS`
- Metric: `Total Impressions`
- Expected value: `211,300`
- Comparison: previous period
- Fill: `#2196F3`

Scorecard 2:

- Label: `ENGAGEMENT`
- Metric: `Engagement Rate`
- Expected value: `6.3%`
- Comparison: previous period
- Fill: `#4CAF50`

Scorecard 3:

- Label: `CONSIDERATION`
- Metric: `Click-Through Rate`
- Expected value: `2.8%`
- Comparison: previous period
- Fill: `#FF9800`

Scorecard 4:

- Label: `CONVERSION`
- Metric: `Total Donations`
- Expected value: `$1,441`
- Comparison: previous period
- Fill: `#F44336`

Scorecard settings:

- comparison calculation: previous period
- show arrow indicators
- keep one metric per card
- hide extra clutter

### 5.3 Funnel Visualization

Chart type:

- `Bar chart` or `Stepped bar` if a true funnel is not available in your Looker Studio setup

Build a small helper table manually if needed with:

- Awareness: 211300
- Engagement: 13312
- Consideration: 5916
- Conversion: 49

Title:

- `Marketing Funnel - Education for All 2026`

Style:

- stage labels visible
- value labels visible
- use gradient-like progression from blue to green

### 5.4 Monthly Donations vs Target

Chart type:

- `Combo chart`

Source:

- `KPI_Dashboard` helper monthly values if available
- or `RAW_CRM` aggregated by month

Dimension:

- `Month Label`

Metrics:

- `SUM(Donation_Amount_USD)` as bars
- a constant target field for line

Calculated target field:
```text
1667
```

Title:

- `Monthly Donations vs Target`

Style:

- bars in `#009688`
- line in `#F44336`
- show data labels
- add text annotation:
  - `Q1 Total : $4,483 / $50,000 target`

### 5.5 Channel Performance Comparison

Chart type:

- `Grouped bar chart`

Preferred source:

- `Channel_Comparison`

Dimension:

- `Channel`

Metrics:

- `Impressions` or equivalent channel volume
- `Engagement Rate`
- `Conversion Contribution`

Title:

- `Channel Performance Comparison - Q1 2026`

Style:

- distinct color per channel
- light gridlines
- legend visible

### 5.6 Social Impressions Trend

Chart type:

- `Time series`

Source:

- `RAW_Social`

Dimension:

- `Date`

Breakdown dimension:

- `Platform`

Metric:

- `SUM(Impressions)`

Title:

- `Social Impressions Trend by Platform`

Style:

- show points
- show line labels if possible
- gridlines on

## 6. Page 2 - Channel Deep Dive

Page title:

- `Channel Analysis - Education for All 2026`

At the top add:

- a `Date range control`
- a `Dropdown filter` for channel or platform

### 6.1 Social Media Performance

Table:

- Source: `RAW_Social`
- Dimension: `Platform`
- Metrics:
  - `SUM(Impressions)`
  - `SUM(Reach)`
  - `SUM(Clicks)`
  - `Engagement Rate`
  - `SUM(Followers_Gained)`
  - `SUM(Spend_USD)`
  - `Cost per Click`

Bar chart:

- Dimension: `Month Label`
- Breakdown: `Platform`
- Metric: `SUM(Impressions)`

Optional scorecards:

- `Total Social Impressions`
- `Total Reach`
- `Total Clicks`

### 6.2 Web Analytics

Scorecards:

- `SUM(Sessions)`
- `SUM(Users)`
- `AVG(Bounce_Rate)`
- `AVG(Conversion_Rate)`

Line chart:

- Dimension: `Date`
- Metric: `SUM(Sessions)`

Bar chart:

- Dimension: `Page`
- Metric: `SUM(Sessions)`
- sort descending

Simple funnel substitute:

- use bar chart with:
  - sessions
  - goal completions
  - CRM donations count if using a blended narrative

### 6.3 Email Performance

Scorecards:

- `SUM(Sent)`
- `AVG(Open_Rate)`
- `AVG(Click_Rate)`
- `SUM(Donations_Generated)`

Line chart:

- Dimension: `Campaign_Name`
- Metric: `AVG(Open_Rate)`

Bar chart:

- Dimension: `Campaign_Name`
- Metric: `SUM(Donations_Generated)`

Table:

- Dimension: `Campaign_Name`
- Metrics:
  - `SUM(Sent)`
  - `AVG(Open_Rate)`
  - `AVG(Click_Rate)`
  - `SUM(Donations_Generated)`

### 6.4 CRM / Donor Journey

Scorecards:

- `COUNT(Donor_ID)` as `Total Donors`
- count filtered `member` as `New Members`
- `Avg Donation`
- top acquisition channel using a table or scorecard substitute

Pie chart:

- Dimension: `Donor_Type`
- Metric: `COUNT(Donor_ID)`

Bar chart:

- Dimension: `Acquisition_Channel`
- Metric: `SUM(Donation_Amount_USD)`

Table:

- Dimension: `Country`
- Metrics:
  - `COUNT(Donor_ID)`
  - `SUM(Donation_Amount_USD)`

## 7. Page 3 - Insights And Recommendations

Page title:

- `Key Insights - Q1 2026`

This page is mostly editorial, so use:

- text boxes
- colored rectangles
- one large health score card

### 7.1 What's Working

Create three green cards with these texts:

1. `Awareness is growing - Impressions up 14% vs February`
2. `Email engagement strong - 34% open rate above 32% benchmark`
3. `Click-through improving - CTR up 0.3% month over month`

### 7.2 What Needs Attention

Create three orange or red cards:

1. `Conversion is behind target - $1,441 vs $1,667 monthly goal`
2. `One-time donors declining - 8 in March vs 9 in February`
3. `Pages per session flat - audience not exploring beyond landing page`

### 7.3 Recommended Actions

Create three blue cards:

1. `Optimize donation page - reduce friction at checkout step`
2. `Launch retargeting campaign - reactivate engaged non-converters`
3. `Test long-form content - increase pages per session and time on site`

### 7.4 Overall Health Score

Large centered scorecard or text block:

- `Campaign Health Score : 50/100`
- `7 of 14 KPIs on track`
- `Priority focus : Conversion optimization`

Style:

- orange background
- large bold typography
- centered alignment

## 8. Filters And Date Controls

On Page 2:

1. Insert `Date range control`
2. Set default range:
   - January 1, 2026 to March 31, 2026
3. Insert a `Dropdown list`
4. Use one of:
   - `Platform`
   - `Acquisition_Channel`
   - `Campaign_Name`

Tips:

- use one filter per section if one global filter becomes confusing
- keep controls aligned in a single top row

## 9. Publishing And Sharing

To create a portfolio link:

1. Click `Share`
2. Open `Manage access`
3. Set report access to:
   - `Anyone with the link can view`
4. If data source credentials block access:
   - set data source credentials to `Owner's credentials`
5. Copy the share URL
6. Test the link in an incognito browser window

Recommended public settings:

- report: view only
- no edit permissions
- owner credentials enabled
- optional download disabled if you want a cleaner recruiter-facing experience

## 10. Portfolio README Update Guidance

Add a new section in the portfolio README that explains:

- this workbook is the source layer
- the Looker Studio report is the executive visualization layer
- the project shows both operational reporting and stakeholder storytelling

Suggested wording:

`This project was also extended into a Looker Studio dashboard to demonstrate how the same Google Sheets reporting base can be transformed into an executive-facing analytics product for non-technical stakeholders.`

## 11. Final QA Checklist

Before sharing:

- all page titles are consistent
- all charts have titles
- all scorecards have correct date range
- currency fields display as USD
- percent fields display correctly
- filters work without breaking sections
- public link works in incognito
- spacing and alignment look intentional
- page 3 tells a clear story without jargon

## 12. Recommended Portfolio Positioning

When presenting this project, describe it as:

- a multi-layer reporting solution
- Google Sheets for source consolidation and QA
- Apps Script for workflow automation
- Looker Studio for executive visualization
- a realistic bridge between tactical reporting and BI maturity
