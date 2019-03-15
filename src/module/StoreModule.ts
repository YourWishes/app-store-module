// Copyright (c) 2019 Dominic Masters
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { Module, NPMPackage } from '@yourwishes/app-base';
import { AppStoreOwner, AppStore, reduceReducers } from '@yourwishes/app-store';

import { IStoreApp } from './../app/';
import { Action, Reducer, Middleware } from 'redux';

export type ReducerList<S,A extends Action> = {
  [key:string]:Reducer<S,A>
};

export class StoreModule<S,A extends Action> extends Module implements AppStoreOwner<S,A> {
  app:IStoreApp<S,A>;
  reducers:Reducer<S,A>[]=[];
  middlewares:Middleware<S,A>[]=[];
  store:AppStore<S,A>;

  constructor(app:IStoreApp<S,A>) {
    super(app);
  }

  loadPackage():NPMPackage { return require('./../../package.json'); }

  getReducer():Reducer<S, A> {
    return reduceReducers( ...this.reducers);
  }

  getMiddlewares() {
    return this.middlewares;
  }

  addReducer(reducer:Reducer<S,A>) {
    if(!reducer) throw new Error("Reducer is invalid.");
    if(this.reducers.indexOf(reducer) !== -1) return;
    this.reducers.push(reducer);
  }

  addMiddleware(middleware:Middleware<S,A>) {
    this.middlewares.push(middleware);
  }

  async init():Promise<void> {
    this.store = new AppStore(this);
  }

  async destroy():Promise<void> { }
}
