import 'reflect-metadata';

import { MealUploadedFileEventHandler } from '@application/events/files/MealUploadedFileEventHandler';
import { lambdaS3Adapter } from '@main/adapters/lambdaS3Adapter';
import { Registry } from '@kernel/di/Registry';

const eventHandler = Registry.getInstance().resolve(MealUploadedFileEventHandler);

export const handler = lambdaS3Adapter(eventHandler);
