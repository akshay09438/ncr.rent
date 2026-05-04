# delhi.rent — MVP Design Specification
**Date:** 2026-05-02
**Scope:** Full feature parity with bengaluru.rent + 5 NCR-specific additions
**Stack:** Vanilla HTML/JS + Supabase

---

## Context

Harshit at bengaluru.rent built an anonymous, community-driven rent map for Bangalore — 3,836+ pins, no login required, filters, stats, seeker pins, flatmate matching. It works beautifully. The goal is to build the same thing for Delhi NCR / Gurgaon — same model, same UX, plus NCR-specific overlays (AQI, expressways, commute hubs, sector-aware labels, landlord vs broker tags).

**Tech choice rationale:** Vanilla HTML/JS + Supabase was chosen (vs Next.js) for zero build step and fastest possible MVP. Supabase handles database, auth (device-based), realtime subscriptions, and RLS — all without a custom backend.

---

## 1. Visual Design

**Theme:** Dark Purple — matching bengaluru.rent for brand consistency
**Why:** Users already familiar with bengaluru.rent immediately recognise the aesthetic. It's proven and works well.

### Colour Palette

| Token | Hex | Use |
|---|---|---|
| `--bg-primary` | `#0f0f1a` | Page background |
| `--bg-secondary` | `#1a1040` | Cards, panels |
| `--accent` | `#7c3aed` | Buttons, highlights |
| `--accent-light` | `#a78bfa` | Secondary text, icons |
| `--text-primary` | `#e2e8f0` | Body text |
| `--text-muted` | `#6b7280` | Labels, captions |
| `--pin-gated` | `#22c55e` | Green pins — gated societies |
| `--pin-open` | `#f97316` | Orange pins — open/independent |
| `--pin-seeker` | `#3b82f6` | Blue pins — seekers |
| `--pin-cluster` | `#7c3aed` | Cluster markers |
| `--metro-line-1` | `#ee2d24` | Red Line |
| `--metro-line-2` | `#3b82f6` | Blue Line |
| `--metro-line-3` | `#a3e635` | Green Line |
| `--metro-line-4` | `#06b6d4` | Yellow Line |
| `--metro-line-5` | `#f59e0b` | Orange Line |
| `--metro-line-6` | `#7c3aed` | Violet Line |
| `--metro-line-7` | `#f97316` | Pink Line |
| `--metro-line-8` | `#84cc16` | Magenta Line |
| `--metro-line-9` | `#0ea5e9` | Grey Line |

### Typography
- **Font:** Inter (Google Fonts) — fallback system-ui
- **Headings:** 700 weight, --text-primary
- **Body:** 400 weight, --text-primary
- **Labels/caps:** 600 weight, --text-muted, letter-spacing 0.05em

### Components
- Pill badges for BHK type: `--accent` background, white text
- Price badges: dark card background, accent-coloured price text
- Filter chips: outlined, accent border, accent text
- Buttons: `--accent` background, white text, 6px radius
- Modals: `--bg-secondary`, 12px radius, 8px padding
- Map pins: circle markers, 28px diameter, border radius 50%

---

## 2. Map

### Base Map
- **Provider:** Google Maps JavaScript API
- **Note:** Requires a Google Cloud billing account (free tier covers plenty for an MVP). If cost is a concern later, can migrate to Leaflet + OpenStreetMap with minimal UI changes.
- **Initial view:** Gurgaon centre — lat 28.4595, lng 77.0266, zoom 12
- **Map type:** Dark/night style to match the UI
- **Clustering:** @googlemaps/markerclusterer — clusters at zoom <14
- **Cluster appearance:** Circle with pin count, `--pin-cluster` background

### Pin Types & Colours
| Pin Type | Color | Icon |
|---|---|---|
| Rental — Gated | Green `#22c55e` | filled circle |
| Rental — Not Gated | Orange `#f97316` | filled circle |
| Seeker (looking for flat) | Blue `#3b82f6` | diamond |
| Flatmate needed | Purple `#7c3aed` | hollow circle |

### Pin Tags (shown below pin dot)
- `WHOLE AVBL` — whole flat available
- `ROOM AVBL` — room available
- `YOUR PIN` — current user's own pin
- `1 report` — flagged by community
- `Above avg` — rent > average for BHK in area

### Metro Overlay (DMRC)
- All 9 DMRC lines rendered as coloured polylines
- Station markers as small dots
- Toggle button in filter panel: "Show Metro"
- Lines: Red, Blue, Green, Yellow, Orange, Violet, Pink, Magenta, Grey (Phase 1–4 including Rapid Metro Gurgaon)

### Expressway Overlays
- NH-48 (Delhi–Jaipur Highway)
- Dwarka Expressway (Gurgaon)
- Yamuna Expressway (Noida–Agra)
- Rendered as semi-transparent dashed lines, accent colour

### AQI Overlay
- Colour-coded zones at zoom > 13
- Green (0–50), Yellow (51–100), Orange (101–200), Red (201–300), Purple (300+)
- Data from WAQI API (free, no key required for `/feed` endpoint)
- Toggle in map controls

---

## 3. Pin Submission Form

Triggered by clicking anywhere on the map. The form slides up as a bottom sheet (mobile) or side panel (desktop).

### Rental Pin Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| Type | Toggle | Yes | WHOLE AVBL / ROOM AVBL |
| BHK | Select (1–5+) | Yes | |
| Monthly Rent | Number | Yes | In ₹ |
| Furnishing | Toggle | Yes | Furnished / Unfurnished |
| Includes Maintenance | Checkbox | No | |
| Gated Society | Toggle | Yes | Yes / No |
| Landlord Type | Toggle | No | **NCR only**: Direct Landlord / Broker |
| Who lives here | Toggle | Yes | Family / Bachelor / Anyone |
| Deposit | Select (1–11+ months) | No | |
| Pets allowed | Toggle | Yes | Yes / No / Not sure |
| Parking | Number | No | Number of car spots |
| Square Footage | Number | No | Optional |
| Society/Building Name | Text | No | |
| Commute Hub | Select | No | **NCR only**: Cyber Hub / CP / Sector 62 / None |
| Water Supply | Select | No | **NCR only**: Municipal / Tanker / Borewell / Mixed |
| Power Cut Frequency | Select | No | **NCR only**: Rare / Occasional / Frequent |
| One-liner | Textarea | No | Max 160 chars |
| Looking for flatmate | Checkbox | No | |
| Email | Email | No | Never shown publicly |

### Seeker Pin Fields (looking for flat)
| Field | Type | Required | Notes |
|---|---|---|---|
| Looking for | Toggle | Yes | Whole Flat / Room |
| Budget | Number | Yes | ₹/month |
| BHK Preference | Multi-select | Yes | 1 / 2 / 3 / Any |
| Move-in | Select | Yes | ASAP / Next Month / Flexible |
| Food preference | Toggle | Yes | Veg / Non-veg / Any |
| Smoker OK | Toggle | No | Smoker / Non-smoker / No preference |
| Preferred flatmate gender | Toggle | No | Male / Female / Any |
| Parking needed | Checkbox | No | |
| Lifestyle note | Textarea | No | Max 200 chars |
| Email | Email | No | |
| Phone | Tel | No | |

### Flatmate Pin Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| Rent per room | Number | Yes | ₹/month |
| Available from | Date | Yes | |
| Gender preference | Toggle | Yes | Male / Female / Any |
| Smoker OK | Toggle | No | |
| Food preference | Toggle | No | Veg / Non-veg / Any |
| Parking | Number | No | |
| Email | Email | No | |
| Phone | Tel | No | |

### Submission flow
1. User clicks map → form appears with all fields
2. Validates required fields client-side
3. Submits to Supabase `pins` table
4. Pin appears immediately on map (optimistic update)
5. Confirmation modal: share to WhatsApp / copy link

---

## 4. Pin Popup

Clicking an existing pin shows a popup overlay.

### Sections
1. **Header:** Rent (large, accent colour) + BHK badge + furnishing badge
2. **Tags row:** Gated/Not Gated + Landlord Type (NCR) + Pets OK + Parking
3. **Meta:** Society name (if provided) + location area + posted X days ago
4. **One-liner** (if provided)
5. **CTA buttons:**
   - "I'm interested" → opens email composer with owner's masked email (relayed via Supabase Edge Function — owner never sees seeker's real email)
   - "Watch this area" → watch area modal
   - "Share" → WhatsApp / Copy Link
6. **Star Rating section:**
   - "Rate this listing" — 5 stars
   - Aggregate rating shown (e.g. ★ 4.2)
   - Two sub-ratings: Locality + Built Quality
7. **Comments section:**
   - List of community comments
   - "Add a comment" text input
   - Comments are anonymous (device ID only)
8. **Footer actions:** Edit / Delete (only for own pins)

### Edit/Delete
- Edit: re-opens the submission form pre-filled
- Delete: confirmation prompt → soft delete in DB (set `deleted_at` timestamp)

---

## 5. Filter Panel

Persistent panel (left side on desktop, bottom sheet on mobile).

### Filter Controls

| Filter | Type | Values |
|---|---|---|
| BHK | Multi-select chips | 1, 2, 3, 4, 5+ |
| Rent Range | Min–Max sliders | ₹5K – ₹2L+ |
| Furnishing | Toggle | Furnished / Unfurnished / Any |
| Society Type | Toggle | Gated / Open / Any |
| Rating | Min rating | 2+, 3+, 4+, 5 stars |
| Near Metro | Distance slider | Within 0.5 / 1 / 2 km |
| Property Type | Multi-select | WHOLE AVBL / ROOM AVBL |
| Commute Hub | Select | Cyber Hub / CP / Noida Sec 62 / Any |
| Show Metro Lines | Toggle | On / Off |
| Show AQI Overlay | Toggle | On / Off |
| Pin View | Toggle | Listings / Seekers / Both |

### Filter chips
Active filters shown as dismissible chips at top of map.

### Seeker vs Lister Toggle
Toggle at top: "Filter Flats" / "Opportunities" — switches between showing rental pins and seeker pins.

---

## 6. Live Stats Panel

Opens via "Live Stats" nav button. Full-screen modal.

### Leaderboard
Top 5 highest rents per BHK — shows address, rent amount, BHK, gated status.

### Average Rents by BHK (overall)
| BHK | Count | Avg Rent |
|---|---|---|
| 1 BHK | — | ₹X |
| 2 BHK | — | ₹X |
| 3 BHK | — | ₹X |
| 4 BHK | — | ₹X |
| 5+ BHK | — | ₹X |

Toggle: "Overall" vs "Near You" (based on map centre).

### Area Stats (draw-to-analyse)
- Click "Draw Area" button
- User draws a rectangle on the map
- Stats panel shows breakdown of pins inside the rectangle:
  - Count by BHK
  - Average rent by BHK
  - Gated vs open split
  - Toggle: All / Gated / Not Gated

---

## 7. Watch This Area

Triggered from pin popup or nav button. Modal:

- Duration: 1 month / 3 months / 6 months / 12 months
- Email (required)
- Phone (optional)
- Opt-in checkbox for SMS alerts

Backend: `watched_areas` table. Supabase cron or Edge Function checks daily for new pins within radius and sends email via a transactional email provider (Resend/SendGrid).

---

## 8. NCR-Specific Features (not in bengaluru.rent)

### Landlord vs Broker Tag
On every rental pin, show a tag:
- `👤 Direct Landlord` — green tag
- `🏢 Broker` — orange tag

This is a required (or optional) field in the submission form.

### AQI Overlay
- Uses WAQI API (free, no key needed)
- Fetches AQI for current map bounds on zoom change
- Colour zones: Green → Yellow → Orange → Red → Purple
- Legend shown in map corner

### Commute Hub Filter
Filter to show pins within X minutes travel time from:
- Cyber Hub (Gurgaon)
- Connaught Place (Delhi)
- Noida Sector 62
- Saket
- Dwarka Sector 21 Metro

Implemented as approximate radius: 3km for metro-connected hubs.

### Expressway Overlay
Toggle to show:
- NH-48 (runs through Gurgaon)
- Dwarka Expressway
- Yamuna Expressway (Noida)

Rendered as dashed lines with labels.

### Sector-Aware Labels
Area labels on map for:
- Gurgaon Sectors: Sector 14, 15, 21, 22... up to 83
- Noida Sectors: Sector 1, 2, 15, 18, 21, 62, 63...
- Delhi zones: Lajpat Nagar, Saket, Vasant Kunj, Rohini, Dwarka

Labels appear at zoom 12+, smaller font at 12–13, larger at 14+.

---

## 9. Anonymous Design

**No login required.** Ownership tracked via:
1. Device ID (generated once, stored in `localStorage`)
2. IP address (fetched from ipify.org on first visit, stored in Supabase `pins` table as `creator_ip` for spam detection only — never displayed publicly)

**Privacy:**
- Email and phone never shown publicly
- Supabase Edge Function relays emails (seeker → owner) without exposing either email
- Comments are anonymous — device ID only, no names

**Spam mitigation:**
- Rate limit: 1 pin per device per 24 hours
- IP check: flag pins from same IP within 1 hour
- Community flag: 3+ reports → pin auto-hidden pending review
- Manual review queue accessible via secret URL (e.g. `?review=token`)

---

## 10. Data Architecture (Supabase)

### Tables

**`pins`**
```sql
id uuid primary key
type text -- 'rental' | 'seeker' | 'flatmate'
lat float
lng float
bhk integer
rent integer
furnishing text -- 'furnished' | 'unfurnished'
maintenance_included boolean
gated boolean
landlord_type text -- 'direct' | 'broker' | null (NCR only)
who_lives text -- 'family' | 'bachelor' | 'anyone'
deposit_months integer
pets_allowed text -- 'yes' | 'no' | 'unsure'
parking integer
sqft integer
society_name text
commute_hub text -- NCR only
water_supply text -- NCR only
power_cuts text -- NCR only
one_liner text
looking_for_flatmate boolean
email text -- private
device_id text
creator_ip text -- not displayed
created_at timestamp
deleted_at timestamp -- soft delete
reports_count integer default 0
```

**`ratings`**
```sql
pin_id uuid references pins
device_id text
locality_rating integer -- 1-5
built_rating integer -- 1-5
created_at timestamp
unique(pin_id, device_id)
```

**`comments`**
```sql
id uuid
pin_id uuid
device_id text
body text
created_at timestamp
```

**`reports`**
```sql
pin_id uuid
device_id text
reason text
created_at timestamp
```

**`watched_areas`**
```sql
id uuid
lat float
lng float
radius_km float
email text
phone text
duration_months integer
active boolean
created_at timestamp
```

### Row Level Security (RLS)
- `pins`: Anyone can SELECT. Only INSERT where `device_id` matches. UPDATE/DELETE only own pins.
- `ratings`, `comments`, `reports`: Anyone can INSERT. SELECT all.
- `watched_areas`: Anyone can INSERT. No SELECT (privacy).

### Edge Functions
- **`get-pins`**: Returns pins with rounded coords (3 decimal places) to prevent exact location leakage. Returns only non-deleted, non-hidden pins with <3 reports.
- **`send-interest`**: Relays "I'm interested" email to pin owner without exposing seeker email.
- **`match-pins`**: Daily job to match seeker pins with new rental pins within 3km radius, sends email.

---

## 11. File Structure

```
ncr-rent-map/
├── index.html                 # Single shell: loads all JS, renders map
├── style.css                  # Dark purple theme, all components
├── js/
│   ├── config.js             # Supabase URL/anon key, Google Maps key, constants
│   ├── map.js                # Google Maps init, marker clusterer, pin rendering
│   ├── pins.js               # Load pins, submit pin, edit, delete
│   ├── filters.js            # Filter panel, active filters state
│   ├── stats.js              # Live stats modal, leaderboard, area draw
│   ├── metro.js             # DMRC lines GeoJSON data + render
│   ├── aqi.js               # WAQI API fetch + colour zone overlay
│   ├── expressways.js       # NH-48, Dwarka Exp, Yamuna Exp polylines
│   ├── sectors.js           # Gurgaon/Noida/Delhi sector labels data
│   ├── auth.js              # Device ID generation + ownership
│   ├── realtime.js          # Supabase realtime subscription
│   └── ui.js                # Modals, bottom sheets, toasts
└── supabase/
    └── schema.sql           # All tables, RLS policies, indexes
```

---

## 12. Verification Plan

1. **Build checklist:**
   - [ ] Create Supabase project, run `schema.sql`
   - [ ] Get Google Maps API key (Maps JavaScript API + Places API)
   - [ ] Add API keys to `config.js`
   - [ ] Verify `index.html` loads without JS errors
   - [ ] Submit a test pin → appears on map
   - [ ] Click pin → popup shows correct data
   - [ ] Apply filters → pins update correctly
   - [ ] Toggle metro overlay → DMRC lines appear
   - [ ] Toggle AQI overlay → colour zones appear
   - [ ] Open live stats → average rents show
   - [ ] Draw area on stats → shows breakdown
   - [ ] Submit seeker pin → appears as diamond marker
   - [ ] Test "I'm interested" → email sent via edge function
   - [ ] Verify mobile view (bottom sheets work)
   - [ ] Test on Chrome, Firefox, Safari

2. **Data seeding:**
   - Manually add 50–100 pins across Gurgaon, Noida, South Delhi to demonstrate the map working

3. **Production deployment:**
   - Vercel/Netlify for frontend (static hosting)
   - Supabase for database
   - Point domain `delhi.rent` to Vercel

---

*Spec written: 2026-05-02*