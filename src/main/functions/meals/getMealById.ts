import 'reflect-metadata';

import { GetMealByIdController } from '@application/controllers/meals/getMealByIdController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetMealByIdController);

export const handler = lambdaHttpAdapter(controller);
