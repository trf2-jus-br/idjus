import * as jose from 'jose'

// Precisei colocar a inicialização do process.env aqui pois é carregado antes do index.js
import dotenv from 'dotenv-flow';
dotenv.config();

export default {
    secret: new TextEncoder().encode(process.env.IDJUS_JWT_SECRET),

    alg: 'HS256',

    async buildJwt(payload) {
        return await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: this.alg })
            .setIssuedAt()
            .setIssuer(process.env.IDJUS_JWT_ISSUER)
            .setExpirationTime(process.env.IDJUS_JWT_EXPIRATION_TIME)
            .sign(this.secret)
    },

    async parseJwt(jwt) {
        const { payload, protectedHeader } = await jose.jwtVerify(jwt, this.secret, {
            issuer: process.env.IDJUS_JWT_ISSUER,
        })

        return payload
    }
}