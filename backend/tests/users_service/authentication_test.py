import pytest
import requests
import faker

fake = faker.Faker("ru_RU")

def generateData() -> dict:
	return {
		'username': str(fake.name()), 
		'password': "rand12312", 
		'email': f"{fake.name()}@fake.com", 
		'account_status': "buyer"
	}


def test_authentication():
	fake_data = generateData()

	login_params = {
		'username': fake_data['username'],
		'password': fake_data['password']
	}
	register = requests.post("http://localhost/api/users/register", params=fake_data)
	login = requests.post("http://localhost/api/users/login", params=login_params)
	new_headers = {
		'X-Access-Token': login.headers['x-access-token'],
		'X-Refresh-Token': login.headers['x-refresh-token']
	}
	me = requests.get("http://localhost/api/users/me", headers=new_headers)
	assert login_params['username'] == dict(me.json())['username']
