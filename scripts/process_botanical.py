import os
import glob
import numpy as np
from PIL import Image

brain_dir = r"C:\Users\ROG\.gemini\antigravity-ide\brain\9f05f182-1c3a-4d6a-bcbf-72f037fdd908"
out_dir = r"c:\Users\ROG\.gemini\antigravity\scratch\justus-robin-portfolio\public\assets\botanical"
os.makedirs(out_dir, exist_ok=True)

def remove_white_bg(img_path, out_path, thresh_start=205, thresh_end=235):
    im = Image.open(img_path).convert("RGB")
    arr = np.array(im, dtype=np.float32)
    H, W, _ = arr.shape

    # Minimum color value across R, G, B channels
    min_rgb = np.min(arr, axis=2)
    
    # Alpha calculation
    alpha = np.ones((H, W), dtype=np.float32)
    # Fully background (white pixels)
    alpha[min_rgb >= thresh_end] = 0.0
    
    # Smooth transition zone
    trans_mask = (min_rgb < thresh_end) & (min_rgb >= thresh_start)
    if np.any(trans_mask):
        val = (thresh_end - min_rgb[trans_mask]) / (thresh_end - thresh_start)
        alpha[trans_mask] = np.clip(val, 0.0, 1.0)
    
    # De-fringe: remove white halo on translucent pixels
    rgb_clean = arr.copy()
    edge_mask = (alpha > 0.02) & (alpha < 0.98)
    if np.any(edge_mask):
        a = alpha[edge_mask, None]
        corrected = (rgb_clean[edge_mask] - (1.0 - a) * 255.0) / np.maximum(a, 0.05)
        rgb_clean[edge_mask] = np.clip(corrected, 0, 255)

    rgba = np.dstack([rgb_clean, alpha * 255.0]).astype(np.uint8)
    out_im = Image.fromarray(rgba, "RGBA")
    out_im.save(out_path, "PNG")
    print(f"Saved {out_path} ({H}x{W})")

# Process assets
assets_map = {
    "botanical_branch_clean": "branch_main.png",
    "crimson_rose_bloom_a": "rose_bloom_1.png",
    "crimson_rose_bloom_b": "rose_bloom_2.png",
    "crimson_rose_bloom_c": "rose_bloom_3.png",
    "crimson_rosebud_closed": "rose_bud.png",
    "rose_leaves_shoots": "leaves_sprig.png",
    "botanical_secondary_shoot": "secondary_shoot.png",
    "botanical_root_base": "root_base.png",
}

for prefix, out_name in assets_map.items():
    matches = glob.glob(os.path.join(brain_dir, f"{prefix}_*.jpg"))
    if not matches:
        print(f"No match for {prefix}")
        continue
    latest_file = sorted(matches)[-1]
    out_path = os.path.join(out_dir, out_name)
    remove_white_bg(latest_file, out_path)

print("All botanical assets re-processed with cavity clearing!")
