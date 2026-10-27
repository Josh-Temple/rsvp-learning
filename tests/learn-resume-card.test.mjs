import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const fragment = code.slice(code.indexOf('const LEARN_RESUME_KEY'), code.indexOf('function renderLearnLibrary()'));
const hook = code.slice(code.indexOf('document.querySelector("#learn-course-back")?.addEventListener'), code.indexOf('\nfunction setLibraryView('));
class Element {
  constructor(tag) { this.tag=tag; this.children=[]; this.dataset={}; this.className=''; }
  append(...nodes) { for (const n of nodes) {n.parent=this; this.children.push(n)} }
  prepend(n) { n.parent=this; this.children.unshift(n) }
  remove() { this.parent.children=this.parent.children.filter(x=>x!==this) }
  querySelector(sel) { return this.children.find(x=>'.'+x.className===sel)||null }
}
function setup() {
  const root=new Element('root'); const search=new Element('input'); search.value='query'; root.append(search);
  let value=null, callback;
  const context={els:{libraryContent:root},state:{libraryView:'learn',courses:[{id:'c',title:'Course',chapters:['one','two']}],lessonMap:new Map([['one',{id:'one',title:'First',learn_path:'1'}],['two',{id:'two',title:'Second',learn_path:'2'}]])}, localStorage:{getItem:()=>value},document:{createElement:t=>new Element(t),querySelector:()=>({addEventListener:(event,fn)=>callback=fn})}};
  vm.runInNewContext(fragment+'\n'+hook,context);
  return {root,search,set:v=>value=v,back:()=>callback()};
}
test('return updates, removes, and preserves search when saved position changes',()=>{
  const x=setup(); x.set(JSON.stringify({courseId:'c',lessonId:'one',itemIndex:2}));x.back();
  assert.equal(x.root.children[0].children[1].textContent,'Course · First');
  assert.equal(x.root.children[0].children[2].dataset.resume,'true');
  x.set(JSON.stringify({courseId:'c',lessonId:'two',itemIndex:1}));x.back();
  assert.equal(x.root.children[0].children[1].textContent,'Course · Second');
  assert.equal(x.root.children.length,2); assert.equal(x.search.value,'query');
  x.set(null);x.back();assert.deepEqual(x.root.children,[x.search]);
  x.set('{broken');x.back();assert.deepEqual(x.root.children,[x.search]);
});
