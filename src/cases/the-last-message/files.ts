import type { EvidenceItem } from "@/game/types";
import { veil } from "@/game/unlocks";

/**
 * `veil()` is base64, not cryptography. Its only job is to keep the answer out
 * of a plain-text search of the shipped bundle. The lock is a puzzle, not a
 * security boundary.
 */

export const files: EvidenceItem[] = [
  /* ------------------------------------------------ THE LOCKED SPREADSHEET */
  {
    id: "file-reconciliation",
    title: "KPG_Q3_reconciliation.xlsx",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-05T19:44",
    preview: "Protected workbook · created 5 March · 1 sheet, 1 comment",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya"],
    metadata: {
      Author: "M. Hart",
      Created: "05/03/2026 19:44",
      Modified: "13/03/2026 16:20",
      Protection: "Workbook open password (author-set)",
    },
    unlockRequirements: {
      password: {
        check: veil("ashcombe4b2019"),
        prompt: "This workbook is protected. Enter the open password.",
        ownerHint:
          "Password hint set by author: \"the usual one\"",
      },
    },
    content: {
      kind: "document",
      filename: "KPG_Q3_reconciliation.xlsx",
      format: "xlsx",
      size: "42 KB",
      blocks: [
        { type: "heading", text: "Sheet 1 — BW ACCOUNT" },
        {
          type: "table",
          columns: ["Invoice", "Date", "Description", "Net", "Approved by", "2nd sig"],
          rows: [
            ["BW-0041", "12/10/2024", "Site clearance, Marlow Wharf", "£14,200.00", "N. Reid", "—"],
            ["BW-0046", "28/11/2024", "Hoarding & site security", "£11,850.00", "N. Reid", "—"],
            ["BW-0052", "16/01/2025", "Groundworks, phase 1", "£22,400.00", "N. Reid", "—"],
            ["BW-0058", "04/03/2025", "Groundworks, phase 1 (rev)", "£22,400.00", "N. Reid", "—"],
            ["BW-0061", "19/04/2025", "Plant hire, 6 wks", "£9,750.00", "N. Reid", "—"],
            ["BW-0067", "30/06/2025", "Materials — aggregate", "£18,300.00", "N. Reid", "—"],
            ["BW-0071", "22/08/2025", "Materials — aggregate", "£18,300.00", "N. Reid", "—"],
            ["BW-0078", "11/10/2025", "Temporary works design", "£16,900.00", "N. Reid", "—"],
            ["BW-0083", "02/12/2025", "Site clearance, phase 2", "£14,200.00", "N. Reid", "—"],
            ["BW-0089", "21/01/2026", "Plant hire, 8 wks", "£13,000.00", "N. Reid", "—"],
            ["BW-0094", "09/02/2026", "Materials — aggregate", "£23,300.00", "N. Reid", "—"],
          ],
          footnote: "TOTAL NET: £184,600.00 — 11 invoices, October 2024 to February 2026",
        },
        {
          type: "kv",
          rows: [
            { k: "Supplier", v: "Brightwater Contracting Ltd" },
            { k: "Registered office", v: "12 Ashfield Terrace, Dunmore DN4 2RG" },
            {
              k: "Correspondence / delivery address on invoices",
              v: "Unit 14, Brightwater Self-Storage, Dunmore Industrial Estate, DN4 8PY",
            },
            { k: "VAT number", v: "none provided on any invoice" },
            { k: "Company number", v: "14882073 — incorporated 04/09/2024" },
          ],
        },
        {
          type: "note",
          author: "M. Hart, 13/03 16:20",
          text:
            "Every single one approved by NR alone. The two-signature rule applies over £10k with no exceptions and there are eleven of these. BW-0052 and BW-0058 are the same job billed twice, three weeks apart, to the penny. Same with 0067/0071. Same with 0041/0083.\n\nThe thing I keep coming back to is the delivery address. A groundworks contractor that supposedly moved twenty-two thousand pounds of aggregate has its delivery address at a self-storage unit. You cannot take a tipper lorry to Unit 14. There is no yard. There is no plant. There is nothing there but a roller shutter.\n\nI drove out on Thursday to see it for myself and I wish I hadn't, because now I know.\n\nPriya, Monday, 9am, hard copies only. Do not email this.",
        },
      ],
    },
  },

  /* --------------------------------------------------- police preliminary */
  {
    id: "file-police-note",
    title: "MISPER_prelim_note.pdf",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-17T14:05",
    preview: "Preliminary investigator's note · statements and recovery",
    tags: ["investigation"],
    relatedPeople: ["maya", "liam", "zoe", "noah", "erin"],
    metadata: {
      Origin: "Provided with device images",
      Ref: "MP/26/0431",
      Classification: "Working note — not disclosed",
    },
    content: {
      kind: "document",
      filename: "MISPER_prelim_note.pdf",
      format: "pdf",
      size: "212 KB",
      blocks: [
        { type: "heading", text: "MISSING PERSON — PRELIMINARY NOTE" },
        {
          type: "kv",
          rows: [
            { k: "Subject", v: "HART, Maya Louise — DOB 08/07/2001" },
            { k: "Last confirmed", v: "14/03/2026 23:52, 38 Calder Row" },
            { k: "Reported", v: "15/03/2026 21:40 by Z. BENNETT" },
            { k: "Risk", v: "HIGH" },
          ],
        },
        { type: "heading", text: "1. RECOVERY" },
        {
          type: "para",
          text:
            "16/03 at approx. 07:35 a member of the public walking a dog located a green wool jacket and a mobile handset on the towpath below Sefton Bridge, approx. 1.4 miles from Calder Row. Both items confirmed as the subject's.",
        },
        {
          type: "para",
          text:
            "Items were lying together, above the waterline, on the paved section of the towpath. Neither item was wet through despite continuous rainfall between 22:00 on 14/03 and approx. 04:00 on 15/03. Jacket showed no tearing and no water immersion. Handset was undamaged and had not been submerged.",
        },
        {
          type: "note",
          author: "DC R. Ellery",
          text:
            "The condition of these items is not consistent with them having lain on an open towpath through that night's rainfall. My working view is that they were placed there some time after the rain stopped, or were kept dry until shortly before they were placed. Underwater search of this stretch has found nothing.",
        },
        { type: "heading", text: "2. STATEMENTS — SUMMARY" },
        {
          type: "table",
          columns: ["Person", "Account given", "Corroborated?"],
          rows: [
            [
              "CROSS, Liam",
              "Was on Calder Row but did not enter. Home by 23:30.",
              "Partial — seen on street 23:20. Home time unverified.",
            ],
            [
              "BENNETT, Zoe",
              "In the kitchen the whole evening. Did not leave the flat.",
              "No. Two guests do not recall seeing her between approx. 23:00 and 23:45.",
            ],
            [
              "REID, Noah",
              "Arrived approx. 21:50, one drink, left approx. 22:40, drove straight home.",
              "No. No guest recalls his arrival or departure.",
            ],
            [
              "VALE, Erin",
              "Approx. 15 guests. Party wound down approx. 00:30. Maya left alone before that.",
              "Partial. Guest list stated to be unavailable.",
            ],
            [
              "NOLAN, Tara",
              "Outside at rear approx. 23:45. Heard an argument between the subject and an unidentified male.",
              "Consistent with subject's handset messages.",
            ],
          ],
          footnote:
            "Note: no witness has been found who saw REID either arrive or leave. His account of both times rests entirely on his own word.",
        },
        { type: "heading", text: "3. IMMEDIATE LINES" },
        {
          type: "para",
          text:
            "(a) CROSS — history of persistent contact, present at scene. (b) Voluntary departure — subject had recently withdrawn cash and searched one-way flights. (c) Water — the recovery location invites it, but see the note at 1 above.",
        },
        {
          type: "para",
          text:
            "Vehicle enquiries outstanding. ANPR request submitted for the Calder Row / Sefton Bridge corridor 23:00–02:00. Staff vehicle registrations requested from Kestrel Property Group and not yet returned.",
        },
      ],
    },
  },

  /* --------------------------------------------------------- doorbell still */
  {
    id: "file-doorbell",
    title: "doorbell_2352_still.png",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-14T23:52",
    preview: "Camera still, 38 Calder Row — the last confirmed sighting",
    tags: ["party", "investigation"],
    relatedPeople: ["maya"],
    location: "38 Calder Row",
    metadata: {
      Device: "Doorbell camera, 38 Calder Row",
      Captured: "14/03/2026 23:52:11",
      Conditions: "Heavy rain",
    },
    content: {
      kind: "document",
      filename: "doorbell_2352_still.png",
      format: "png",
      size: "1.1 MB",
      blocks: [
        { type: "heading", text: "CAMERA STILL — 23:52:11" },
        {
          type: "para",
          text:
            "Subject exits the front door of 38 Calder Row alone. She is wearing the green wool jacket later recovered at Sefton Bridge. She pauses on the step, looks left along the row, then turns right toward Marlow Street.",
        },
        {
          type: "para",
          text:
            "Rainfall is heavy and constant across the whole clip. No other person is in frame. No vehicle is in frame at this angle — the camera covers the doorway and approximately three metres of pavement only.",
        },
        {
          type: "kv",
          rows: [
            { k: "Duration held", v: "11 seconds" },
            { k: "Direction of travel", v: "Right — toward Marlow Street" },
            { k: "Accompanied", v: "No" },
            { k: "Next motion event", v: "15/03 02:11 — fox" },
          ],
        },
        {
          type: "note",
          author: "DC R. Ellery",
          text:
            "This is the last confirmed sighting of Maya Hart. Everything after this point is inference.",
        },
      ],
    },
  },

  /* ------------------------------------------------- the misleading document */
  {
    id: "file-bank",
    title: "bank_statement_extract.pdf",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-16T16:40",
    preview: "Account extract, 24 Feb – 14 Mar · one transaction highlighted",
    tags: ["personal", "finance"],
    relatedPeople: ["maya", "liam"],
    metadata: {
      Account: "Personal current account, ****4471",
      Period: "24/02/2026 – 14/03/2026",
      Annotation: "Highlighting present in source document",
    },
    content: {
      kind: "document",
      filename: "bank_statement_extract.pdf",
      format: "pdf",
      size: "96 KB",
      blocks: [
        { type: "heading", text: "ACCOUNT EXTRACT — HART M L — ****4471" },
        {
          type: "table",
          columns: ["Date", "Description", "Out", "In", "Balance"],
          rows: [
            ["24/02", "IRONWORKS FITNESS", "£28.50", "", "£3,914.22"],
            ["26/02", "SALARY KESTREL PROPERTY GRP", "", "£2,088.60", "£6,002.82"],
            ["28/02", "TESCO EXPRESS MARLOW ST", "£31.40", "", "£5,971.42"],
            ["02/03", "FASTER PAYMENT — L CROSS", "£2,000.00", "", "£3,971.42"],
            ["04/03", "NORTHERN RAIL", "£18.20", "", "£3,953.22"],
            ["07/03", "THE ROOKERY (BAR)", "£42.00", "", "£3,911.22"],
            ["11/03", "CASH WITHDRAWAL — BRANCH", "£600.00", "", "£3,311.22"],
            ["12/03", "SHELL DUNMORE RD", "£46.10", "", "£3,265.12"],
            ["13/03", "PRET MARLOW ST", "£9.80", "", "£3,255.32"],
            ["14/03", "ODDBINS CALDER ST", "£24.00", "", "£3,231.32"],
          ],
          footnote:
            "Two transactions marked in the source document: the £2,000 payment to L CROSS on 02/03, and the £600 branch withdrawal on 11/03.",
        },
        {
          type: "note",
          author: "Annotation in source document — author unrecorded",
          text:
            "£2,000 to the ex-partner twelve days before she disappears, then £600 in cash three days before. Payments to CROSS should be treated as a live line of enquiry — possible coercion or ongoing financial pressure. Recommend early interview.",
        },
        {
          type: "para",
          text:
            "Note: this annotation was added by an unidentified reviewer and is not evidenced elsewhere in the file. The purpose of neither transaction has been established from banking records alone.",
        },
      ],
    },
  },

  /* --------------------------------------------------------------- to-do -- */
  {
    id: "file-todo",
    title: "todo_march.txt",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-13T07:12",
    preview: "Plain text · last modified the morning before the party",
    tags: ["personal", "routine"],
    relatedPeople: ["maya"],
    metadata: {
      Modified: "13/03/2026 07:12",
      Encoding: "UTF-8",
      Lines: "12",
    },
    content: {
      kind: "document",
      filename: "todo_march.txt",
      format: "txt",
      size: "384 B",
      blocks: [
        {
          type: "mono",
          text: `- ring mum back (she has rung four times)
- renew passport, the form is on the side
- cups for erin (FOUR cups, erin)
- PRINT BW INVOICES. HARD COPIES ONLY. do not email these to anyone
- take the printed set to priya monday, do not leave them in the flat
- do not put any of it on the work drive
- ashgrove viewing thurs 19th, 5.30
- ask marchmont about a 6 month
- tell zoe about the flat before erin finds out
- book dentist
- stop checking if the front door is locked, it is locked
- if this goes badly on monday, start looking. lisbon? anywhere.`,
        },
      ],
    },
  },

  /* ------------------------------------------------------------ payslip -- */
  {
    id: "file-payslip",
    title: "payslip_feb2026.pdf",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-02-26T00:00",
    preview: "Kestrel Property Group · February 2026",
    tags: ["workplace", "routine"],
    relatedPeople: ["maya"],
    metadata: { Employer: "Kestrel Property Group", Period: "February 2026" },
    content: {
      kind: "document",
      filename: "payslip_feb2026.pdf",
      format: "pdf",
      size: "58 KB",
      blocks: [
        { type: "heading", text: "KESTREL PROPERTY GROUP — PAYSLIP" },
        {
          type: "kv",
          rows: [
            { k: "Employee", v: "M L HART" },
            { k: "Job title", v: "Finance Analyst (Junior)" },
            { k: "Start date", v: "14/04/2025" },
            { k: "Annual salary", v: "£31,400.00" },
            { k: "Gross this period", v: "£2,616.67" },
            { k: "Net this period", v: "£2,088.60" },
          ],
        },
        {
          type: "para",
          text:
            "Approval authority: Level 1. Payments above £10,000 require a second authorised signature (Level 3 or above). Reference: Financial Controls Policy s.4.2.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------- party flyer -- */
  {
    id: "file-invite-image",
    title: "calder_row_saturday.png",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-09T19:05",
    preview: "Downloaded image · Erin's invitation card",
    tags: ["personal", "party"],
    relatedPeople: ["erin", "maya", "zoe"],
    location: "38 Calder Row",
    content: {
      kind: "document",
      filename: "calder_row_saturday.png",
      format: "png",
      size: "640 KB",
      blocks: [
        { type: "heading", text: "SATURDAY · 14 MARCH · FROM 8" },
        {
          type: "mono",
          text: `        38 CALDER ROW — THE BLUE DOOR
        buzzer is broken, hammer on it

        bring: a drink, a cup, yourself
        do not bring: work talk, your ex,
                      anyone i haven't met

                    — E xx`,
        },
        {
          type: "para",
          text:
            "Image saved to the laptop from an email attachment on 09/03 at 19:05.",
        },
      ],
    },
  },

  /* ----------------------------------- LOCATION-GATED: unlocked by the file */
  {
    id: "file-map-dunmore",
    title: "dunmore_estate.png",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-11T12:58",
    preview: "Saved map screenshot · Dunmore Industrial Estate",
    tags: ["investigation"],
    relatedPeople: ["maya"],
    location: "Dunmore Industrial Estate",
    unlockRequirements: { requiresDiscovered: ["file-reconciliation"] },
    metadata: {
      Source: "Saved from browser, 11/03 12:58",
      Note: "Saved to a folder named 'BW'",
    },
    content: {
      kind: "document",
      filename: "dunmore_estate.png",
      format: "png",
      size: "820 KB",
      blocks: [
        {
          type: "map",
          caption:
            "Screenshot saved from a mapping site. The pin at Unit 14 was dropped manually and named by the user.",
          pins: [
            { x: 26, y: 62, label: "Dunmore Rd", tone: "neutral" },
            { x: 48, y: 40, label: "Brightwater Self-Storage", tone: "neutral" },
            { x: 52, y: 34, label: "UNIT 14 ← this one", tone: "amber" },
            { x: 74, y: 70, label: "12 Ashfield Terr.", tone: "neutral" },
            { x: 16, y: 22, label: "A-road, 9 min to Sefton Br.", tone: "neutral" },
          ],
        },
        {
          type: "kv",
          rows: [
            { k: "Unit 14 — occupier", v: "Brightwater Contracting Ltd (since 09/2024)" },
            { k: "Unit size", v: "Roller shutter, 4.6m × 3.0m — no yard, no vehicle access" },
            { k: "Site access", v: "24hr, keypad, no on-site staff after 18:00" },
            { k: "CCTV", v: "Gate only. Cameras do not cover individual units." },
            { k: "Calder Row to this site", v: "14 minutes by road" },
            { k: "This site to Sefton Bridge", v: "9 minutes by road" },
          ],
        },
        {
          type: "note",
          author: "M. Hart, file properties comment",
          text:
            "12 Ashfield Terrace is a terraced house. It is the registered office. It is four streets from the storage unit. Both of them are in Dunmore and neither of them is a construction company.",
        },
      ],
    },
  },

  /* ----------------------------------- LOCATION-GATED: cell site analysis -- */
  {
    id: "file-cellsite",
    title: "cell_site_prelim.pdf",
    type: "document",
    sourceApp: "files",
    timestamp: "2026-03-18T11:30",
    preview: "Preliminary cell site analysis · handset 07700 900118",
    tags: ["investigation"],
    relatedPeople: ["maya"],
    unlockRequirements: { requiresDiscovered: ["file-reconciliation"] },
    metadata: {
      Ref: "CSA/26/0431/1",
      Subject: "07700 900118 (HART)",
      Status: "Preliminary — not yet served in evidence",
    },
    content: {
      kind: "document",
      filename: "cell_site_prelim.pdf",
      format: "pdf",
      size: "340 KB",
      blocks: [
        { type: "heading", text: "PRELIMINARY CELL SITE ANALYSIS" },
        {
          type: "para",
          text:
            "Network registration records for handset 07700 900118 covering 14/03/2026 22:00 to 15/03/2026 06:00. Mast identifiers indicate the cell the handset was registered to, not a precise position.",
        },
        {
          type: "table",
          columns: ["Time", "Mast", "Serving area", "Event"],
          rows: [
            ["23:40", "CAL-02", "Calder Row / Marlow St", "Registered"],
            ["23:52", "CAL-02", "Calder Row / Marlow St", "Registered"],
            ["00:03", "CAL-02", "Calder Row / Marlow St", "Voice, inbound"],
            ["00:11", "CAL-02", "Calder Row / Marlow St", "Voice, outbound"],
            ["00:22", "MRW-07", "Marlow St / ring road east", "Voice, inbound"],
            ["00:31", "RNG-11", "Ring road east / A-road", "Handover"],
            ["00:38", "DUN-04", "Dunmore Industrial Estate", "Handover"],
            ["00:47", "DUN-04", "Dunmore Industrial Estate", "SMS, outbound"],
            ["01:12", "DUN-04", "Dunmore Industrial Estate", "Registered"],
            ["01:29", "RNG-11", "Ring road east / A-road", "Handover"],
            ["01:41", "SEF-01", "Sefton Bridge / canal", "Registered"],
            ["01:44", "SEF-01", "Sefton Bridge / canal", "Last registration"],
          ],
          footnote:
            "No further registration after 01:44. The handset was recovered at Sefton Bridge at 07:35 on 16/03.",
        },
        {
          type: "note",
          author: "Analyst note",
          text:
            "Two observations for the file.\n\nFirst: the handset does not travel toward the subject's home address at any point. It leaves the Calder Row cell heading east and is on the Dunmore Industrial Estate cell within 16 minutes. The subject's home address is west.\n\nSecond: the outbound SMS at 00:47, which reads as a message from someone walking home, was sent from the Dunmore Industrial Estate cell. It was not sent from anywhere on a route home. The handset remains on that cell for a further 25 minutes after the message is sent, then travels to Sefton Bridge, registers for three minutes and is never seen again.\n\nThis pattern is consistent with the handset being carried by a vehicle, and with the final location being chosen rather than reached.",
        },
      ],
    },
  },
];
