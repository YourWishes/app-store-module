import { StoreModule } from './';
import { IStoreApp } from './../app/';
import { App } from '@yourwishes/app-base';
import { CounterState, Actions, counterReducer } from '@yourwishes/app-store';

/*** Dummy App ***/
class DummyApp extends App implements IStoreApp<CounterState, Actions> {
  store: StoreModule<CounterState, Actions>;

  constructor() {
    super();

    this.store = new StoreModule(this);
    this.addModule(this.store);
  }
}

const dummyApp = new DummyApp();

describe('StoreModule', () => {
  it('should require a real app', () => {
    expect(() => new StoreModule(null)).toThrow();
    expect(() => new StoreModule(dummyApp)).not.toThrow();
  });
});

describe('addReducer', () => {
  it('should require a valid key', () => {
    let module = new StoreModule(dummyApp);
    expect(() => module.addReducer(null, counterReducer)).toThrow();
    expect(() => module.addReducer('', counterReducer)).toThrow()
  });

  it('should require a valid reducer', () => {
    let module = new StoreModule(dummyApp);
    expect(() => module.addReducer('counter', null)).toThrow();
  });

  it('should set the reducer with the supplied key into the reducer list', () => {
    let module = new StoreModule(dummyApp);
    expect(module.reducers).not.toHaveProperty('counter');
    expect(() => module.addReducer('counter', counterReducer)).not.toThrow();
    expect(module.reducers).toHaveProperty('counter');
    expect(module.reducers['counter']).toEqual(counterReducer);
  });
});

describe('init', () => {
  it('should create a store', async () => {
    let module = new StoreModule(dummyApp);
    module.addReducer('counter', counterReducer);

    expect(module.store).toBeUndefined();
    await expect(module.init()).resolves.not.toThrow();
    expect(module.store).toBeDefined();
  });
});
