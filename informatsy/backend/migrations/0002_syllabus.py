# Generated by Django 3.2.4 on 2021-06-13 09:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Syllabus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('branchName', models.CharField(choices=[('CV', 'Civil'), ('ME', 'Mechanical'), ('EC', 'Electricals'), ('CS', 'Computer Science')], max_length=50)),
                ('scheme', models.CharField(default=2018, max_length=4)),
                ('branchImage', models.ImageField(upload_to='branch/')),
            ],
        ),
    ]
