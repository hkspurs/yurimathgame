import sys
import os
from PIL import Image
import numpy as np

def process_sprite(src_path, dst_path):
    try:
        img = Image.open(src_path).convert('RGBA')
        data = np.array(img)
        r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
        
        # Soft threshold for solid white background
        white_mask = (r > 240) & (g > 240) & (b > 240)
        data[white_mask, 3] = 0
        
        result = Image.fromarray(data).resize((256, 256), Image.Resampling.LANCZOS)
        result.save(dst_path)
        print(f"Processed: {src_path} -> {dst_path}")
        return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        process_sprite(sys.argv[1], sys.argv[2])
