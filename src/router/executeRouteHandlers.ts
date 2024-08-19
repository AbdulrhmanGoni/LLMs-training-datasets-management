import extractRequestBody from "../lib/extractRequestBody";
import extractSearchParams from "../lib/extractSearchParams";
import type { PathParams, Req, RequestHandler } from "../types/request";

export default async function executeRouteHandlers(
  request: Request,
  routeData: {
    handlers: RequestHandler[];
    params: PathParams;
  }
): Promise<Response | void> {
  const req: Req = Object.assign(request, {
    search: extractSearchParams(new URL(request.url)),
    json: await extractRequestBody(request),
    params: routeData.params,
  });

  for (let i = 0; i < routeData.handlers.length; i++) {
    const handler = routeData.handlers[i];
    const response = await handler(req);
    if (response !== undefined) {
      return response;
    }
  }
}
