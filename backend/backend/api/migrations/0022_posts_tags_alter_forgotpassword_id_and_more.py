# Generated by Django 4.1.13 on 2024-05-20 08:23

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_forgotpassword_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='tags',
            field=models.ManyToManyField(related_name='posts', to='api.tags'),
        ),
        migrations.AlterField(
            model_name='forgotpassword',
            name='id',
            field=models.CharField(default=uuid.UUID('41619cf5-9d8e-4959-b593-29e228981a37'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='forgotpassword',
            name='secondary_code',
            field=models.CharField(default=uuid.UUID('0fc1df34-5b84-4a88-ab47-be309e98a67b'), editable=False, max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='otp',
            name='id',
            field=models.CharField(default=uuid.UUID('a9d81e73-b140-499a-8502-4927c61eec41'), editable=False, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='rooms',
            name='groupName',
            field=models.CharField(default=uuid.UUID('bb35d0bb-5762-4c92-9088-e6f8e1694758'), editable=False, max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='usermodel',
            name='profile',
            field=models.ImageField(default='/user_profiles/profile.png', upload_to='user_profiles'),
        ),
    ]