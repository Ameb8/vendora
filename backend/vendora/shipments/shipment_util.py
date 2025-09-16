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


def usps_shipping(from_zip: str, to_zip: str, weight_lbs: int, weight_oz: int, len: int, width: int, height: int) -> dict[str, any]:
    xml_request = f"""
    <RateV4Request USERID="{USPS_USER_ID}">
        <Revision>2</Revision>
        <Package ID="1ST">
            <Service>ALL</Service>
            <ZipOrigination>{from_zip}</ZipOrigination>
            <ZipDestination>{to_zip}</ZipDestination>
            <Pounds>{weight_lbs}</Pounds>
            <Ounces>{weight_oz}</Ounces>
            <Container>RECTANGULAR</Container>
            <Size>REGULAR</Size>
            <Width>{width}</Width>
            <Length>{length}</Length>
            <Height>{height}</Height>
            <Machinable>true</Machinable>
        </Package>
    </RateV4Request>
    """

    params = {
        'API': 'RateV4',
        'XML': xml_request
    }

    response = requests.get(USPS_API_URL, params=params)

    if response.status_code != 200:
        raise Exception(f"USPS API error: {response.status_code}")

    rates = []
    root = ET.fromstring(response.content)
    for postage in root.findall('.//Postage'):
        service_name = postage.find('MailService').text
        rate = postage.find('Rate').text
        rates.append({
            'service': service_name,
            'rate': float(rate)
        })

    return rates


