# Order Tracker

A calm, editorial-style desktop web application for daily order tracking, assignment, and after-sales follow-up.

Built for operational teams that need clarity, speed, and full visibility across Tracking, Planning, and Aftersales.

---

## Goals

- Turn a daily Excel export into a live, collaborative tracking board in seconds
- Assign orders to Trackers fairly while keeping the same Team Code together
- Give every role (Admin, Tracking, Planning, Aftersales, Public) exactly the view and permissions they need
- Maintain a clean history of every order with powerful search
- Keep the interface calm, paper-like, and distraction-free (no dark dashboards, no neon SaaS)

---

## Core Functions

### 1. Daily Upload & Assignment
- Admin uploads a cleaned Excel file every morning
- System performs a **full replace** of the current day’s orders
- Automatic assignment of Trackers with two rules:
  - Orders with the same `Team Code` always go to the same Tracker
  - Overall load is kept roughly even across available Trackers
- Admin can manually re-assign any order at any time

### 2. Status Workflow
Every order starts as **Delivery In Progress** and can move through:

| Status                  | Meaning                                      | Rootcause required |
|-------------------------|----------------------------------------------|--------------------|
| Delivery In Progress    | Default after upload                         | No                 |
| Not Loaded              | Early logistics / preparation problem        | No                 |
| Assembly In Progress    | Team confirmed on-site assembling            | No                 |
| Not Done                | Final failure to fulfil the order            | **Yes**            |
| Job Done                | Service completed successfully               | No                 |
| Posted                  | Closed in system (terminal)                  | No                 |
| Cancelled               | Cancelled midway (terminal)                  | No                 |

### 3. Solving Owner & Pending Routing
- Only **Admin** and **Tracking** can set/change `SolvingOwner`
- Possible values: `Planning` | `A/S` | `Planning & A/S`
- At midnight, all non-terminal orders move into the **Pending** tab and are automatically routed:
  - `Planning` → Planning sub-page only
  - `A/S` → Aftersales sub-page only
  - `Planning & A/S` → both sub-pages

### 4. Roles & Access

| Role        | Main Access                          | Edit Rights                              |
|-------------|--------------------------------------|------------------------------------------|
| Admin       | Everything + Config + Upload         | Full                                     |
| Tracking    | Tracking + Pending                   | Status, Comment, Rootcause, SolvingOwner |
| Planning    | Pending (Planning sub-page)          | View + limited actions (to be refined)   |
| Aftersales  | Pending (Aftersales sub-page)        | To be defined later                      |
| Public      | Archive search only                  | View only                                |

### 5. Archive
- Every night the current day is snapshotted into Archive
- Public and all internal users can search by Order Code, Customer Name, Phone, or any other column
- Fast, efficient storage designed for long-term history

### 6. Real-time Collaboration
- Built for ~10 concurrent users
- Changes appear live for everyone (Supabase Realtime)
- Phone numbers are clickable and open WhatsApp

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom editorial design system
- **Backend / Database / Auth / Realtime**: Supabase
- **Excel parsing**: exceljs
- **Hosting**: Vercel
- **Repository**: GitHub

---

## Design System (Editorial / Paper Desk)

- Background: `#FFFEF9` (ivory)
- Cards: `#FFFFFF`
- Muted surfaces: `#F7F5F0` / `#F0EDE6`
- Borders: `#E8E4DB` → `#D4CFC4`
- Text: `#1A1917` (ink)
- Secondary text: `#4A4741` / `#8A857A`
- Accent buttons: ink on ivory
- Success / Warning / Danger: muted green / amber / red
- Typography:
  - Body: IBM Plex Sans
  - Titles: Lora
  - Mono (IDs): system mono
- Radius: 6 / 10 / 16 px
- Soft low shadows + light fade-in animations

---

## Project Structure

```text
order-tracker/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── tracking/
│   │   ├── pending/
│   │   │   ├── planning/
│   │   │   └── aftersales/
│   │   ├── archive/
│   │   ├── admin/
│   │   │   ├── upload/
│   │   │   ├── trackers/
│   │   │   ├── config/
│   │   │   └── users/
│   │   └── reporting/          # future
│   └── api/
│       ├── upload/
│       ├── assign/
│       └── midnight/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── orders/
│   ├── admin/
│   └── archive/
├── lib/
│   ├── supabase/
│   ├── constants.ts
│   ├── assignment.ts
│   ├── excel.ts
│   ├── permissions.ts
│   └── utils.ts
├── types/
├── hooks/
├── supabase/migrations/
└── ...

Current Status

Product definition: Locked
Status flow, roles, SolvingOwner routing, tabs, and midnight behaviour: Agreed
Next step: Implementation (foundation → auth → UI → core pages)


Roadmap (High Level)

Foundation (types, constants, database schema, RLS)
Authentication & role-based access
Design system & core UI components
Tracking page + Order table
Pending tab with Planning / Aftersales sub-pages
Admin: Excel upload + automatic assignment engine
Archive search
Midnight cron job
Reporting (later)
