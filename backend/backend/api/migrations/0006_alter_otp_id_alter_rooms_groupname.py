# Generated by Django 4.1.13 on 2024-05-17 04:13

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_otp_alter_rooms_groupname_tempuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otp',
            name='id',
            field=models.CharField(default=uuid.UUID('0f725c44-229c-48d7-bbef-b01ce7b95c62'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('2568834a-2379-4ae0-9bea-17e910ae9fe1'), editable=False, max_length=120, unique=True),
        ),
    ]