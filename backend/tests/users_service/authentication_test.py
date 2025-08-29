import pytest
import requests
import faker

fake = faker.Faker("ru_RU")

@pytest.fixture()
def fake_data() -> dict:
	return {
		'username': '51', 
		'password': "5", 
		'email': f"51", 
		'account_status': "buyer"
	}


def test_authentication(fake_data):
	login_params = {
		'username': fake_data['username'],
		'password': fake_data['password']
	}
	login = requests.post("http://localhost/api/users/login", params=login_params)
	new_headers = {
		'X-Access-Token': login.headers['x-access-token'],
		'X-Refresh-Token': login.headers['x-refresh-token']
	}
	me = requests.get("http://localhost/api/users/me", headers=new_headers)
	assert login_params['username'] == dict(me.json())['username']

def test_logout_first(fake_data):
	headers = {
		'X-Refresh-Token': 'asdsdsd'
	}
	login_params = {
		'username': fake_data['username'],
		'password': fake_data['password']
	}
	response = requests.post("http://localhost/api/users/login?username=51&password=5", headers=headers, params=login_params)
	assert response.text == '{"detail":"logout first"}'
