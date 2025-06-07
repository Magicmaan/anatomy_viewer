import numpy as np
from openexr_numpy import imread, imwrite
from PIL import Image
import argparse
import os


def exr_to_png(exr_filepath: str, scale_factor: float = None, max_size: int = None):
    rgb_image = imread(exr_filepath)
    rgb_image_uint8 = (np.clip(rgb_image, 0, 1) * 255).astype(np.uint8)
    image = Image.fromarray(rgb_image_uint8)

    # Resize if scale_factor or max_size is provided
    if scale_factor is not None:
        new_width = int(image.width * scale_factor)
        new_height = int(image.height * scale_factor)
        image = image.resize((new_width, new_height), Image.LANCZOS)
    elif max_size is not None:
        aspect_ratio = image.width / image.height
        if image.width >= image.height:
            new_width = max_size
            new_height = int(max_size / aspect_ratio)
        else:
            new_height = max_size
            new_width = int(max_size * aspect_ratio)
        image = image.resize((new_width, new_height), Image.LANCZOS)

    png_filepath = os.path.splitext(exr_filepath)[0] + ".png"
    image.save(png_filepath)
    print(f"Saved PNG to {png_filepath}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convert .exr image to .png in the same directory, with optional scaling."
    )
    parser.add_argument("exr_filepath", type=str, help="Path to the .exr file")
    parser.add_argument(
        "--scale-factor",
        type=float,
        default=None,
        help="Scale factor for resizing (e.g., 0.5 for half size)",
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=None,
        help="Maximum size for the largest dimension (width or height)",
    )
    args = parser.parse_args()
    exr_to_png(
        args.exr_filepath, scale_factor=args.scale_factor, max_size=args.max_size
    )
