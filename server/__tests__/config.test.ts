
import { config } from '../config';

describe('Server Configuration', () => {
  test('should have required configuration properties', () => {
    expect(config).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.nodeEnv).toBeDefined();
  });

  test('should use correct default port', () => {
    expect(config.port).toBe(5000);
  });
});
