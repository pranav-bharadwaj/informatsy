# Generated by Django 3.2.4 on 2021-06-13 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_syllabus'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='syllabus',
            name='id',
        ),
        migrations.AlterField(
            model_name='syllabus',
            name='branchName',
            field=models.CharField(choices=[('CV', 'Civil'), ('ME', 'Mechanical'), ('EC', 'Electricals'), ('CS', 'Computer Science')], max_length=50, primary_key=True, serialize=False, unique=True),
        ),
    ]
