from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Note

# CI smoke test — safe to remove


class HelloEndpointTest(APITestCase):
    def test_returns_message(self):
        res = self.client.get('/api/hello/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['message'], 'Hello from Django!')


class LoginTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('alice', password='correct')

    def test_valid_credentials_return_token_and_username(self):
        res = self.client.post('/api/login/', {'username': 'alice', 'password': 'correct'})
        self.assertEqual(res.status_code, 200)
        self.assertIn('token', res.data)
        self.assertEqual(res.data['username'], 'alice')

    def test_invalid_credentials_return_400(self):
        res = self.client.post('/api/login/', {'username': 'alice', 'password': 'wrong'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('error', res.data)

    def test_missing_credentials_return_400(self):
        res = self.client.post('/api/login/', {})
        self.assertEqual(res.status_code, 400)

    def test_login_creates_token_on_first_call(self):
        self.client.post('/api/login/', {'username': 'alice', 'password': 'correct'})
        self.assertTrue(Token.objects.filter(user=self.user).exists())

    def test_repeated_login_reuses_same_token(self):
        res1 = self.client.post('/api/login/', {'username': 'alice', 'password': 'correct'})
        res2 = self.client.post('/api/login/', {'username': 'alice', 'password': 'correct'})
        self.assertEqual(res1.data['token'], res2.data['token'])


class LogoutTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('bob', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_logout_deletes_token_and_returns_204(self):
        res = self.client.post('/api/logout/')
        self.assertEqual(res.status_code, 204)
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    def test_logout_without_auth_returns_401(self):
        self.client.credentials()
        res = self.client.post('/api/logout/')
        self.assertEqual(res.status_code, 401)


class NotesTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('carol', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_notes_returns_200_and_list(self):
        Note.objects.create(content='first note')
        Note.objects.create(content='second note')
        res = self.client.get('/api/notes/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 2)

    def test_get_notes_returns_newest_first(self):
        Note.objects.create(content='older')
        Note.objects.create(content='newer')
        res = self.client.get('/api/notes/')
        self.assertEqual(res.data[0]['content'], 'newer')

    def test_get_notes_without_auth_returns_401(self):
        self.client.credentials()
        res = self.client.get('/api/notes/')
        self.assertEqual(res.status_code, 401)

    def test_post_note_creates_note_and_returns_201(self):
        res = self.client.post('/api/notes/', {'content': 'a new note'})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Note.objects.count(), 1)
        self.assertEqual(res.data['content'], 'a new note')

    def test_post_note_without_content_returns_400(self):
        res = self.client.post('/api/notes/', {})
        self.assertEqual(res.status_code, 400)

    def test_post_note_without_auth_returns_401(self):
        self.client.credentials()
        res = self.client.post('/api/notes/', {'content': 'sneaky'})
        self.assertEqual(res.status_code, 401)


class NoteDetailTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('dave', password='pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.note = Note.objects.create(content='to be deleted')

    def test_delete_existing_note_returns_204(self):
        res = self.client.delete(f'/api/notes/{self.note.pk}/')
        self.assertEqual(res.status_code, 204)
        self.assertFalse(Note.objects.filter(pk=self.note.pk).exists())

    def test_delete_without_auth_returns_401(self):
        self.client.credentials()
        res = self.client.delete(f'/api/notes/{self.note.pk}/')
        self.assertEqual(res.status_code, 401)
        self.assertTrue(Note.objects.filter(pk=self.note.pk).exists())

    def test_delete_nonexistent_note_returns_404(self):
        res = self.client.delete('/api/notes/99999/')
        self.assertEqual(res.status_code, 404)
