import {tableFeatures,stockFeatures,createFilteredRowModel,createSortedRowModel,createPaginatedRowModel,filterFns,sortFns,type ColumnDef,type Table,type Row} from '@tanstack/table-core';
export const features=tableFeatures({...stockFeatures,filteredRowModel:createFilteredRowModel(),sortedRowModel:createSortedRowModel(),paginatedRowModel:createPaginatedRowModel(),filterFns,sortFns});
export type Delivery={id:string;name:string;region:string;amount:number};
export const data:Delivery[]=Array.from({length:10000},(_,i)=>({id:`delivery-${i}`,name:`Delivery ${String(i).padStart(5,'0')}`,region:i%2?'East':'West',amount:i}));
export const columns:ColumnDef<typeof features,Delivery>[]=[{id:'select',header:'Select',size:80,enableSorting:false},{accessorKey:'name',header:'Name',size:240},{accessorKey:'region',header:'Region',size:150},{accessorKey:'amount',header:'Amount',size:150}];
export type DeliveryTable=Table<typeof features,Delivery>;
export type DeliveryRow=Row<typeof features,Delivery>;
