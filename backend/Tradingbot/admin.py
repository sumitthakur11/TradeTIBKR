from django.contrib import admin
from . import models as md 

# Register your models here.

class Broker(admin.ModelAdmin):
     list_display=  [field.name for field in md.Broker._meta.get_fields()]
class order(admin.ModelAdmin):
     list_display=  [field.name for field in md.orderobject._meta.get_fields()]
class Postions(admin.ModelAdmin):
     list_display=  [field.name for field in md.Allpositions._meta.get_fields()]

class holding(admin.ModelAdmin):
     list_display=  [field.name for field in md.allholding._meta.get_fields()]
 
class LogEntry(admin.ModelAdmin):
     list_display=  [field.name for field in md.LogEntry._meta.get_fields()]

admin.site.register(md.Broker,Broker)
admin.site.register(md.orderobject,order)
admin.site.register(md.allholding,holding)
admin.site.register(md.Allpositions,Postions)
admin.site.register(md.LogEntry, LogEntry)






