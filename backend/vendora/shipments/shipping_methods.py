from abc import ABC, abstractmethod
from typing import List, Dict
from orders.models import Order


class ShipmentMethod(ABC):
    def __init__(self, order: Order, config: Dict):
        self.order = order
        self.config = config or {}

    @abstractmethod
    def get_options(self) -> List[Dict]:
        """Return available shipping options based on the tenant and order details."""
        pass

    @property
    @abstractmethod
    def calculate_cost(self) -> float:
        """Calculate and return the shipping cost based on the order details."""
        pass

    @abstractmethod
    def make_shipment(self, shipping_option: str) -> str:
        """Make a shipment based on the selected shipping option (returns a shipment tracking ID)."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Provide short description of shipping method"""
        pass

class FlatPriceShipping(ShipmentMethod):
    def get_options(self) -> List[Dict]:
        return [{
            "Cost": self.config.get("flat_rate", 10)
        }]

    @staticmethod
    def get_config_schema() -> dict:
        return {
            "flat_rate": {
                "type": "float",
                "label": "Flat Rate",
                "default": 10.0,
                "required": True,
                "help_text": "Enter the flat shipping rate for all orders."
            }
        }

class