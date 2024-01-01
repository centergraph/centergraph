import '../polyfills/node.ts'

import Provider, { errors } from 'oidc-provider'

import { jwks } from '../Base.ts'

export const createProvider = (baseIRI: string) => {
  // https://www.scottbrady91.com/openid-connect/getting-started-with-oidc-provider
  const corsProp = 'urn:custom:client:allowed-cors-origins'
  const configuration = {
    jwks, // Used https://mkjwk.org/
    scopes: ['openid', 'profile'],
    features: {
      clientCredentials: {
        enabled: true,
      },
      introspection: {
        enabled: true,
      },
      resourceIndicators: {
        enabled: true,
        getResourceServerInfo(_ctx: unknown, resourceIndicator: string) {
          if (resourceIndicator === 'urn:api') {
            return {
              scope: 'read',
              audience: 'urn:api',
              accessTokenTTL: 1 * 60 * 60, // 1 hour
              accessTokenFormat: 'jwt',
            }
          }

          throw new Error()
        },
      },
    },
    extraClientMetadata: {
      properties: [corsProp],
      validator(_ctx: unknown, key: string, value: string, metadata: any) {
        if (key === corsProp) {
          // set default (no CORS)
          if (value === undefined) {
            metadata[corsProp] = []
            return
          }
          // validate an array of Origin strings
          if (!Array.isArray(value)) {
            throw new errors.InvalidClientMetadata(`${corsProp} must be an array of origins`)
          }
        }
      },
    },
    clientBasedCORS() {
      return true
    },
    clients: [
      {
        client_id: 'oidc_client',
        client_secret: 'a_different_secret',
        grant_types: ['authorization_code'],
        response_types: ['code'],
        redirect_uris: ['http://localhost:8001/redirect'],
      },
    ],
  }

  return new Provider(baseIRI, configuration)
}
