from django.db import models
from django_countries.fields import CountryField

class Address(models.Model):
    street_address = models.CharField(max_length=255)
    apartment_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = CountryField()

    def __str__(self):
        return f"{self.street_address}, {self.city}"

    @property
    def as_dict(self) -> dict[str, str]:
        address = {
            "street1": self.street_address,
            "city": self.city,
            "state": self.state,
            "zip": self.postal_code,
            "country": self.country.code if hasattr(self.country, "code") else str(self.country)
        }

        if self.apartment_address:
            address["street2"] = self.apartment_address

        return address

