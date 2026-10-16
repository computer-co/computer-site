```json design.json
{
  "design_system": {
    "metadata": {
      "style_name": "Enterprise Editorial Minimalism",
      "vibe_keywords": ["Editorial", "Minimalist", "Authoritative"],
      "design_principles": "High-contrast Swiss minimalism with generous whitespace, an elegant serif for headlines paired with a neutral grotesque sans for body, near-zero ornamentation and sharp, deliberate blocks of color."
    },
    "tokens": {
      "colors": {
        "primary": "#0B1B2B",
        "secondary": "#111111",
        "accent": "#C8553D",
        "background": {
          "main": "#F2F1EC",
          "card": "#FFFFFF",
          "modal": "#EDE9DC"
        },
        "text": {
          "primary": "#111111",
          "secondary": "#5B5B57",
          "link": "#111111"
        },
        "border": "#D8D6CE"
      },
      "typography": {
        "font_family_primary": "Tiempos / PP Editorial (closest Google Font: Newsreader or Source Serif 4)",
        "font_family_secondary": "Inter (grotesque sans-serif)",
        "scale": {
          "h1": { "size": "64px / 4rem", "weight": "Regular/400", "line_height": "1.05" },
          "h2": { "size": "40px / 2.5rem", "weight": "Regular/400", "line_height": "1.15" },
          "h3": { "size": "20px / 1.25rem", "weight": "Medium/500", "line_height": "1.3" },
          "eyebrow": { "size": "12px / 0.75rem", "weight": "Medium/500", "line_height": "1.2", "transform": "uppercase", "letter_spacing": "0.08em" },
          "body": { "size": "16px / 1rem", "weight": "Regular/400", "line_height": "1.5" },
          "small": { "size": "13px / 0.8125rem", "weight": "Regular/400", "line_height": "1.4" }
        }
      },
      "spacing": {
        "base_unit": "8px",
        "container_padding": "32px",
        "section_gap": "120px"
      },
      "shapes": {
        "border_radius": {
          "sm": "2px",
          "md": "4px",
          "lg": "6px",
          "full": "9999px"
        },
        "border_width": "1px"
      },
      "effects": {
        "shadows": {
          "card": "none",
          "button_hover": "0px 1px 2px rgba(0,0,0,0.12)"
        },
        "gradients": "none",
        "blur": "none",
        "image_treatment": "Full-bleed photography with subtle motion blur and dark overlay for legible white text"
      }
    },
    "components": {
      "buttons": {
        "primary": "Solid near-black (#111111) rectangle, white text, sharp corners (2-4px radius), no shadow, tight padding, sans-serif medium weight.",
        "secondary": "Transparent background with 1px solid border (#111111), dark text, same sharp corners."
      },
      "cards": {
        "style": "White or full-bleed image background, thin 1px hairline border (#D8D6CE), sharp/low radius, no shadow; image cards carry a dark gradient overlay with white serif/sans text and a small text link."
      },
      "inputs": {
        "style": "Flat surface (#FFFFFF) with a 1px border (#D8D6CE), sharp corners, dark text, minimal padding and no shadow; focus state darkens the border to #111111."
      }
    }
  }
}
```
