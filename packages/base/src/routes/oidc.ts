import '../polyfills/node.ts'

import Provider, { errors } from 'oidc-provider'

import { jwks } from '../Base.ts'

const isOrigin = (value: string) => {
  if (typeof value !== 'string') {
    return false
  }
  try {
    const { origin } = new URL(value)
    // Origin: <scheme> "://" <hostname> [ ":" <port> ]
    return value === origin
  } catch (err) {
    return false
  }
}

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
    pkce: {
      required: true,
    },
    token_endpoint_auth_method: 'none',
    extraClientMetadata: {
      properties: [corsProp],
      validator(ctx, key, value, metadata) {
        if (key === corsProp) {
          // set default (no CORS)
          if (value === undefined) {
            metadata[corsProp] = []
            return
          }
          // validate an array of Origin strings
          if (!Array.isArray(value) || !value.every(isOrigin)) {
            throw new errors.InvalidClientMetadata(`${corsProp} must be an array of origins`)
          }
        }
      },
    },
    clientBasedCORS(ctx: unknown, origin: string, client: any) {
      return client[corsProp].includes(origin)
    },
    clients: [
      {
        client_id: 'centergraph',
        client_secret: 'centergraph',
        grant_types: ['authorization_code'],
        application_type: 'web',
        response_types: ['code'],
        redirect_uris: ['http://localhost:8001/redirect'],
      },
    ],
  }

  return new Provider(baseIRI, configuration)
}
