import { Controller } from '@application/contracts/Controller';
import { HelloBody, helloSchema } from '@application/schemas/helloSchema';
import { Schema } from '@kernel/decorators/schema';

@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  protected override async handle(request: Controller.Request<HelloBody>): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
