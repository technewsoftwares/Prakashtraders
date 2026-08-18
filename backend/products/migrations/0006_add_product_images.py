from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0005_product_original_price"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="image_4",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="products/",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="image_5",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="products/",
            ),
        ),
    ]
