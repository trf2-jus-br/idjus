import jwt from './jwt.js';
import express from 'express';
import { govbrOauth } from 'govbr-oauth';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const port = 8081;

// Paramentos de configuração fornecidos pelo GOV.BR
const config = {
    URL_PROVIDER: process.env.IDJUS_GOVBR_URL_PROVIDER,
    URL_SERVICE: process.env.IDJUS_GOVBR_URL_SERVICE,
    REDIRECT_URI: process.env.API_URL_BROWSER + process.env.IDJUS_GOVBR_REDIRECT_URI,
    SCOPES: process.env.IDJUS_GOVBR_SCOPES,
    CLIENT_ID: process.env.IDJUS_GOVBR_CLIENT_ID,
    SECRET: process.env.IDJUS_GOVBR_SECRET
};

app.get('/' + process.env.IDJUS_GOVBR_LOGIN, (req, res, next) => {
    try {
        // Acrescenta um cookie indicando a URL de retorno
        res.cookie(process.env.IDJUS_REDIRECT_COOKIE_NAME, req.query.redirect, {
            maxAge: process.env.IDJUS_AUTH_COOKIE_MAX_AGE,
            httpOnly: process.env.IDJUS_AUTH_COOKIE_HTTP_ONLY === 'true',
            domain: process.env.IDJUS_AUTH_COOKIE_DOMAIN
        });

        // Gera a url de autenticação
        const url = govbrOauth.authorize(config) || "";
        res.redirect(url);
    } catch (error) {
        next(error)
    }
});

app.get('/' + process.env.IDJUS_GOVBR_REDIRECT_URI, async(req, res, next) => {
    try {
        // Obtem o token
        const code = req.query.code;
        const token = await govbrOauth.getToken(config, code);

        // Obtem o tipo de selo
        const access_level = await govbrOauth.getCredentialType(config, token.access_token);
        token.access_level = access_level;

        // Constrói o JWT e grava o cookie
        const authCookie = await jwt.buildJwt({
            "sub": token.claims.sub,
            "mod": null,
            "auth": "auth",
            "iss": process.env.IDJUS_JWT_ISSUER,
        })
        res.cookie(process.env.IDJUS_AUTH_COOKIE_NAME, authCookie, {
            maxAge: process.env.IDJUS_AUTH_COOKIE_MAX_AGE,
            httpOnly: process.env.IDJUS_AUTH_COOKIE_HTTP_ONLY === 'true',
            domain: process.env.IDJUS_AUTH_COOKIE_DOMAIN
        });

        // Redireciona de volta para a aplicação que fez a chamada
        const urlToRedirect = req.cookies[process.env.IDJUS_REDIRECT_COOKIE_NAME]
        res.clearCookie(process.env.IDJUS_REDIRECT_COOKIE_NAME);
        res.redirect(urlToRedirect);
    } catch (error) {
        next(error)
    }
});

app.listen(port, () => console.log(`Idjus rodando na porta ${port}!`));