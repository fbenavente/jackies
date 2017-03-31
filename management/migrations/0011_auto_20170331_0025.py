# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2017-03-31 00:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0010_background'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='status',
            field=models.IntegerField(blank=True, choices=[(1, 'active'), (2, 'inactive'), (3, 'internal')], default=1, null=True),
        ),
    ]
