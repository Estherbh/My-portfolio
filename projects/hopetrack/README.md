# HopeTrack Demo Site - GA4 Implementation & UTM Framework

## Project overview
HopeTrack International is a portfolio-ready fictional nonprofit experience built to demonstrate end-to-end campaign measurement. The project combines a premium static website, GA4 event tracking, donation journey instrumentation, and a stakeholder-friendly UTM framework in one GitHub Pages-ready package.

## Live demo link
`https://estherbh.github.io/hopetrack/`

## What this project demonstrates
- GA4 event tracking implementation across a four-page static site
- Custom conversion events for donation intent and form submission
- UTM naming convention design and non-technical documentation
- End-to-end campaign tracking setup for a fundraising initiative

## Pages included and their purpose
| Page | Purpose |
| --- | --- |
| `index.html` | Introduces the Education for All 2026 campaign, impact targets, and top-of-funnel CTAs |
| `about.html` | Explains the mission, fictional leadership team, organizational timeline, and mission CTA |
| `programs.html` | Showcases three flagship programs with progress bars and program-specific support CTAs |
| `donate.html` | Simulates a donation flow with amount selection, donor type selection, and tracked form submission |
| `utm-framework.html` | Documents UTM rules, examples, and includes a functional UTM builder |

## GA4 events implemented
| Page | Event | Trigger | Key parameters |
| --- | --- | --- | --- |
| `index.html` | `donate_cta_click` | Click on hero Donate Now CTA | `button_location`, `page` |
| `index.html` | `learn_more_click` | Click on hero Learn More CTA | `page` |
| `index.html` | `scroll_depth` | Scroll to 50% and 90% of page | `depth`, `page` |
| `about.html` | `join_mission_click` | Click on Join our mission CTA | `page` |
| `programs.html` | `support_program_click` | Click on Support This Program CTA | `program_name`, `page` |
| `donate.html` | `donation_amount_selected` | Click on a preset amount button | `amount`, `page` |
| `donate.html` | `donation_type_selected` | Click on one-time or monthly option | `type`, `page` |
| `donate.html` | `donation_form_submitted` | Submit donation form | `amount`, `type`, `page` |

## How to install your own GA4 ID
1. Create a GA4 property in Google Analytics.
2. Copy your Measurement ID, which looks like `G-XXXXXXXXXX`.
3. In every HTML file, find `G-XXXXXXXXXX`.
4. Replace it with your real Measurement ID.
5. Publish or refresh the site.

## UTM Framework link
`https://estherbh.github.io/hopetrack/utm-framework.html`

## Skills demonstrated
- Google Analytics 4
- JavaScript event tracking
- UTM parameter strategy
- Conversion tracking
- Campaign measurement framework
- Non-technical documentation

## File structure
```text
hopetrack/
├── index.html
├── about.html
├── programs.html
├── donate.html
├── utm-framework.html
└── README.md
```

## Deploy on GitHub Pages
1. Create a GitHub repository named `hopetrack` or any repository name you prefer.
2. Upload all files from this folder to the repository root.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select the `main` branch and the `/root` folder.
6. Save and wait for GitHub Pages to publish the site.
7. Your live URL will appear in the Pages settings panel.

## Verify events in GA4 DebugView
1. Open your published site in Chrome.
2. Enable GA4 DebugView using Google Tag Assistant or the GA debugger browser extension.
3. In GA4, open `Admin` -> `DebugView`.
4. Navigate through the site and trigger each CTA or form interaction.
5. Confirm that each expected event appears with the right parameters.
