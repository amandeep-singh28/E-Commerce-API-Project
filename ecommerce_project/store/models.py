from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length = 100)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length = 200)
    price = models.FloatField()
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete = models.CASCADE)

    def __str__(self):
        return self.name

