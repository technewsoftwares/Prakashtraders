from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0005_order_mobile"),
    ]

    operations = [
        migrations.AddField(
            model_name="orderitem",
            name="product_image",
            field=models.URLField(
                blank=True,
                max_length=1000,
                null=True,
            ),
        ),
    ]
