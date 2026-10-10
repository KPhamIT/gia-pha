"""Ghép câu hook tiếng Việt vào ảnh Stitch (raw/<slug>.png) -> public/images/thumbs.

Quy tắc thumbnail: ảnh Stitch không có chữ, chủ thể ở bên phải; hook nằm riêng ở nửa trái
(không chồng lên hình), chữ to, rõ, 2 dòng: dòng 1 màu nâu đậm, dòng 2 màu cam nhấn.

Chạy: python scripts/thumbnails/build-thumbnails.py   (từ thư mục frontend/)
Sinh: public/images/thumbs/<kind>/<slug>.webp (1280x720) + <slug>.og.jpg (1200x630)
      lib/thumbnails/manifest.ts
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
RAW = HERE / "raw"
OUT = ROOT / "public" / "images" / "thumbs"
MANIFEST = ROOT / "lib" / "thumbnails" / "manifest.ts"

W, H = 1280, 720
TEXT_LEFT = 64
TEXT_MAX_W = int(W * 0.5) - TEXT_LEFT
FONT = "C:/Windows/Fonts/seguibl.ttf"
COLORS = [(43, 24, 16), (194, 65, 12)]  # nâu đậm, cam nhấn
KINDS = {"blog": "bai-viet", "vanKhan": "van-khan"}


def cover(im: Image.Image) -> Image.Image:
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((left, top, left + W, top + H))


def subject_left(im: Image.Image) -> int:
    """Cột đầu tiên (từ trái) có cạnh vật thể — để chữ không chồng lên hình.

    Dò cạnh cục bộ (so với cột cách 2 điểm ảnh) nên vệt sáng tối chuyển dần trên tường
    không bị tính là vật thể.
    """
    small = im.resize((W // 4, H // 4))
    px = small.load()

    def edge(x: int, y: int) -> bool:
        return sum(abs(a - b) for a, b in zip(px[x, y], px[x - 2, y])) > 40

    for x in range(4, small.width):
        busy = sum(1 for y in range(small.height) if edge(x, y))
        if busy > small.height * 0.03:
            return x * 4
    return W


def fit_font(lines: list[str], max_w: int) -> ImageFont.FreeTypeFont:
    for size in range(124, 40, -2):
        font = ImageFont.truetype(FONT, size)
        if all(font.getlength(line) <= max_w for line in lines):
            return font
    return ImageFont.truetype(FONT, 40)


MIN_SUBJECT_LEFT = 560


def make_room(im: Image.Image) -> Image.Image:
    """Nếu chủ thể lấn sang trái, dịch ảnh sang phải; phần trống lấp bằng cách kéo dài
    màu từng hàng ở mép trái (giữ liền dải bàn/tường), để chữ đứng riêng không chồng hình."""
    left = subject_left(im)
    if left >= MIN_SUBJECT_LEFT:
        return im
    shift = min(MIN_SUBJECT_LEFT - left, 260)
    canvas = Image.new("RGB", (W, H))
    edge = im.crop((0, 0, 2, H)).resize((shift + 2, H), Image.BILINEAR)
    canvas.paste(edge, (0, 0))
    canvas.paste(im.crop((0, 0, W - shift, H)), (shift, 0))
    return canvas


def draw_hook(im: Image.Image, hook: str) -> None:
    lines = hook.split("\n")
    max_w = min(TEXT_MAX_W, subject_left(im) - 64 - TEXT_LEFT)
    font = fit_font(lines, max(max_w, 300))
    line_h = int(font.size * 1.18)
    y = (H - line_h * len(lines)) // 2
    draw = ImageDraw.Draw(im)
    for index, line in enumerate(lines):
        draw.text((TEXT_LEFT, y), line, font=font, fill=COLORS[min(index, 1)])
        y += line_h


def save(im: Image.Image, kind: str, slug: str) -> None:
    folder = OUT / kind
    folder.mkdir(parents=True, exist_ok=True)
    im.save(folder / f"{slug}.webp", "WEBP", quality=82, method=6)
    og = im.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
    og.save(folder / f"{slug}.og.jpg", "JPEG", quality=85, optimize=True, progressive=True)


def write_manifest(done: dict[str, list[str]]) -> None:
    def arr(items: list[str]) -> str:
        body = "".join(f'  "{slug}",\n' for slug in sorted(items))
        return f"[\n{body}]" if items else "[]"

    MANIFEST.write_text(
        "// Tự sinh bởi scripts/thumbnails/build-thumbnails.py — không sửa tay.\n"
        f"export const BLOG_THUMBNAIL_SLUGS: readonly string[] = {arr(done['bai-viet'])};\n"
        f"export const VAN_KHAN_THUMBNAIL_SLUGS: readonly string[] = {arr(done['van-khan'])};\n",
        encoding="utf-8",
    )


def main() -> None:
    data = json.loads((HERE / "thumbnails.json").read_text(encoding="utf-8"))
    done: dict[str, list[str]] = {"bai-viet": [], "van-khan": []}
    for key, kind in KINDS.items():
        for item in data[key]:
            raw = RAW / f"{item['slug']}.png"
            if not raw.exists():
                continue
            im = make_room(cover(Image.open(raw).convert("RGB")))
            draw_hook(im, item["hook"])
            save(im, kind, item["slug"])
            done[kind].append(item["slug"])
    write_manifest(done)
    print({kind: len(slugs) for kind, slugs in done.items()})


if __name__ == "__main__":
    main()
