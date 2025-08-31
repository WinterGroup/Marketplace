import requests
import pytest

@pytest.fixture()
def get_access():
	login = {'username': '51', 'password': '123456'}
	response = requests.post("http://localhost/api/users/login", params=login)
	return response.headers['X-Access-Token']

@pytest.fixture()
def get_product():
	return {
		'id': 2,
		'username': '51',
		'description': 'Test product',
		'category': 'test',
		'price': 1000
	}

def test(get_access, get_product):
	headers = {'X-Access-Token': get_access}
	response = requests.post("http://localhost/api/products/create", params=get_product, headers=headers)
	assert 1==1
