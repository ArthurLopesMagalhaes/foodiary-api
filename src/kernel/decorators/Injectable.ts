import { Registry } from '@kernel/di/Registry';
import { Constructor } from '@shared/types/constructor';

export function Injectable(): ClassDecorator {
  return (target) => {

    const container = Registry.getInstance();
    container.register(target as unknown as Constructor);
  };
}
