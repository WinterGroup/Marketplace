from faker import Faker
import requests
import unittest

class TestIndex(unittest.TestCase):
    fake = Faker()
    payload = {'username': fake.name(),'email': fake.name(),'password': fake.name()}
    def test_main(self):
        register = requests.post("http://localhost:8080/api/auth/register", params=self.payload)
        index = requests.get("http://localhost:8080/api/", cookies=register.cookies)
        self.assertEqual(index.text, f'"welcome, {self.payload['username']}!"')

if __name__ == '__main__':
    unittest.main()
