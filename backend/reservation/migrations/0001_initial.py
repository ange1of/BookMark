# Generated by Django 3.2.4 on 2021-06-29 21:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('client', '0001_initial'),
        ('booking_object', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated', models.DateTimeField(auto_now=True, db_index=True)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('state', models.CharField(choices=[('created', 'Создано'), ('prepayment_received', 'Внесена предоплата'), ('active', 'Активно'), ('completed', 'Завершено'), ('cancelled', 'Отменено')], max_length=20, verbose_name='Состояние')),
                ('start', models.DateTimeField(verbose_name='Начало брони')),
                ('end', models.DateTimeField(verbose_name='Окончание брони')),
                ('price', models.FloatField(verbose_name='Цена')),
                ('comments', models.TextField(blank=True, max_length=300, null=True, verbose_name='Комментарии к бронированию')),
                ('booking_object', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='booking_object.bookingobject', verbose_name='Объект бронирования')),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='client.client')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
