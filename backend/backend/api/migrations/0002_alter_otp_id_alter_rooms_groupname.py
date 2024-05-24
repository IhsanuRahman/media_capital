# Generated by Django 4.1.13 on 2024-05-17 03:34

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otp',
            name='id',
            field=models.CharField(default=uuid.UUID('f60d4d37-4f15-41c1-b516-6769e41f597f'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('2060446c-ced8-4d8a-b8df-c1ad1eccde82'), editable=False, max_length=120, unique=True),
        ),
    ]