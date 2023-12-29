import { Context } from 'oak'

export const notFound = async (context: Context, next: () => Promise<unknown>) => {
  await next()
  if (context.response.status === 404 && context.request.accepts('text/html')) {
    context.response.type = 'html'
    context.response.body = `
       <HTML>
         <BODY>
           <H1>Woops, not found!</H1>
         </BODY>
       </HTML>
     `
  }
}
