---
name: whoisthisscholar
description: is an interactive, timeline-based educational web application designed to visualize Islamic scholarly lineages (isnād) through a card-based interface.
license: MIT
metadata:
  author: saqif
---

The platform enables users to explore scholars, their teachers, and students in a chronological, visually intuitive manner.

## Core Objectives
- Represent scholarly relationships (teacher → student) visually
- Provide a timeline-based (calendar-style) layout
- Enable interactive learning for users (including younger audiences)
- Maintain a clean, minimal, non-techy UI
- Ensure all data is manually curated and accurate

---

## Layout Structure (Desktop)

### 1. Top Navbar
**Purpose:** Control and navigation

**Components:**
- Search bar (name, teacher, student, books)
- Filters toggle (compact dropdown/panel)
- Zoom control (range: 0.5x → 5x)
- Light/Dark mode toggle (default: Dark)

---

### 2. Main Canvas (Core Area)

**Behavior:**
- Infinite vertical scroll
- Timeline-based layout

**Timeline Logic:**
- Vertical axis = Birth year
- Scholars placed chronologically after Prophet Muhammad ﷺ
- Position rules:
  - Exact year → exact vertical placement
  - Overlap → place cards side-by-side
  - Close years → proportionally spaced (calendar style)

---

### 3. Scholar Nodes (Cards)

#### Default State (Collapsed)
- Name
- Lifespan (birth–death)
- Minimal identifier (field or tag)

#### Interaction
- On click:
  - Flip OR expand into popup/modal

#### Expanded Content
- Full name
- Birth & death year
- ʿAqīdah (Creed)
- Madhab
- Field(s) of expertise
- Teachers
- Students
- Books
- Optional short description

---

### 4. Relationship Mapping (Isnād)

- Each node connects to:
  - Teachers (above)
  - Students (below)

**Rendering Rules:**
- Clean connecting lines
- Avoid clutter
- Highlight chain on interaction (hover/click optional)

---

### 5. Right-Side Timeline Ruler

**Behavior:**
- Fixed position
- Scroll-synced with canvas

**Structure:**
- Markers every 50 years (adjusts with zoom)
- Displays:
  - Khilāfah of the era
  - If no Khilāfah → ruling authority

---

## Filters System

**Access:**
- Triggered via navbar toggle

**Design:**
- Compact overlay (no permanent sidebar)

**Filter Options:**
- Madhab
- ʿAqīdah (optional)
- Field of expertise
- Era / Khilāfah

**Behavior:**
- Multi-select
- Instant UI update
- Modes:
  - Highlight matches
  - Hide non-matching nodes

---

## Interaction Principles

- Exploration-first design
- Minimal text, maximum clarity
- Smooth transitions:
  - Zoom
  - Card expansion
  - Graph highlighting
- Maintain usability at all zoom levels

---

## Core Systems

### 1. Timeline Engine
- Converts year → vertical position
- Handles overlap logic
- Scales with zoom

### 2. Graph Engine
- Renders teacher-student connections
- Prevents visual clutter
- Supports highlighting chains

### 3. Card Engine
- Renders nodes
- Handles flip/expand interactions
- Injects scholar data

### 4. Zoom Engine
- Scales:
  - Timeline spacing
  - Card size
  - Ruler intervals

---

## Data Management

**Source:**
- 100% manually curated (no scraping or auto-fetching)

**Data Structure Example:**
```json
{
  "id": "unique_id",
  "name": "Scholar Name",
  "birth_year": 800,
  "death_year": 870,
  "madhab": "Hanbali",
  "aqeedah": "Athari",
  "fields": ["Hadith", "Fiqh"],
  "teachers": ["id1", "id2"],
  "students": ["id3", "id4"],
  "books": ["Book 1", "Book 2"]
}