import { StoreModule } from './';
import { IStoreApp } from './../app/';
import { App } from '@yourwishes/app-base';


/*** Dummy Actions ***/
const ADD = 'ADD';
const SUB = 'SUB';
const SET = 'SET';
const DO_THING = 'DO_THING';

type Add = { type: typeof ADD, amount:number };
type Sub = { type: typeof SUB, amount:number };
type Set = { type: typeof SET, value:number };
type DoThing = { type: typeof DO_THING };

type Actions = Add|Sub|Set|DoThing;

export const add = (amount:number):Add => ({ type: ADD, amount });
export const sub = (amount:number):Sub => ({ type: SUB, amount });
export const set = (value:number):Set => ({ type: SET, value });
export const doThing = ():DoThing => ({ type: DO_THING });

/*** Dummy State ***/
type CounterState = {
  counter:number
};

const InitialState = { counter: 0 };

/*** Dummy Reducer ***/
const counterReducer = (state:CounterState = InitialState, action:Actions) => {
  switch(action.type) {
    case ADD:
      return { ...state, counter: state.counter+action.amount };
    case SUB:
      return { ...state, counter: state.counter-action.amount };
    case SET:
      return { ...state, counter: action.value };
    case DO_THING:
      return { ...state, counter: state.counter * 2 };
    default:
      return state;
  }
};


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
