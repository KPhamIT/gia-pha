#!/usr/bin/env python3
"""Add coinguon bottom-right watermark (logo + domain) to khung SVG frames."""

from __future__ import annotations

import re
from pathlib import Path

KHUNG_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "khung"
DOMAIN = "https://www.coinguon.io.vn/"
REF_W = 11693.0


def parse_viewbox(svg: str) -> tuple[float, float]:
    match = re.search(r'viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"', svg)
    if not match:
        raise ValueError("viewBox not found")
    return float(match.group(1)), float(match.group(2))


def remove_old_branding(svg: str) -> str:
    svg = re.sub(
        r'\s*<g id="coinguon-brand"[^>]*>[\s\S]*?</g>\s*',
        "\n",
        svg,
        count=1,
    )
    svg = re.sub(
        r'<text\b[^>]*>\s*MyTree\.vn\s*</text>\s*',
        "",
        svg,
        flags=re.IGNORECASE,
    )
    svg = re.sub(
        r'<text\b[^>]*>\s*Designed by MyTree\.vn\s*</text>\s*',
        "",
        svg,
        flags=re.IGNORECASE | re.DOTALL,
    )
    svg = re.sub(
        r'<text\b[^>]*>\s*https?://www\.coinguon\.io\.vn/?\s*</text>\s*',
        "",
        svg,
        flags=re.IGNORECASE,
    )
    svg = re.sub(
        r'<text\b[^>]*>\s*www\.coinguon\.io\.vn\s*</text>\s*',
        "",
        svg,
        flags=re.IGNORECASE,
    )
    return svg


def make_brand(width: float, height: float) -> str:
    scale = width / REF_W
    margin_right = 48 * scale
    margin_bottom = 36 * scale
    font_size = 92 * scale
    logo_size = 72 * scale
    gap = 12 * scale
    radius = 10 * scale
    text_width = len(DOMAIN) * 0.55 * font_size
    anchor_x = width - margin_right
    anchor_y = height - margin_bottom
    logo_x = -text_width - gap - logo_size
    logo_y = -logo_size * 0.88
    logo_cx = logo_x + logo_size / 2
    logo_cy = logo_y + logo_size * 0.68
    logo_font = logo_size * 0.67

    return f"""<g id="coinguon-brand" data-export-ignore="true">
  <g transform="translate({anchor_x:.2f},{anchor_y:.2f})">
    <rect x="{logo_x:.2f}" y="{logo_y:.2f}" width="{logo_size:.2f}" height="{logo_size:.2f}" rx="{radius:.2f}" fill="#78350f"/>
    <text x="{logo_cx:.2f}" y="{logo_cy:.2f}" font-size="{logo_font:.2f}" fill="#fef3c7" text-anchor="middle" font-family="serif" font-weight="700">家</text>
    <text x="0" y="0" font-size="{font_size:.2f}" fill="#FF8C00" font-family="Arial" text-anchor="end" dominant-baseline="auto">{DOMAIN}</text>
  </g>
</g>"""


def process_file(path: Path) -> None:
    svg = path.read_text(encoding="utf-8", errors="replace")
    svg = remove_old_branding(svg)
    width, height = parse_viewbox(svg)
    brand = make_brand(width, height)
    if "</svg>" not in svg:
        raise ValueError(f"{path.name}: missing </svg>")
    svg = svg.replace("</svg>", f"{brand}\n</svg>", 1)
    path.write_text(svg, encoding="utf-8")
    print(f"OK {path.name} ({width:.0f}x{height:.0f})")


def main() -> None:
    for path in sorted(KHUNG_DIR.glob("khung*.svg")):
        process_file(path)


if __name__ == "__main__":
    main()
