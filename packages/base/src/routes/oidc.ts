import factory from '@rdfjs/data-model'
import { DatasetCore } from '@rdfjs/types'
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

export const createProvider = (baseIRI: string, store: DatasetCore) => {
  // https://www.scottbrady91.com/openid-connect/getting-started-with-oidc-provider
  const corsProp = 'urn:custom:client:allowed-cors-origins'

  const configuration = {
    jwks, // Used https://mkjwk.org/
    scopes: ['openid', 'profile'],

    async findAccount(ctx, id, token) {
      const iri = `${baseIRI}/users/${id}`
      const quads = store.match(null, null, null, factory.namedNode(iri))
      console.log('quads', [...quads], iri)
      return {
        accountId: id,
        async claims(use, scope) {
          return { sub: id }
        },
      }
    },

    features: {
      clientCredentials: {
        enabled: true,
      },
      introspection: {
        enabled: true,
      },
      deviceFlow: { enabled: true }, // defaults to false
      revocation: { enabled: true }, // defaults to false
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
    clientAuthMethods: ['none'],
    clientBasedCORS(ctx: unknown, origin: string, client: any) {
      return client[corsProp].includes(origin)
    },
    clients: [
      {
        client_id: 'centergraph',
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code'],
        application_type: 'web',
        response_types: ['code'],
        redirect_uris: ['http://localhost:8001'],
      },
    ],
  }

  return new Provider(baseIRI, configuration)
}
