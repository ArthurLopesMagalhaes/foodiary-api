import { IHttpRequest } from '../contracts/HttpRequests';

export class HelloController {
  async handler(request: IHttpRequest) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello, world!' }),
    };
  }
}
