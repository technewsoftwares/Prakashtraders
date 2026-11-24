
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_alter_wishlist_unique_together_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CorporateEnquiry',
            fields=[
                ('id', models.BigAutoField(
                    auto_created=True,
                    primary_key=True,
                    serialize=False,
                    verbose_name='ID'
                )),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('company', models.CharField(blank=True, max_length=150)),
                ('enquiry_type', models.CharField(
                    choices=[
                        ('Corporate Gifting', 'Corporate Gifting'),
                        ('Institutional Supply', 'Institutional Supply'),
                        ('Furniture Solutions', 'Furniture Solutions'),
                        ('General', 'General'),
                    ],
                    default='General',
                    max_length=50
                )),
                ('message', models.TextField()),
                ('status', models.CharField(
                    choices=[
                        ('New', 'New'),
                        ('Contacted', 'Contacted'),
                        ('Completed', 'Completed'),
                    ],
                    default='New',
                    max_length=20
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
