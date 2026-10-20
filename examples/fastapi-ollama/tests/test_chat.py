import json
import httpx
import pytest
from fastapi.testclient import TestClient
from app.config import Settings
from app.main import create_app


def client_for(handler):
    return TestClient(create_app(Settings(), transport=httpx.MockTransport(handler)))


def test_success_and_upstream_contract():
    def upstream(request):
        assert request.url.path == '/api/chat'
        body = json.loads(request.content)
        assert body == {'model': 'llama3.2:3b', 'stream': False,
                        'messages': [{'role': 'user', 'content': 'Olá'}]}
        return httpx.Response(200, json={'message': {'content': 'Olá, estudante!'}})
    with client_for(upstream) as client:
        result = client.post('/api/chat', json={'message': '  Olá  '})
        assert result.status_code == 200
        assert result.json() == {'answer': 'Olá, estudante!', 'model': 'llama3.2:3b'}
        assert client.get('/health').json() == {'status': 'ok'}


@pytest.mark.parametrize('body', [{}, {'message': ''}, {'message': '  '},
                                  {'message': 'a' * 4001}, {'message': 10},
                                  {'message': 'ok', 'url': 'http://example.com'}])
def test_invalid_input_never_calls_model(body):
    def upstream(_):
        pytest.fail('Ollama não deve ser chamado para entrada inválida')
    with client_for(upstream) as client:
        assert client.post('/api/chat', json=body).status_code == 422


@pytest.mark.parametrize('failure,status', [
    (httpx.ReadTimeout('internal-secret'), 504),
    (httpx.ConnectError('internal-secret'), 503),
])
def test_transport_failures(failure, status):
    def upstream(_):
        raise failure
    with client_for(upstream) as client:
        response = client.post('/api/chat', json={'message': 'Olá'})
        assert response.status_code == status
        assert 'internal-secret' not in response.text


@pytest.mark.parametrize('response', [
    httpx.Response(500, text='internal-secret'),
    httpx.Response(200, text='not json'),
    httpx.Response(200, json={}),
    httpx.Response(200, json={'message': {'content': 123}}),
    httpx.Response(200, json={'message': {'content': '   '}}),
    httpx.Response(200, json=['invalid']),
])
def test_invalid_upstream_becomes_safe_bad_gateway(response):
    with client_for(lambda _: response) as client:
        result = client.post('/api/chat', json={'message': 'Olá'})
        assert result.status_code == 502
        assert result.json() == {'detail': 'Resposta inválida do serviço de modelo.'}
        assert 'internal-secret' not in result.text


@pytest.mark.parametrize('settings', [dict(base_url='file:///etc/passwd'),
                                      dict(timeout_seconds=0),
                                      dict(model=''), dict(timeout_seconds=9999)])
def test_invalid_configuration(settings):
    with pytest.raises(ValueError):
        Settings(**settings)
