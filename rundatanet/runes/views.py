from django.http import HttpResponse
from django.shortcuts import render

def mytest(request):
    #inscriptions = Signature.objects.filter(parent__isnull=True)
    #context = {'inscriptions': inscriptions}
    return render(request, 'runes/one.html', {})

