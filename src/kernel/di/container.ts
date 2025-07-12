import { HelloController } from '@application/controllers/HelloController';
import { HelloUseCase } from '@application/usecases/HelloUseCase';
import { Registry } from '@kernel/di/Registry';

export const container = Registry.getInstance();

container.register(HelloUseCase);
container.register(HelloController);

