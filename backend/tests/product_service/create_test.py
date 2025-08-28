import requests
import pytest

@pytest.fixture()
def get_access():
	login = {'username': '51', 'password': '5'}
	response = requests.post("http://localhost/api/users/login", params=login)
	return response.headers['X-Access-Token']

def test(get_access):
	headers = {'X-Access-Token': get_access}
	product = {'name': 'test product', 'price': 100}
	response = requests.post("http://localhost/api/products/create", params=product, headers=headers)
	assert '{"username":"51","name":"test product","price":100}' == response.text
