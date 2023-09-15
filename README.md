# Idjus

Idjus é um sistema muito simples que foi desenvolvido pelo Tribunal Regional Federal da 2&ordf; Região para autenticar um usuário no GovBR e produzie um cookie com um token JWT de autenticação que pode ser utilizado por outros sistemas. Desta forma, o Idjus consegue compatibilizar o GovBR com qualquer sistema que utilize cookies para autenticação.

O Idjus é totalmente parametrizável, portanto pode ser usado por qualquer empresa que tenha interesse em produzir o mesmo resultado.

## Instalação

Configure as propriedades de ambiente:

- Cookies:
  - IDJUS_JWT_SECRET=***SUBSTITUIA_POR_UM_UUID_ALEATÓRIO***
  - IDJUS_JWT_EXPIRATION_TIME=24h
  - IDJUS_JWT_ISSUER=idjus
  - IDJUS_AUTH_COOKIE_NAME=idjus-jwt-auth
  - IDJUS_AUTH_COOKIE_DOMAIN=localhost
  - IDJUS_AUTH_COOKIE_MAX_AGE=86400
  - IDJUS_AUTH_COOKIE_HTTP_ONLY=true
  - IDJUS_REDIRECT_COOKIE_NAME=idjus-redirect

- Integração com o GovBR
  - IDJUS_GOVBR_URL_PROVIDER=https://sso.staging.acesso.gov.br
  - IDJUS_GOVBR_URL_SERVICE=https://api.staging.acesso.gov.br
  - IDJUS_GOVBR_REDIRECT_URI=callback
  - IDJUS_GOVBR_LOGIN=login
  - IDJUS_GOVBR_CLIENT_ID=***SUBSTITUA_POR_SEU_CLIENT_ID***
  - IDJUS_GOVBR_SECRET=***SUBSTITUA_POR_SEU_CLIENT_SECRET***
  - IDJUS_GOVBR_SCOPES=openid+email+phone+profile

- Informar a URL onde estará instalado o Idjus:
  - IDJUS_API_URL_BROWSER=http://localhost:8080/

## Desenvolvedor

Clone este repositório

```shell
npm install
node express.js
```

O seriviço irá rodar na porta 8080.

## Agradecimentos

O Idjus é fortemente baseado no projeto open-source de Diogo Tedesco e segue a mesma MIT License:

https://github.com/dtedesco/govbr-oauth

