from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0007_product_indexes"),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name="product",
            name="products_cat_active_idx",
        ),
        migrations.RemoveIndex(
            model_name="product",
            name="products_brand_active_idx",
        ),
        migrations.RemoveIndex(
            model_name="product",
            name="products_best_active_idx",
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["category", "is_active"],
            ),
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["brand", "is_active"],
            ),
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["is_best_product", "is_active"],
            ),
        ),
    ]
