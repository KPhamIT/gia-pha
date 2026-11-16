"""Vẽ mẫu sơ đồ gia phả 5 đời để trống (bản thân → kỵ) cho bài blog.

Xuất:
  frontend/public/files/so-do-gia-pha-5-doi-coinguon.pdf  (A4 ngang, in được)
  frontend/public/files/so-do-gia-pha-5-doi-coinguon.png
  frontend/public/images/blog/so-do-gia-pha-5-doi-mau-trong.webp  (ảnh xem trước trong bài)

Chạy: python frontend/scripts/blog-assets/so-do-gia-pha-5-doi.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
FILES = ROOT / "public" / "files"
BLOG = ROOT / "public" / "images" / "blog"

W, H = 2339, 1654  # A4 ngang ở 200 dpi
INK = (120, 53, 15)
LINE = (180, 83, 9)
FILL = (255, 251, 235)
MUTED = (146, 108, 70)
RULE = (214, 190, 150)

FONT_DIR = Path("C:/Windows/Fonts")


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_DIR / ("segoeuib.ttf" if bold else "segoeui.ttf")), size)


COLUMNS = [
    ("Bản thân", "(Kỷ)", ["Bản thân"]),
    ("Cha mẹ", "(Khảo – Tỷ)", ["Cha", "Mẹ"]),
    ("Ông bà", "(Tổ)", ["Ông nội", "Bà nội", "Ông ngoại", "Bà ngoại"]),
    ("Cụ", "(Tằng tổ)", ["Cụ ông", "Cụ bà"] * 4),
    ("Kỵ", "(Cao tổ)", ["Kỵ ông", "Kỵ bà"] * 8),
]
COL_W = [360, 380, 400, 420, 460]
GAP = 46
TOP, BOTTOM = 300, 1540


def main():
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)

    d.text((W // 2, 70), "SƠ ĐỒ GIA PHẢ 5 ĐỜI", font=font(64, True), fill=INK, anchor="mm")
    d.text((W // 2, 140), "Dòng họ: ........................................    Lập ngày: ........ / ........ / ............",
           font=font(30), fill=MUTED, anchor="mm")

    left = (W - sum(COL_W) - GAP * (len(COL_W) - 1)) // 2
    xs = []
    for w in COL_W:
        xs.append(left)
        left += w + GAP

    boxes = []  # boxes[col] = [(x0, y0, x1, y1)]
    for col, (name, han, labels) in enumerate(COLUMNS):
        x0, w = xs[col], COL_W[col]
        d.text((x0 + w // 2, 215), name, font=font(36, True), fill=INK, anchor="mm")
        d.text((x0 + w // 2, 258), han, font=font(26), fill=MUTED, anchor="mm")
        n = len(labels)
        slot = (BOTTOM - TOP) / n
        h = min(slot - 10, 210)
        col_boxes = []
        for i, label in enumerate(labels):
            cy = TOP + slot * (i + 0.5)
            box = (x0, int(cy - h / 2), x0 + w, int(cy + h / 2))
            col_boxes.append(box)
            d.rounded_rectangle(box, radius=10, fill=FILL, outline=LINE, width=3)
            draw_fields(d, box, label, compact=n >= 16)
        boxes.append(col_boxes)

    # Đường nối con → cha, mẹ
    for col in range(len(boxes) - 1):
        for i, child in enumerate(boxes[col]):
            parents = boxes[col + 1][2 * i: 2 * i + 2]
            cx = child[2]
            cy = (child[1] + child[3]) // 2
            mx = cx + GAP // 2
            ys = [(p[1] + p[3]) // 2 for p in parents]
            d.line([(cx, cy), (mx, cy)], fill=LINE, width=3)
            d.line([(mx, ys[0]), (mx, ys[1])], fill=LINE, width=3)
            for y, p in zip(ys, parents):
                d.line([(mx, y), (p[0], y)], fill=LINE, width=3)

    d.text((W // 2, H - 60),
           "Mẫu miễn phí từ Cội Nguồn — coinguon.io.vn · Lập gia phả online, cây gia phả tự vẽ khi nhập cha mẹ – con",
           font=font(26), fill=MUTED, anchor="mm")

    FILES.mkdir(parents=True, exist_ok=True)
    img.save(FILES / "so-do-gia-pha-5-doi-coinguon.png", optimize=True)
    img.save(FILES / "so-do-gia-pha-5-doi-coinguon.pdf", resolution=200)
    preview = img.resize((1280, round(H * 1280 / W)), Image.LANCZOS)
    preview.save(BLOG / "so-do-gia-pha-5-doi-mau-trong.webp", quality=88)
    print("saved", preview.size)


def draw_fields(d, box, label, compact):
    x0, y0, x1, y1 = box
    pad = 12
    if compact:
        d.text((x0 + pad, y0 + 6), label, font=font(20, True), fill=INK)
        d.text((x0 + 110, y0 + 6), "Họ tên:", font=font(20), fill=MUTED)
        d.line([(x0 + 185, y0 + 30), (x1 - pad, y0 + 30)], fill=RULE, width=2)
        d.text((x0 + pad, y0 + 38), "Sinh – mất:", font=font(18), fill=MUTED)
        d.line([(x0 + 115, y0 + 60), (x0 + 270, y0 + 60)], fill=RULE, width=2)
        d.text((x0 + 280, y0 + 38), "Giỗ:", font=font(18), fill=MUTED)
        d.line([(x0 + 325, y0 + 60), (x1 - pad, y0 + 60)], fill=RULE, width=2)
        return
    d.text((x0 + pad, y0 + 8), label, font=font(26, True), fill=INK)
    rows = ["Họ tên:", "Sinh – mất:", "Ngày giỗ (âm):"]
    if y1 - y0 > 180:
        rows.append("Mộ phần:")
    step = (y1 - y0 - 50) / len(rows)
    for i, text in enumerate(rows):
        y = y0 + 48 + step * i
        d.text((x0 + pad, y), text, font=font(22), fill=MUTED)
        tx = x0 + pad + d.textlength(text, font=font(22)) + 8
        d.line([(tx, y + 26), (x1 - pad, y + 26)], fill=RULE, width=2)


if __name__ == "__main__":
    main()
