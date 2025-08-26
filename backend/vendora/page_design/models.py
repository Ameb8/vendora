from django.db import models
from ordered_model.models import OrderedModel
from cloudinary.models import CloudinaryField
from tenants.models import Tenant

class PageDesign(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE)
    about_us_title = models.CharField(max_length=50)
    about_us_body = models.CharField(max_length=500)
    contact_num = models.CharField(max_length=20)
    contact_mail = models.CharField(max_length=60)

class DesignImage(models.Model):
    image = CloudinaryField('image', folder='page-design')
    alt_text = models.CharField(max_length=255)

class ImageList(models.Model):
    LIST_CHOICES = [
        ('about', 'About'),
        ('contact', 'Contact'),
    ]
    name = models.CharField(max_length=20, choices=LIST_CHOICES, unique=True)

class ImageInList(OrderedModel):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    image = models.ForeignKey(DesignImage, on_delete=models.CASCADE)
    image_list = models.ForeignKey(ImageList, on_delete=models.CASCADE)

    class Meta(OrderedModel.Meta):
        unique_together = ('tenant', 'image_list', 'image')
        ordering = ['tenant', 'image_list', 'order']
