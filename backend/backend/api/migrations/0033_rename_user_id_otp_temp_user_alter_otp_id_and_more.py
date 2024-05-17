# Generated by Django 4.1.13 on 2024-05-15 10:20

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_otp_user_id_alter_otp_id_alter_rooms_groupname'),
    ]

    operations = [
        migrations.RenameField(
            model_name='otp',
            old_name='user_id',
            new_name='temp_user',
        ),
        migrations.AlterField(
            model_name='otp',
            name='id',
            field=models.CharField(default=uuid.UUID('ff34626f-67df-4941-af2d-f54eb750767f'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('505bd7f3-bb12-46e7-b69b-ad27f5b50732'), editable=False, max_length=120, unique=True),
        ),
    ]
