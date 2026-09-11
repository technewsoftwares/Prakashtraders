from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0006_add_product_images"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.CharField(
                max_length=100,
                db_index=True,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="brand",
            field=models.CharField(
                max_length=100,
                blank=True,
                db_index=True,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="is_active",
            field=models.BooleanField(
                default=True,
                db_index=True,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="is_best_product",
            field=models.BooleanField(
                default=False,
                db_index=True,
            ),
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["category", "is_active"],
                name="products_cat_active_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["brand", "is_active"],
                name="products_brand_active_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="product",
            index=models.Index(
                fields=["is_best_product", "is_active"],
                name="products_best_active_idx",
            ),
        ),
    ]
