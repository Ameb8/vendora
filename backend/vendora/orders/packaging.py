from py3dbp import Packer, Bin, Item

from products.models import Size

from typing import Optional


def get_min_package(sizes: list[Size], max_dim_limit=200, step=5) -> Optional[dict[str, any]]:
    if not sizes:
        return None

    # Calculate starting point: max dimensions of individual items
    max_w = max(size.width_in for size in sizes)
    max_h = max(size.height_in for size in sizes)
    max_d = max(size.depth_in for size in sizes)
    total_weight = sum(size.weight_oz for size in sizes)

    # Start with box just large enough to fit the largest item
    width = max_w
    height = max_h
    depth = max_d

    while width <= max_dim_limit and height <= max_dim_limit and depth <= max_dim_limit:
        packer = Packer()
        bin_name = f"Box {width}x{height}x{depth}"

        # Add candidate box
        packer.add_bin(Bin(bin_name, width, height, depth, total_weight + 10))

        # Add items
        for i, size in enumerate(sizes):
            packer.add_item(Item(
                name=f"Item-{i}",
                width=size.width_in,
                height=size.height_in,
                depth=size.depth_in,
                weight=size.weight_lb
            ))

        # Try packing
        packer.pack()

        for b in packer.bins:
            if len(b.items) == len(sizes):
                return {
                    "length": round(b.depth, 2),   # Use 'depth' as 'length'
                    "width": round(b.width, 2),
                    "height": round(b.height, 2),
                    "distance_unit": "in",
                    "weight": round(sum(item.weight for item in b.items), 2),
                    "mass_unit": "lb"
                }

        # Increase dimensions and try again
        width += step
        height += step
        depth += step

    return None

