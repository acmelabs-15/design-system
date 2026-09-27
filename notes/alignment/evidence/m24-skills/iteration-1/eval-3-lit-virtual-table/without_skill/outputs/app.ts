import '@acmelabs/design-system/styles/tokens.css';
import '@acmelabs/design-system/define/table';
import '@acmelabs/design-system/define/pagination';
import '@acmelabs/design-system/define/pagination-position';
import '@acmelabs/design-system/define/pagination-previous';
import '@acmelabs/design-system/define/pagination-next';
import '@acmelabs/design-system/define/pagination-page-size';
import type { AcmeTable } from '@acmelabs/design-system/components/table';
import { TableController } from '@tanstack/lit-table';
import { VirtualizerController } from '@tanstack/lit-virtual';
import { tableFeatures, stockFeatures, createFilteredRowModel, createSortedRowModel, createPaginatedRowModel, filterFns, sortFns, type ColumnDef, type Row, type Table } from '@tanstack/table-core';
import { LitElement, html, css, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
const features=tableFeatures({...stockFeatures,filteredRowModel:createFilteredRowModel(),sortedRowModel:createSortedRowModel(),paginatedRowModel:createPaginatedRowModel(),filterFns,sortFns});
type RecordData={id:string,name:string,region:string,amount:number};
const records:RecordData[]=Array.from({length:10000},(_,i)=>({id:`record-${i}`,name:`Record ${String(i).padStart(5,'0')}`,region:i%2?'East':'West',amount:i}));
const columns:ColumnDef<typeof features,RecordData>[]=[{id:'select',header:'Select',enableSorting:false},{accessorKey:'name',header:'Name'},{accessorKey:'region',header:'Region'},{accessorKey:'amount',header:'Amount'}];
export class ConsumerTable extends LitElement {
 static styles=css`:host{display:block;font-family:Arial,sans-serif;max-width:900px;margin:30px auto}label{display:block;margin-bottom:16px}input{padding:8px}acme-table{height:360px;width:100%;--acme-table-row-height:44px}td:focus{outline:2px solid blue;outline-offset:-3px}acme-pagination{margin-top:16px}button{cursor:pointer}th,td{min-width:120px}`;
 controller=new TableController<typeof features,RecordData>(this);
 model!:Table<typeof features,RecordData>;
 rows:Row<typeof features,RecordData>[]=[];
 virtual=new VirtualizerController<HTMLElement,HTMLTableRowElement>(this,{count:0,getScrollElement:()=>this.surface?.getScrollElement()??null,estimateSize:()=>44,getItemKey:i=>this.rows[i]?.id??i,overscan:3,useAnimationFrameWithResizeObserver:true});
 options={features,columns,data:records,getRowId:(row:RecordData)=>row.id,initialState:{pagination:{pageIndex:0,pageSize:1000}},autoResetPageIndex:false};
 focused={row:0,col:1};
 renderCount=0;
 get surface(){return this.renderRoot.querySelector<AcmeTable>('acme-table')}
 changeView(){this.model.setPageIndex(0);this.surface?.getScrollElement().scrollTo({top:0});this.focused={row:0,col:1}}
 async key(event:KeyboardEvent){
  const origin=event.composedPath()[0] as HTMLElement;
  if(origin.tagName!=='TD')return;
  let row=Number(origin.dataset.index),col=Number(origin.dataset.col);
  if(event.key==='ArrowDown')row++;else if(event.key==='ArrowUp')row--;else if(event.key==='ArrowRight')col++;else if(event.key==='ArrowLeft')col--;else if(event.key==='End'&&event.ctrlKey)row=this.rows.length-1;else if(event.key==='Home'&&event.ctrlKey)row=0;else if(event.key==='Enter'){origin.querySelector<HTMLInputElement>('input')?.focus();return}else return;
  event.preventDefault();row=Math.max(0,Math.min(this.rows.length-1,row));col=Math.max(0,Math.min(3,col));this.focused={row,col};this.virtual.getVirtualizer().scrollToIndex(row,{align:'auto'});this.requestUpdate();await this.updateComplete;await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));this.renderRoot.querySelector<HTMLElement>(`td[data-index="${row}"][data-col="${col}"]`)?.focus();
 }
 protected updated(){
  const v=this.virtual.getVirtualizer(),scroll=this.surface?.getScrollElement(),body=this.renderRoot.querySelector('tbody');
  if(scroll&&body){const margin=body.getBoundingClientRect().top-scroll.getBoundingClientRect().top+scroll.scrollTop;if(Math.abs((v.options.scrollMargin??0)-margin)>0.1){v.setOptions({...v.options,scrollMargin:margin});this.requestUpdate()}}
  for(const row of this.renderRoot.querySelectorAll<HTMLTableRowElement>('tr[data-index]'))v.measureElement(row);
 }
 render(){
  this.renderCount++;
  const t=this.controller.table(this.options);this.model=t;this.rows=t.getRowModel().rows;
  const v=this.virtual.getVirtualizer();v.setOptions({...v.options,count:this.rows.length});const items=v.getVirtualItems(),p=t.atoms.pagination.get();
  const before=items.length?Math.max(0,items[0].start-(v.options.scrollMargin??0)):0,after=items.length?Math.max(0,v.getTotalSize()-(items.at(-1)!.end-(v.options.scrollMargin??0))):0;
  const spacer=(height:number)=>height?html`<tr aria-hidden="true" data-acme-table-part="spacer" style=${`--acme-table-spacer-height:${height}px`}><td colspan="4"></td></tr>`:nothing;
  return html`<h1>Application records</h1><label>Filter names <input id="filter" @input=${(e:Event)=>{t.getColumn('name')!.setFilterValue((e.target as HTMLInputElement).value);this.changeView()}}></label><p id="summary">${t.getFilteredRowModel().rows.length} matches; ${t.getSelectedRowModel().rows.length} selected</p><acme-table sticky-header aria-label="Application records viewport"><table role="grid" aria-label="Application records" aria-rowcount=${this.rows.length+1} aria-colcount="4" @keydown=${this.key}><caption>10,000 application-owned records</caption><thead><tr>${t.getAllLeafColumns().map(c=>html`<th scope="col" aria-sort=${c.getIsSorted()==='asc'?'ascending':c.getIsSorted()==='desc'?'descending':'none'}>${c.getCanSort()?html`<button @click=${()=>{c.toggleSorting();this.changeView()}}>${String(c.columnDef.header)}</button>`:String(c.columnDef.header)}</th>`)}</tr></thead><tbody>${spacer(before)}${repeat(items,item=>this.rows[item.index].id,item=>{const row=this.rows[item.index];return html`<tr data-row=${row.id} data-index=${item.index} aria-rowindex=${item.index+2}>${row.getAllCells().map((cell,col)=>html`<td role="gridcell" data-index=${item.index} data-col=${col} aria-colindex=${col+1} tabindex=${this.focused.row===item.index&&this.focused.col===col?0:-1} @focus=${()=>{this.focused={row:item.index,col}}}>${cell.column.id==='select'?html`<input type="checkbox" aria-label=${`Select ${row.original.name}`} .checked=${row.getIsSelected()} @change=${(e:Event)=>row.toggleSelected((e.target as HTMLInputElement).checked)}>`:String(cell.getValue())}</td>`)}</tr>`})}${spacer(after)}</tbody></table></acme-table><acme-pagination aria-label="Record pages" .page=${p.pageIndex+1} .pageSize=${p.pageSize} .count=${t.getFilteredRowModel().rows.length} @acme-request=${(e:CustomEvent)=>{if(e.detail.action==='page')t.setPageIndex(e.detail.page-1);else if(e.detail.action==='page-size'){t.setPageSize(e.detail.pageSize);t.setPageIndex(0)}else return;this.surface?.getScrollElement().scrollTo({top:0});this.focused={row:0,col:1}}}><acme-pagination-previous></acme-pagination-previous><acme-pagination-position></acme-pagination-position><acme-pagination-next></acme-pagination-next><acme-pagination-page-size .options=${[50,1000,10000]}></acme-pagination-page-size></acme-pagination>`;
 }
}
customElements.define('consumer-table',ConsumerTable);
