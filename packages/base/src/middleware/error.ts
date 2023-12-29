import { Context, isHttpError } from 'oak'

export const error = async (context: Context, next: () => Promise<unknown>) => {
  try {
    await next()
  } catch (err) {
    if (isHttpError(err)) {
      context.response.status = err.status
    } else {
      context.response.status = 500
    }

    if (!context.response.body) context.response.body = { error: err.message }
    context.response.type = 'json'
  }
}
