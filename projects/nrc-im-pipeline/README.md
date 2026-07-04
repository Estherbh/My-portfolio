# NRC DRC - Education Program IM Pipeline
## KoboToolbox · DHIS2 · Power BI · Data Quality Framework

### Overview
This project package demonstrates an Information Management workflow for education monitoring in the Democratic Republic of the Congo. It combines a KoboToolbox XLSForm, a Data Quality Assurance workbook, and a Power BI reporting layer aligned to operational review needs rather than generic dashboarding. The design prioritizes field usability, validation discipline, RVR traceability, and fast escalation of records that should not move into donor reporting without verification.

### What this demonstrates
- XLSForm design with skip logic, constraints, cascading selects
- End-to-end IM pipeline design
- Data Quality Assurance methodology (NRC standards)
- RVR calculation and audit trail
- DHIS2 indicator framework design
- Power BI DAX measures for humanitarian reporting

### Files
| File | Description |
|------|-------------|
| `nrc_education_monitoring_v2_2026.xlsx` | KoboToolbox-ready XLSForm for education monitoring, including metadata, enrollment, teacher, protection, verification, and follow-up sections. |
| `nrc_dqa_template.xlsx` | Multi-sheet DQA workbook with dashboard, validation rules, RVR calculator, and audit log. |
| `kobo-dhis2-case-study.html` | HTML case study explaining the IM problem, pipeline, methodology, results, and field evidence. |
| `README.md` | Project documentation, setup instructions, and technical standards summary. |

### XLSForm - how to use
1. Download `nrc_education_monitoring_v2_2026.xlsx`.
2. Upload the file to KoboToolbox.
3. Deploy it as a web form or to KoboCollect / KoboToolbox mobile devices.
4. Confirm that the province and territory cascade works by selecting `Nord-Kivu` and checking that only the relevant territories appear.
5. Test the range and consistency rules using deliberately wrong values:
   - future visit date
   - invalid school code format
   - IDP values greater than enrolled values
   - follow-up required without follow-up action
6. Confirm that photo capture, GPS capture, device metadata, and required French error messages behave as expected before field rollout.

### DQA Template - how to use
1. Open `nrc_dqa_template.xlsx`.
2. Start on the `DQA_Dashboard` sheet to review overall health, critical issues, and average RVR.
3. Replace or extend the sample school records with the current monitoring period data.
4. Keep the formula columns intact:
   - `Missing_Rate`
   - `Completeness_Rate`
   - `Overall_Status`
   - `Priority_Action`
   - `Days_Since_Visit`
5. Use `Validation_Rules` as the control matrix for supervisor review, data cleaning, and refresher training.
6. Update the `RVR_Calculator` with reported versus verified values from source documents before any donor-facing submission.
7. Record every anomaly and follow-up action in `Audit_Log` so that corrections remain traceable across review cycles.

### DAX Measures - Power BI setup
1. Import the Kobo export table and the DQA validation table into Power BI.
2. Keep field names consistent with the XLSForm output to avoid remapping errors.
3. Create the measures shown in `kobo-dhis2-case-study.html`:
   - `Total Enrolled`
   - `IDP Enrollment Rate`
   - `Qualified Teacher Rate`
   - `Average RVR Score`
   - `Critical School Flag`
4. Build territory- and province-level visuals that separate reported values from verified values.
5. Use conditional formatting in tables or cards to highlight `Critical School Flag = "Immediate review"` before management review.

### Technical standards applied
- IASC Information Management standards
- NRC MEAL framework alignment
- Sphere humanitarian standards
- OCHA data responsibility guidelines

### Skills demonstrated
- KoboToolbox XLSForm architecture
- Cascading selects for administrative geography
- Constraint writing and field-facing validation messages in French
- Skip logic for humanitarian monitoring workflows
- Metadata capture and evidence capture design
- Indicator structuring for DHIS2-aligned reporting
- Data Quality Assurance dashboard design
- Formula-driven auditability in Excel
- Ratio de Vérification des Résultats methodology
- Audit trail and exception management
- Power BI DAX measure design for operational reporting
- Humanitarian education monitoring logic
- Cross-functional IM, MEAL, and supervision workflow design

### Suggested test scenarios
- Submit a record with `province = Nord-Kivu` and verify that `territoire` only shows Nord-Kivu options.
- Enter `school_code = NK12` and confirm the French format error appears.
- Enter a future date in `date_visit` and confirm the date constraint blocks submission.
- Enter `idp_boys > enrolled_boys` and confirm the record is rejected.
- In the DQA workbook, adjust `Missing_Values` or `Duplicates` to observe automatic changes in `Overall_Status` and `Priority_Action`.
- In the RVR sheet, replace a verified value to push a row from `Verified` to `Failed` and confirm the overall RVR warning changes.
