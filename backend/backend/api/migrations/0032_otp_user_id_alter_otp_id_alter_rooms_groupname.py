# Generated by Django 4.1.13 on 2024-05-15 10:11

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_otp_alter_rooms_groupname'),
    ]

    operations = [
        migrations.AddField(
            model_name='otp',
            name='user_id',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='api.tempuser'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='otp',
            name='id',
            field=models.CharField(default=uuid.UUID('53a8401a-b704-45e2-88c6-9d12d64c06e4'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('6d8fa94c-e971-4bb2-ac60-84afa33d22d6'), editable=False, max_length=120, unique=True),
        ),
    ]