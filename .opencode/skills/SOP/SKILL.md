# Islamic Scholarly Lineage Platform - Technical Specification

---

# 1. Project Overview

- **Name**: Islamic Scholar Graph (Isnad Visualization)
- **Type**: Web Application (Next.js + Supabase)
- **Purpose**: Interactive knowledge graph visualizing Islamic scholarly transmission chains
- **Target Users**: Researchers, students, and enthusiasts of Islamic scholarship

---

# 2. Technology Stack

## Frontend
- Next.js 14 (App Router)
- TypeScript
- React Flow (graph visualization)
- Zustand (state management)
- Tailwind CSS

## Backend
- Supabase (PostgreSQL database)
- Supabase Auth (authentication)
- Edge Functions (API)

---

# 3. Database Schema

## Table: scholars

```sql
CREATE TABLE scholars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  generation TEXT NOT NULL,
  madhhab TEXT,
  region TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Generations**:
- sahaba
- tabiun
- atba_al_tabiin
- imams
- Scholars (post-classical)

**Madhhabs**:
- hanafi
- maliki
- shafii
- hanbali
- zahiri
- other

## Table: relationships

```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES scholars(id) ON DELETE CASCADE,
  student_id UUID REFERENCES scholars(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'teacher' CHECK (type IN ('teacher', 'influence')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);
```

---

# 4. API Specification

## Graph Data Endpoint

**GET** `/api/graph`

Returns:
```json
{
  "nodes": [
    {
      "id": "uuid",
      "label": "string",
      "data": {
        "generation": "string",
        "madhhab": "string",
        "birthYear": 700,
        "deathYear": 767
      }
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "source": "teacher_id",
      "target": "student_id"
    }
  ]
}
```

**Query Params**:
- generation (filter)
- madhhab (filter)
- minYear (filter)
- maxYear (filter)

## Scholar Endpoints

- `GET /api/scholars` - List all scholars
- `GET /api/scholars/[id]` - Get single scholar
- `POST /api/scholars` - Create scholar
- `PUT /api/scholars/[id]` - Update scholar
- `DELETE /api/scholars/[id]` - Delete scholar

## Relationship Endpoints

- `GET /api/relationships` - List relationships
- `POST /api/relationships` - Create relationship
- `DELETE /api/relationships/[id]` - Delete relationship

---

# 5. Frontend Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Graph View | Public |
| `/scholar/[id]` | Scholar Detail | Public |
| `/about` | About Page | Public |
| `/admin` | Admin Dashboard | Protected |
| `/admin/scholars` | Scholar Management | Protected |
| `/admin/relationships` | Relationship Management | Protected |

---

# 6. Component Architecture

```
app/
├── page.tsx                    # Main graph view
├── layout.tsx                   # Root layout
├── about/
│   └── page.tsx                # About page
├── scholar/
│   └── [id]/
│       └── page.tsx            # Scholar detail page
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar
│   ├── page.tsx                # Dashboard
│   ├── scholars/
│   │   ├── page.tsx             # Scholar list
│   │   └── [id]/page.tsx       # Edit scholar
│   └── relationships/
│       └── page.tsx            # Relationship management
├── api/
│   ├── graph/route.ts          # Graph data
│   ├── scholars/route.ts       # Scholars CRUD
│   └── relationships/route.ts  # Relationships CRUD
└── lib/
    ├── supabase.ts             # Supabase client
    └── graph-utils.ts          # Graph helpers
```

```
components/
├── graph/
│   ├── GraphCanvas.tsx         # Main graph component
│   ├── ScholarNode.tsx          # Custom node
│   └── Controls.tsx             # Zoom controls
├── panels/
│   ├── FilterSidebar.tsx       # Left sidebar with filters
│   └── ScholarDetail.tsx       # Right sidebar
├── admin/
│   ├── ScholarForm.tsx         # Add/Edit form
│   ├── RelationshipForm.tsx     # Add relationship
│   └── DataTable.tsx            # Reusable table
└── ui/
    ├── Navbar.tsx              # Top navigation
    ├── SearchBar.tsx          # Search component
    └── Button.tsx              # Button component
```

---

# 7. UI/UX Specification

## Color Palette

```css
--background: #0f0f0f;
--surface: #1a1a1a;
--surface-hover: #252525;
--border: #2a2a2a;
--text-primary: #f5f5f5;
--text-secondary: #a0a0a0;
--accent: #8b5cf6;

/* Generation Colors */
--sahaba: #ef4444;
--tabiun: #f97316;
--atba-al-tabiin: #eab308;
--imams: #22c55e;
--scholars: #3b82f6;

/* Madhhab Colors */
--hanafi: #06b6d4;
--maliki: #8b5cf6;
--shafii: #ec4899;
--hanbali: #f59e0b;
--zahiri: #10b981;
--other: #6b7280;
```

## Layout

### Main Graph View
```
┌─────────────────────────────────────────────────────┐
│ Navbar (Search)                              64px │
├────────────┬────────────────────┬───────────────┤
│ Filters    │                    │ Scholar Detail│
│ 280px      │   Graph Canvas     │ 320px         │
│            │     (flex-1)       │               │
└────────────┴────────────────────┴───────────────┘
```

## Responsive Breakpoints
- Desktop: ≥1024px (full layout)
- Tablet: 768-1023px (collapsible sidebars)
- Mobile: <768px (list view fallback)

---

# 8. Graph Interaction Requirements

- **Drag**: Pan the canvas by dragging background
- **Zoom**: Scroll to zoom, min 0.25x max 2x
- **Select**: Click node to show details in right panel
- **Connect**: Hover node highlights connected nodes
- **Search**: Select from search focuses and centers on node

---

# 9. Admin Features

## Scholar CRUD
- List all scholars with pagination
- Add new scholar with form validation
- Edit existing scholar
- Delete with confirmation
- Search/filter in list view

## Relationship Management
- Dropdown to select teacher
- Dropdown to select student
- Type selector (teacher/influence)
- Delete relationship

---

# 10. Initial Dataset

Core Imams to seed:
1. Abu Hanifa (699-767) - hanafi - imams
2. Malik ibn Anas (711-795) - maliki - imams
3. Al-Shafi'i (767-820) - shafii - imams
4. Ahmad ibn Hanbal (780-855) - hanbali - imams

Teachers between them:
- Malik -> Al-Shafi'i
- Al-Shafi'i -> Ahmad ibn Hanbal

---

# 11. Acceptance Criteria

- [ ] Graph renders with nodes and edges
- [ ] Nodes are clickable and show details
- [ ] Filter sidebar filters graph by generation/madhhab
- [ ] Search focuses on selected scholar
- [ ] Admin panel protected (login required)
- [ ] CRUD operations work for scholars
- [ ] Relationship management works
- [ ] Responsive on tablet/mobile
- [ ] Build passes without errors

---

# 12. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```