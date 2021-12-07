import { ComponetsModule } from './componets.module';


describe('ComponentsModule', () => {
  let componentsModule: ComponetsModule;

  beforeEach(() => {
    componentsModule = new ComponetsModule();
  });

  it('should create an instance', () => {
    expect(componentsModule).toBeTruthy();
  });
});
