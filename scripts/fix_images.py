"""
One-off image cleanup:
  1. Remove the white background from the product bag photos (flood-fill from the
     borders so white elements *inside* the bag are preserved).
  2. Build a square, fully-black favicon so macOS doesn't render white corners.
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "public" / "image"


def remove_white_background(src: Path, dst: Path, thresh: int = 200) -> None:
    """Flood-fill near-white pixels connected to the border and make them transparent."""
    im = Image.open(src).convert("RGBA")
    arr = np.asarray(im).astype(np.int16)
    h, w = arr.shape[:2]

    # candidate = near-white (min channel above threshold)
    cand = arr[:, :, :3].min(axis=2) > thresh

    visited = np.zeros((h, w), dtype=bool)
    dq = deque()

    def seed(y, x):
        if cand[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))

    for x in range(w):
        seed(0, x); seed(h - 1, x)
    for y in range(h):
        seed(y, 0); seed(y, w - 1)

    while dq:
        y, x = dq.popleft()
        if y > 0:     seed(y - 1, x)
        if y < h - 1: seed(y + 1, x)
        if x > 0:     seed(y, x - 1)
        if x < w - 1: seed(y, x + 1)

    out = np.asarray(im).copy()
    out[visited, 3] = 0
    Image.fromarray(out, "RGBA").save(dst)
    print(f"  bg removed: {dst.name}  ({visited.sum()} px cleared)")


def make_favicon(logo_src: Path, dst: Path, size: int = 256,
                 bg=(13, 13, 13, 255), pad_ratio: float = 0.12) -> None:
    """Gold emblem (white bg stripped) centered on a solid dark square."""
    im = Image.open(logo_src).convert("RGBA")
    arr = np.asarray(im).astype(np.int16)
    h, w = arr.shape[:2]
    # strip the white background of the logo
    cand = arr[:, :, :3].min(axis=2) > 200
    visited = np.zeros((h, w), dtype=bool)
    dq = deque()

    def seed(y, x):
        if cand[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))

    for x in range(w):
        seed(0, x); seed(h - 1, x)
    for y in range(h):
        seed(y, 0); seed(y, w - 1)
    while dq:
        y, x = dq.popleft()
        if y > 0:     seed(y - 1, x)
        if y < h - 1: seed(y + 1, x)
        if x > 0:     seed(y, x - 1)
        if x < w - 1: seed(y, x + 1)
    rgba = np.asarray(im).copy()
    rgba[visited, 3] = 0
    emblem = Image.fromarray(rgba, "RGBA")

    # crop to the emblem's bounding box
    bbox = emblem.getbbox()
    if bbox:
        emblem = emblem.crop(bbox)

    # scale to fit inside the padded square
    inner = int(size * (1 - 2 * pad_ratio))
    ew, eh = emblem.size
    scale = min(inner / ew, inner / eh)
    emblem = emblem.resize((max(1, int(ew * scale)), max(1, int(eh * scale))), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), bg)
    ox = (size - emblem.size[0]) // 2
    oy = (size - emblem.size[1]) // 2
    canvas.alpha_composite(emblem, (ox, oy))
    canvas.save(dst)
    print(f"  favicon written: {dst.name} ({size}x{size})")


if __name__ == "__main__":
    remove_white_background(IMG / "bolsa small.webp", IMG / "bolsa small.webp")
    remove_white_background(IMG / "bolsa-nueva-golden.png", IMG / "bolsa-nueva-golden.png")
    make_favicon(IMG / "logo.webp", IMG / "favicon.png")
