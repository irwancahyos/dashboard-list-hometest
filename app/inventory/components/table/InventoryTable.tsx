'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Minus, MoveDown, MoveUp, Pencil, Plus, Search, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import ConfirmationDialog from '@/app/components/dialog/ConfirmationDialog';
import InputText from '@/app/components/input/InputText';

import { useInventoryStore } from '@/app/stores/inventoryStore';
import { cn, formatRupiah } from '@/lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// ********** Local Interface **********
type Inventory = {
  id: string;
  image: Base64URLString;
  name: string;
  stock: number;
  price: string;
  code: string;
  updatedAt: string;
};

// ********** Add Another Type Base Tanstack **********
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

/**
 * This function is to struycture data coluym to render in the table 
 * Reason separate is make the code is not to crowded within component
 * @param handleDelete - Use for delete product event
 * @param handleUpdateStock - Use for update stock per product event 
 */
const getColumns = (
  handleDelete: (id: string) => void,
  handleUpdateStock: (id: string, change: number, name: string) => void,
): ColumnDef<Inventory>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting()} className="flex items-center gap-1 cursor-pointer">
        <span>Nama barang</span>
        <span>{column.getIsSorted() === 'asc' ? <MoveUp size={10} /> : column.getIsSorted() === 'desc' ? <MoveDown size={10} /> : ''}</span>
      </button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#7468ef]">
          <Image alt="Image product" height={50} width={50} src={row?.original?.image} className="h-full w-full" />
        </div>
        <p className="capitalize">{row.getValue('name')}</p>
      </div>
    ),
    meta: {
      className: 'w-[20%] text-left',
    },
  },
  {
    accessorKey: 'code',
    header: 'Kode',
    cell: ({ row }) => <div className="lowercase">{row.getValue('code')}</div>,
    meta: {
      className: 'w-[15%] text-center',
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <button className="flex gap-1 items-center justify-center m-auto cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Harga</span>
          <span>
            {column.getIsSorted() === 'asc' ? <MoveUp size={10} /> : column.getIsSorted() === 'desc' ? <MoveDown size={10} /> : ''}
          </span>
        </button>
      );
    },
    cell: ({ row }) => <div>{formatRupiah(row.getValue('price'))}</div>,
    meta: {
      className: 'w-[15%] text-center',
    },
  },
  {
    accessorKey: 'stock',
    header: () => <div>Stok</div>,
    cell: ({ row }) => {
      return <div>{row?.getValue('stock')}</div>;
    },
    meta: {
      className: 'w-[10%] text-center',
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <button className="flex gap-1 items-center justify-center m-auto cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Tanggal</span>
        <span>{column.getIsSorted() === 'asc' ? <MoveUp size={10} /> : column.getIsSorted() === 'desc' ? <MoveDown size={10} /> : ''}</span>
      </button>
    ),
    cell: ({ row }) => {
      return <div>{row?.getValue('updatedAt')}</div>;
    },
    meta: {
      className: 'w-[20%] text-center',
    },
  },
  {
    id: 'actions',
    header: 'Action',
    enableHiding: false,
    cell: ({ row }) => {
      const inventory = row?.original;
      
      return (
        <div className="flex gap-2.5 items-center justify-center">
          {/* reduce stock */}
          <button
            onClick={() => handleUpdateStock(inventory?.id, -1, inventory?.name)}
            disabled={inventory?.stock <= 0}
            className="cursor-pointer hover:opacity-85"
          >
            <Minus size={14} />
          </button>

          {/* Edit product */}
          <Link href={`/inventory/${row?.original?.id}/edit`} className="cursor-pointer">
            <Pencil size={14} className="text-(--orange-color)" />
          </Link>

          {/* Delete product */}
          <ConfirmationDialog
            title="Hapus Produk"
            description={`Apakah Anda yakin ingin menghapus produk ${row?.original?.name}?`}
            onConfirm={() => handleDelete(row?.original?.id)}
            confirmText="Ya, Hapus"
            trigger={
              <button className="cursor-pointer">
                <Trash size={14} className="text-red-500" />
              </button>
            }
          />

          {/* Increase stock */}
          <button
            onClick={() => handleUpdateStock(inventory?.id, 1, inventory?.name)}
            className="cursor-pointer hover:opacity-85"
          >
            <Plus size={14} />
          </button>
        </div>
      );
    },
    meta: {
      className: 'w-auto text-center',
    },
  },
];

// ********** Main Component **********
const InventoryTable = () => {
  const inventoryStoreData = useInventoryStore((state) => state.inventory);
  const deleteInventoryData = useInventoryStore((state) => state.deleteItem);
  const updateStockData = useInventoryStore((state) => state.updateStock);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchName, setSearchName] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [sorting, columnFilters]);

  const onUpdateSort = (updater: Updater<SortingState>) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

    if (newSorting.length > 1) {
      setSorting([newSorting[newSorting.length - 1]]); 
    } else {
      setSorting(newSorting);
    }
  }

  const handleDelete = (id: string) => {
    deleteInventoryData(id);
    toast.success('Produk berhasil dihapus');
  };

  const handleUpdateStock = (id: string, change: number, name: string) => {
    updateStockData(id, change);
    toast.success(`Stok ${name} berhasil diubah.`);
  };

  const columns = getColumns(handleDelete, handleUpdateStock);
  const table = useReactTable({
    data: inventoryStoreData?.data || [],
    columns,
    onSortingChange: onUpdateSort,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setSearchName,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiSort: false,
    autoResetAll: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter: searchName,
    },
  });

  return (
    <div className="w-full bg-(--primary-color) p-[14px] rounded-md">

      {/* Title Page */}
      <div className="py-2">
        <p className="text-(--text-primary-color) text-[0.875rem] font-bold flex items-center gap-2">
          <span>Produk</span>
        </p>
      </div>

      {/* Search Input  */}
      <div className="py-2">
        <InputText
          suffix={<Search size={12} />}
          value={searchName ?? ''}
          onChange={(e) => table?.setGlobalFilter(e)}
          placeholder='Cari barang'
          className={`text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg w-full sm:max-w-[60%] md:max-w-[40%]`}
        />
      </div>

      {/* Table Wrapper Component */}
      <div className="rounded-md overflow-x-auto">

        {/* Table Component */}
        <Table className="text-(--text-primary-color) overflow-x-auto whitespace-nowrap" >

          {/* Table Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-[.004rem] border-white/30 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(`text-(--text-primary-color) h-[60px]`, `${header?.column?.columnDef?.meta?.className}`)}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
                <TableRow
                  className={cn('border-none hover:bg-transparent font-light h-[60px]')}
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className={`${cell?.column?.columnDef?.meta?.className}`} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  Data yang anda cari tidak ada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center space-x-2 py-2 justify-end">

        {/* Pagination Component */}
        <Pagination className="flex justify-end w-auto mx-0">
          <PaginationContent className="text-(--text-primary-color)">

            {/* Pagination Previous */}
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  'cursor-pointer hover:bg-transparent hover:text-white/80 text-[0.75rem]!',
                  !table.getCanPreviousPage() && 'opacity-50 pointer-events-none',
                )}
                onClick={() => table.previousPage()}
                href="#"
              />
            </PaginationItem>

            {/* Pagination Number */}
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => {
              return (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    href="#"
                    onClick={() => table.setPageIndex(pageIndex)}
                    isActive={table.getState().pagination.pageIndex === pageIndex}
                    className={cn(
                      'bg-transparent border-none hover:bg-transparent hover:text-(--text-primary-color)/80',
                      table.getState().pagination.pageIndex === pageIndex
                        ? 'text-(--text-primary-color)'
                        : 'text-(--text-primary-color)/40',
                    )}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Pagination Next */}
            <PaginationItem>
              <PaginationNext
                className={cn(
                  'cursor-pointer hover:bg-transparent hover:text-white/80 text-[0.75rem]!',
                  !table.getCanNextPage() && 'opacity-50 pointer-events-none',
                )}
                onClick={() => table.nextPage()}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Toaster position='bottom-right' />
    </div>
  );
};

export default InventoryTable;
