import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ZodError } from 'zod';

import { Controller } from '@application/contracts/Controller';
import { ErrorCode } from '@application/errors/errorCode';
import { HttpError } from '@application/errors/http/HttpError';
import { lambdaBodyParser } from '@main/utils/lambdaBodyParser';
import { lambdaErrorResponse } from '@main/utils/lambdaErrorResponse';

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = lambdaBodyParser(event.body);
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const response = await controller.execute({
        body,
        params,
        queryParams,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION,
          message: error.errors.map((err) => ({
            message: err.message,
            field: err.path.join('.'),
          })),
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      return lambdaErrorResponse({
        statusCode: 500,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.',
      });
    }
  };
}
