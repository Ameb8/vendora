from dataclasses import dataclass
from py3dbp import Packer, Bin, Item
from products.models import Product, Size
from orders.models import Order



def get_objs(order: Order) -> list[Size]:
    return [prod.size for prod in order.products]



def can_pack(items, box_w, box_h, box_d, max_weight=10000):
    # Create a bin of given dimensions and max weight
    bin = Bin('bin1', box_w, box_h, box_d, max_weight)
    packer = Packer()
    packer.add_bin(bin)

    # Add all items
    for it in items:
        packer.add_item(it)

    packer.pack()
    # Check if all items fit in bin1
    return len(bin.items) == len(items)


def find_min_box(items: list[Size], max_weight=10000, step=10, max_dim=1000) -> Size:
    # Start from max single dimension of any item
    min_w = max(it.width_cm for it in items)
    min_h = max(it.height_cm for it in items)
    min_d = max(it.depth_cm for it in items)

    # Start searching for minimum box by increasing dimensions
    w = min_w

    while w <= max_dim:
        h = min_h
        while h <= max_dim:
            d = min_d
            while d <= max_dim:
                if can_pack(items, w, h, d, max_weight):
                    return Size(h, w, d, sum(it.weight_oz for it in items))
                d += step
            h += step
        w += step

    return None  # no solution found within limits

def get_box_size(order: Order) -> Size:
    return find_min_box(get_objs(order))



