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


import shippo

from dataclasses import dataclass
from collections import defaultdict

from orders.models import Order

@dataclass
class ShipmentOption:
    carrier: str
    service: str
    amount: float
    currency: str
    delivery_days: int | None
    rate_object_id: str

def get_cheapest_options(order: Order) -> list[ShipmentOption]:
    shipment = shippo.Shipment.create(
        address_from=order.from_adr,
        address_to=order.to_adr,
        parcels=order.package,
        asynchronous=False
    )

    rates = shipment.get("rates", [])

    # Group rates by carrier
    carrier_rates = defaultdict(list)
    for rate in rates:
        carrier = rate['provider']
        carrier_rates[carrier].append(rate)

    # Get the cheapest rate per carrier
    cheapest_per_carrier = []
    for carrier, rates_list in carrier_rates.items():
        cheapest = min(rates_list, key=lambda r: float(r['amount']))
        option = ShipmentOption(
            carrier=carrier,
            service=cheapest['servicelevel']['name'],
            amount=float(cheapest['amount']),
            currency=cheapest['currency'],
            delivery_days=cheapest.get('estimated_days'),
            rate_object_id=cheapest['object_id']
        )
        cheapest_per_carrier.append(option)

    return cheapest_per_carrier

