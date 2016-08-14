// @flow
'use strict';

import fs from 'fs';
import { find, flow, compact, last } from './utils/misc';

const [markdown, html] = process.argv.slice(2);

type transformFn = (tag: string, text: string) => string;

type token = {
  text: string,
  type: string,
  tag: string,
  transform: transformFn
};

type mdBlock = {
  type: string,
  tag: string,
  test: (block: string) => boolean,
  transform: transformFn
};

type wrapTest = (previous: token, next: token) => boolean;
type wrapTransformFn = (tag: string, closing: boolean) => string;

type mdWrapBlock = {
  type: string,
  tag: string,
  open: wrapTest,
  close: wrapTest,
  transform: wrapTransformFn
};

function splitText(text: string): Array<string> {
  return compact(text.split('\n'));
}

function clean(block: string, ix: number): string {
  return block.trim().slice(0, ix);
}

function wrapTag(tag: string, content: string): string {
  return `<${tag}>${content}</${tag}>`;
}

function singleTag(tag: string, closing: boolean = false): string {
  return closing ? `</${tag}>` : `<${tag}>`
}

const mdBlocks: Array<mdBlock> = [
  {
    type: 'H1',
    tag: 'h1',
    test: (block) => clean(block, 2) === '# ',
    transform: (tag, text) => wrapTag(tag, text.slice(2))
  }, {
    type: 'H2',
    tag: 'h2',
    test: (block) => clean(block, 3) === '## ',
    transform: (tag, text) => wrapTag(tag, text.slice(3))
  }, {
    type: 'H3',
    tag: 'h3',
    test: (block) => clean(block, 4) === '### ',
    transform: (tag, text) => wrapTag(tag, text.slice(4))
  }, {
    type: 'H4',
    tag: 'h4',
    test: (block) => clean(block, 5) === '#### ',
    transform: (tag, text) => wrapTag(tag, text.slice(5))
  }, {
    type: 'H5',
    tag: 'h5',
    test: (block) => clean(block, 6) === '##### ',
    transform: (tag, text) => wrapTag(tag, text.slice(6))
  }, {
    type: 'H6',
    tag: 'h6',
    test: (block) => clean(block, 7) === '###### ',
    transform: (tag, text) => wrapTag(tag, text.slice(7))
  }, {
    type: 'OL_LI',
    tag: 'li',
    test: (block) => !!block.match(/^\d*\./),
    transform: (tag, text) => '  ' + wrapTag(tag, text.replace(/^\d*\./, ''))
  }, {
    type: 'UL_LI',
    tag: 'li',
    test: (block) => clean(block, 2) === '* ',
    transform: (tag, text) => '  ' + wrapTag(tag, text.slice(2))
  }, {
    type: 'P',
    tag: 'p',
    test: () => true,
    transform: (tag, text) => wrapTag(tag, text)
  }, {
    type: 'BR',
    tag: 'br',
    test: (block) => block === '',
    transform: (tag) => singleTag(tag)
  }
];


const mdWrapBlocks: Array<mdWrapBlock> = [
  {
    type: 'OL',
    tag: 'ol',
    open: (previous, next) => previous.type !== 'OL_LI' && next.type === 'OL_LI',
    close: (previous, next) => previous.type === 'OL_LI' && next.type !== 'OL_LI',
    transform: singleTag

  }, {
    type: 'UL',
    tag: 'ul',
    open: (previous, next) => previous.type !== 'UL_LI' && next.type === 'UL_LI',
    close: (previous, next) => previous.type === 'UL_LI' && next.type !== 'UL_LI',
    transform: singleTag

  }
]

function getMd(textUnit: string): mdBlock {
  return find(mdBlocks, md => md.test(textUnit)) || last(mdBlocks);
}

function classifyText(textUnit: string): token {
  const md = getMd(textUnit);

  return {
    text: textUnit,
    type: md.type,
    tag: md.tag,
    transform: md.transform
  };
}


function tokenize(textArr: Array<string>): Array<token> {
  return textArr.map(classifyText);
}

function format(tokenArray: Array<token>): string {
  return tokenArray
    .map((token, i) => {
      const previous = tokenArray[i-1];
      const next = tokenArray[i+1];

      const { text, transform, tag } = token;

      return transform(tag, text);
    })
    .join('\n');
}


const convertMd2Html = flow(
  splitText,
  tokenize,
  format
);

fs.readFile(markdown, 'utf8', (err, data) => {
  if (err) console.error(err);

  fs.writeFile(html, convertMd2Html(data));
});
