# Generated by Django 5.0.5 on 2024-05-07 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_usermodel_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='profile',
            field=models.ImageField(default='/user_profile/profile.png', upload_to=''),
        ),
    ]
