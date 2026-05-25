---
name: feedback_sticky_minheight
description: min-height 100dvh on body breaks position sticky after one full viewport scroll
metadata:
  type: feedback
---

Do NOT set `min-height: 100dvh` on `body` in any page stylesheet when `position: sticky` is used on a navbar or other element.

**Why:** `min-height: 100dvh` causes some browsers to treat `body` as the scroll container with a capped height, limiting sticky elements to within that viewport-height boundary. After exactly one full viewport scroll, the sticky behavior breaks and the element scrolls away. Confirmed fix: removing `min-height: 100dvh` from body resolves it immediately.

**How to apply:** When a sticky navbar stops working after ~100dvh of scrolling, check if `body` has `min-height: 100dvh` and remove it. Applies to all page stylesheets in this project (design-style.css, photography-undersite-style.css, concepts-style.css, etc.).
