from .shipment_util import get_box_size
from orders.models import Order
from products.models import Size
import shippo

class ShipOption():
    def __init__(self, options: dict[str, str]):
        self.provider: str = options["provider"]
        self.provider_img: str = options["provider_image_200"]
        self.price: str = options["price"]
        self.currency: str = options["currency"]
        self.days: str = options["estimated_days"]

def get_options(order: Order, to_adr: dict[str, str], from_adr: dict[str, str], num=3):
    box: Size = get_box_size(order)

    shipment = shippo.Shipment.create(
        address_from=from_adr,
        address_to=to_adr,
        parcls=[{
            "length": box.depth_cm,
            "width": box.width_cm,
            "height": box.height_cm,
            "distance_unit": "cm",
            "weight": box.weight_oz,
            "mass_unit": "oz",
        }]
    )
