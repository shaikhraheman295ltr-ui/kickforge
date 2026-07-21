# Image Arrangement Guide — KICKFORGE Pattern

## How Your 16 Images Will Be Displayed

| Section | Component | Arrangement | How Many Images |
|---|---|---|---|
| **Featured Cards** | `FeaturedSection.tsx` | 3D tilt grid, full-bleed `object-cover`, hover `scale(1.06)` + `hue-rotate` | Pick 6–8 as `featured: true` |
| **Explore Grid** | `ExploreSection.tsx` | Masonry columns (1→2→3→4), full-width `object-cover`, hover `scale(1.05)` | All 16, filterable by category |
| **Sale Grid** | `SaleSection.tsx` | Square grid `aspect-square object-cover`, hover `scale(1.05)` | Pick 5–7 as `onSale: true` |
| **Detail Modal** | `ExploreSection.tsx` | 50% width, `aspect-square object-cover` | Shows selected product |
| **Cart Thumbnail** | `CartSidebar.tsx` | 80×80 `object-cover rounded-lg` | Shows added items |

## Image Requirements

- **Format:** JPG or PNG
- **Aspect ratio:** Square (1:1) recommended — all sections use `object-cover` so any ratio works but square gives best results
- **Size:** 800×800 minimum, 1200×1200 ideal
- **Naming:** Rename to `1.jpg`, `2.jpg`, ... `16.jpg`
- **Placement:** `public/images/1.jpg` through `public/images/16.jpg`

## Visual Style (to match your images)

```
COMPOSITION:
  - Product centered, fills 70-80% of frame
  - Slight 3/4 angle (not straight side profile)
  - Clean/minimal background (solid or subtle gradient)
  - Soft shadow beneath the product

LIGHTING:
  - Key light from upper-left
  - Rim/highlight on right edge
  - High contrast, dramatic but clean

CONSISTENCY:
  - Same camera distance and angle across all 16
  - Same background treatment
  - Same lighting setup
```

## How to Plug In Your Images

### Step 1 — Replace files
```
public/images/1.jpg  → your image 1
public/images/2.jpg  → your image 2
...
public/images/16.jpg → your image 16
```

### Step 2 — Update `server/products.json`
Replace all 25 entries with your 16. Keep the same schema:
```json
{
  "id": 1,
  "name": "YOUR PRODUCT NAME",
  "price": 199,
  "salePrice": null,
  "onSale": false,
  "category": "lifestyle",
  "featured": true,
  "colors": ["#8B5CF6", "#EC4899"],
  "sizes": [6, 7, 8, 9, 10, 11, 12],
  "image": "/images/1.jpg",
  "description": "Your product description here."
}
```

**Fields that control arrangement:**
| Field | Effect |
|---|---|
| `featured: true` | Appears in FeaturedSection 3D tilt cards |
| `onSale: true` | Appears in SaleSection grid + "SALE" badge |
| `category` | Used for ExploreSection filter tabs (`running`, `lifestyle`, `training`, `outdoor`) |
| `colors` | Shows color dots in FeaturedSection (hue-rotate preview) |

### Step 3 — Set categories for filter tabs
Distribute your 16 products across the 4 categories so filters work:

| Category | Min products | Tab shows |
|---|---|---|
| `running` | 3–4 | RUNNING |
| `lifestyle` | 3–4 | LIFESTYLE |
| `training` | 2–3 | TRAINING |
| `outdoor` | 2–3 | OUTDOOR |
| `sale` | (auto from `onSale`) | SALE |

### Step 4 — Build & verify
```bash
npm run build
npm run dev
```

## Visual Reference (Current Behavior)

| Section | Screenshot Description |
|---|---|
| Featured | 8 cards in 2 rows, each card shows full image with purple gradient overlay at bottom for product name |
| Explore | All products in Pinterest-style masonry, click opens modal with larger image on left |
| Sale | Square grid (3 cols desktop, 2 tablet, 1 mobile) with countdown timer header |
| Cart | Slide-in panel, 80×80 thumbnails with qty controls |

---

*No code changes needed — just replace images and update products.json*
