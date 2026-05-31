from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Note
from .serializers import NoteSerializer


@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello from Django!'})


@api_view(['GET', 'POST'])
def notes(request):
    if request.method == 'GET':
        all_notes = Note.objects.all().order_by('-created_at')
        serializer = NoteSerializer(all_notes, many=True)
        return Response(serializer.data)

    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
