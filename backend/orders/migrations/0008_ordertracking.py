from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0007_order_cashfree_order_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="OrderTracking",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("ORDER_PLACED", "Order Placed"),
                            ("CONFIRMED", "Order Confirmed"),
                            ("PACKED", "Packed"),
                            ("SHIPPED", "Shipped"),
                            ("OUT_FOR_DELIVERY", "Out for Delivery"),
                            ("DELIVERED", "Delivered"),
                            ("CANCELLED", "Cancelled"),
                        ],
                        max_length=30,
                    ),
                ),
                (
                    "message",
                    models.CharField(
                        blank=True,
                        default="",
                        max_length=255,
                    ),
                ),
                (
                    "tracking_number",
                    models.CharField(
                        blank=True,
                        max_length=100,
                        null=True,
                    ),
                ),
                (
                    "carrier",
                    models.CharField(
                        blank=True,
                        max_length=100,
                        null=True,
                    ),
                ),
                (
                    "location",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tracking_updates",
                        to="orders.order",
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),
    ]
