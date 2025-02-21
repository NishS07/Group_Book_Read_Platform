# Generated by Django 5.1.3 on 2025-01-24 10:26

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Group_Book_Reading_App', '0003_alter_group_members'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('deadline', models.DateField()),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chapters', to='Group_Book_Reading_App.group')),
                ('is_read', models.ManyToManyField(blank=True, related_name='read_chapters', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
