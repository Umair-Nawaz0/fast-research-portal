# FAST University Research Opportunity Portal — Frontend

A modern, responsive, and university-grade frontend application developed for the **FAST-NUCES Computer Networks Assignment**.

This portal connects undergraduate and graduate students directly with faculty-led research projects, laboratory assistantships, and Final Year Project (FYP) opportunities in Computer Networks, Distributed Systems, Cybersecurity, and AI.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components & Icons**: Radix UI primitives, [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast system
- **State & Persistence**: React Context + `localStorage` with FAST sample dataset

---

## ✨ Features

### 1. Polished Academic Dashboard
- University-themed interface with FAST-NUCES branding.
- Hero overview banner emphasizing Computer Networks research.
- **Real-Time Metric Cards**:
  - Total Research Opportunities
  - Active / Open Listings
  - Total Available Student Vacancies
  - Academic Departments Participating

### 2. Research Opportunity Discovery & Filtering
- **Keyword Search**: Real-time search across titles, faculty names, research domains, descriptions, and required technical skills (e.g., *Mininet, SDN, eBPF, Wireshark*).
- **Multi-criteria Filtering**:
  - **Status Filter**: All, Open, or Closed.
  - **Department Filter**: Computer Networks & Security, Computer Science, Software Engineering, Electrical Engineering, AI & Data Science.
  - **Research Domain Filter**: SDN, DDoS Detection, Edge 5G/6G, IoT Mesh, Zero-Trust, eBPF Packet Processing, etc.
- **Sorting Options**:
  - Application Deadline (Soonest first / Furthest first)
  - Recently Posted
  - Most Available Positions
- **View Toggle**: Switch effortlessly between an **Attractive Cards Grid View** and a **Structured Data Table View**.

### 3. Detailed Opportunity Modal
- Comprehensive view presenting:
  - Research project description and scope.
  - Research area and department badges.
  - Faculty supervisor details (Name, academic rank, verified university email).
  - Required skills and competencies (interactive tags).
  - Number of vacancies and application deadline (with dynamic "Closing Soon" / "Expired" alerts).
  - Research laboratory location and stipend/funding specifics.
  - Eligibility criteria and prerequisite courses.
  - Direct actions: Apply via pre-filled email draft, shareable link copy, edit, and toggle status.

### 4. Create & Edit Opportunity Form
- Full-featured modal for publishing or updating research opportunities.
- **Field Validation**:
  - Project Title (min length check)
  - Department and Research Domain selection
  - Faculty Mentor details & university email format validation
  - Research Description (min length check)
  - Interactive **Skill Tag Manager** with quick suggestions (Mininet, Python, Wireshark, eBPF, etc.)
  - Available positions counter and deadline date picker
  - Lab location, stipend, and eligibility criteria
- User-friendly inline error messaging and loading feedback.

### 5. Action Controls & Confirmation Dialogs
- **Close / Reopen Status**: One-click status toggle with informational toasts.
- **Edit Opportunity**: Pre-populates all form inputs with existing data.
- **Delete Opportunity**: Guarded by a dedicated **Destructive Action Confirmation Dialog** displaying the item's title to prevent accidental loss.
- **Reset Sample Data**: Easily restores the authentic FAST-NUCES mock dataset at any time.

### 6. User Experience & Responsiveness
- **Loading States**: Animated pulse skeletons for both Grid and Table layouts.
- **Empty States**: Helpful messages with quick reset and creation buttons when search returns zero results.
- **Fully Responsive**: Optimized for mobile phones, tablets, laptops, and ultra-wide desktop monitors.
- **Clean Architecture**: No unnecessary login/authentication walls—focused purely on clean academic opportunity discovery and management.

---

## 📁 Project Structure

```
fast-research-portal/
├── src/
│   ├── app/
│   │   ├── globals.css              # Custom styling, fonts, scrollbars
│   │   ├── layout.tsx               # Root layout with Toaster and context provider
│   │   └── page.tsx                 # Main dashboard view
│   ├── components/
│   │   ├── ui/                      # Base primitives (Button, Card, Badge, Dialog, Input, etc.)
│   │   ├── navbar.tsx               # University brand header & quick actions
│   │   ├── stats-cards.tsx          # Key metric cards
│   │   ├── filter-bar.tsx           # Search, filters, sort, and view switcher
│   │   ├── opportunity-card.tsx     # Opportunity card item
│   │   ├── opportunity-table.tsx    # Opportunity table view
│   │   ├── opportunity-detail-modal.tsx  # Full opportunity details modal
│   │   ├── opportunity-form-modal.tsx    # Create / Edit form dialog
│   │   ├── delete-confirm-modal.tsx      # Destructive confirmation modal
│   │   ├── empty-state.tsx          # Zero-results fallback state
│   │   ├── loading-state.tsx        # Skeleton loaders
│   │   └── footer.tsx               # University footer
│   ├── context/
│   │   └── opportunities-context.tsx# State management & localStorage sync
│   ├── lib/
│   │   ├── mock-data.ts             # Realistic FAST Computer Networks research data
│   │   └── utils.ts                 # Class merging & date utilities
│   └── types/
│       └── opportunity.ts           # Strict TypeScript interfaces
├── package.json
└── tsconfig.json
```

---

## 🛠️ Running Locally

1. Navigate to the project directory:
   ```bash
   cd /home/umair/fast-research-portal
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. To build for production:
   ```bash
   npm run build
   npm run start
   ```
