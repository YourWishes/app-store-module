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
    this.modules.addModule(this.store);
  }
}

const dummyApp = new DummyApp();

describe('StoreModule', () => {
  it('should require a real app', () => {
    expect(() => new StoreModule(null)).toThrow();
    expect(() => new StoreModule(dummyApp)).not.toThrow();
  });
});

describe('loadPackage', () => {
  it('should load the package data', () => {
    expect(new StoreModule(dummyApp).package).toHaveProperty('name', '@yourwishes/app-store-module');
  });
});

describe('addReducer', () => {
  it('should require a valid reducer', () => {
    let module = new StoreModule(dummyApp);
    expect(() => module.addReducer(null)).toThrow();
  });

  it('should add the reducer into the reducer list', () => {
    let module = new StoreModule(dummyApp);
    expect(module.reducers).not.toContain(counterReducer);
    expect(() => module.addReducer(counterReducer)).not.toThrow();
    expect(module.reducers).toContain(counterReducer);
    expect(module.reducers[0]).toEqual(counterReducer);
  });

  it('should not add the reducer to the list twice', () => {
    let module = new StoreModule(dummyApp);
    expect(module.reducers).toHaveLength(0);
    expect(() => module.addReducer(counterReducer)).not.toThrow();
    expect(module.reducers).toHaveLength(1);
    expect(() => module.addReducer(counterReducer)).not.toThrow();
    expect(module.reducers).toHaveLength(1);
  });
});

describe('init', () => {
  it('should create a store', async () => {
    let module = new StoreModule(dummyApp);
    module.addReducer(counterReducer);

    expect(module.store).toBeUndefined();
    await expect(module.init()).resolves.not.toThrow();
    expect(module.store).toBeDefined();
  });
});
