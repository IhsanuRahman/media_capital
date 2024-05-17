# Generated by Django 4.1.13 on 2024-05-15 06:43

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_alter_message_sended_at_alter_rooms_groupname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('2cf7db6c-41f8-4c80-81b9-ca3c7dc56338'), editable=False, max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='messages',
            field=models.ManyToManyField(related_name='messages', to='api.message'),
        ),
    ]
