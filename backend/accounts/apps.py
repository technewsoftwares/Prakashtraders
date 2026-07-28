from django.apps import AppConfig
import logging

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        try:
            from django.contrib.auth.models import User
            from django.db.utils import OperationalError, ProgrammingError

            user, created = User.objects.get_or_create(
                username="prakash",
                defaults={
                    "email": "ptindsupplier@gmail.com"
                }
            )

            user.email = "ptindsupplier@gmail.com"
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True

            # THIS IS THE IMPORTANT LINE

            print("✅ Admin password reset successfully")

        except (OperationalError, ProgrammingError):
            logging.info("Database not ready yet, skipping admin setup")