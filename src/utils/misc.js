'use strict';

export function betweenLinear(n, max, min) {
  return min + ((max - min) * n);
}

export function portion(max, center) {
  return (max - center) / (max+1);
}

export function last(thing) {
  return thing[thing.length - 1];
}

const identity = (i) => i;

function *timeGen(t=Infinity, fn=identity) {
  for (let i = 0; i < t; i++) yield fn(i);
}

export function times(t, fn) {
  return [...timeGen(t)].map(fn);
}

export function between(n, max, min) {
  return Math.max(
    Math.min(n, max), min
  );
}

export function compact(arr) {
  return arr.filter(i => !!i || i === 0);
}

function* enumerateArray(iterable) {
  let i = 0;
  for (let iter of iterable) {
    yield [iter, i++];
  }
}

function* enumerateObject(obj) {
  for (let key in obj) {
    yield [obj[key], key];
  }
}

function* enumerate(iterable) {
  yield* iterable[Symbol.iterator] ? enumerateArray(iterable) : enumerateObject(iterable);
}

export function find(iterable, fn) {
  for (let [iter, i] of enumerate(iterable)) {
    if (fn(iter, i)) return iter;
  }

  return null;
}

export function flow(...fnArr) {
  return (...args) => fnArr.slice(1).reduce((acc, fn) => fn(acc), fnArr[0](...args));
}

export default function random(i, j) {
  if (!isNaN(j)) {
    return i + random(j - i);
  } else {
    return Math.floor(Math.random() * i);
  }
}
