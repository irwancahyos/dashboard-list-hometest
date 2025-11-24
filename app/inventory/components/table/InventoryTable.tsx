'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import { Minus, MoveDown, MoveUp, Pencil, Plus, Search, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

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

import FadeUp from '../../styles/animation/FadeUp';
import Underline from '../../styles/animation/Underline';
import TooltipComponent from '@/app/components/tooltip/Tooltip';

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

const ConfirmationDialogClient = dynamic(() => import('@/app/components/dialog/ConfirmationDialog'), {
  ssr: false,
  loading: () => (
    <button className="cursor-pointer">
      <Trash size={14} className="text-red-500" />
    </button>
  ),
});

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
        <Underline>Nama barang</Underline>
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
    header: () => <Underline>Kode</Underline>,
    cell: ({ row }) => (
      <div className="lowercase">
        <Underline>{row.getValue('code')}</Underline>
      </div>
    ),
    meta: {
      className: 'w-[15%] text-center',
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <button className="flex gap-1 items-center justify-center m-auto cursor-pointer" onClick={() => column.toggleSorting()}>
          <Underline>Harga</Underline>
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
    header: () => (
      <div>
        <Underline>Stok</Underline>
      </div>
    ),
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
        <Underline>Tanggal</Underline>
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
    header: () => (
      <div>
        <Underline>Action</Underline>
      </div>
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const inventory = row?.original;

      return (
        <div className="flex gap-2.5 items-center justify-center">
          {/* reduce stock */}
          <TooltipComponent text="Kurangi stok">
            <button
              onClick={() => handleUpdateStock(inventory?.id, -1, inventory?.name)}
              disabled={inventory?.stock <= 0}
              className="cursor-pointer hover:opacity-85"
            >
              <Minus size={14} />
            </button>
          </TooltipComponent>

          {/* Edit product */}
          <TooltipComponent text="Edit barang">
            <Link href={`/inventory/${row?.original?.id}/edit`} className="cursor-pointer">
              <Pencil size={14} className="text-(--orange-color)" />
            </Link>
          </TooltipComponent>

          {/* Delete product */}
          <ConfirmationDialogClient
            title="Hapus Produk"
            description={`Apakah Anda yakin ingin menghapus produk ${row?.original?.name}?`}
            onConfirm={() => handleDelete(row?.original?.id)}
            confirmText="Ya, Hapus"
            trigger={
              <span>
                <TooltipComponent text="Hapus barang">
                  <button className="cursor-pointer">
                    <Trash size={14} className="text-red-500" />
                  </button>
                </TooltipComponent>
              </span>
            }
          />

          {/* Increase stock */}
          <TooltipComponent text="Tambah stok">
            <button onClick={() => handleUpdateStock(inventory?.id, 1, inventory?.name)} className="cursor-pointer hover:opacity-85">
              <Plus size={14} />
            </button>
          </TooltipComponent>
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
  const [searchName, setSearchName] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [sorting, searchName]);

  const onUpdateSort = (updater: Updater<SortingState>) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;

    if (newSorting.length > 1) {
      setSorting([newSorting[newSorting.length - 1]]);
    } else {
      setSorting(newSorting);
    }
  };

  const handleDelete = (id: string) => {
    console.log('masuk sini');
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setSearchName,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: false,
    autoResetAll: false,
    state: {
      sorting,
      pagination,
      globalFilter: searchName,
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const maxPagesToShow = 4;

  const getPageNumbers = () => {
    if (pageCount <= maxPagesToShow) {
      // show all when the page just a little bit
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const pages = [];
    let startPage, endPage;
    const range = 1;

    startPage = Math.max(2, currentPage - range);
    endPage = Math.min(pageCount - 1, currentPage + range);

    if (currentPage <= range + 1) {
      endPage = maxPagesToShow - 2;
    } else if (currentPage >= pageCount - range) {
      startPage = pageCount - (maxPagesToShow - 3);
    }

    // First page
    pages.push(1);

    // start ellipsis
    if (startPage > 2) {
      pages.push('...');
    }

    // center ellipsis
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // end of elipsis
    if (endPage < pageCount - 1) {
      pages.push('...');
    }

    // Last number
    if (pageCount > 1) {
      pages.push(pageCount);
    }

    // No duplicate
    return [...new Set(pages)];
  };

  const pageNumber = getPageNumbers();

  return (
    <div className="w-full bg-(--primary-color) p-[14px] rounded-md flex flex-col h-[100%]">
      <div className="h-fit">
        {/* Title Page */}

        <div className="py-2">
          <FadeUp delay={0.3}>
            <p className="text-(--text-primary-color) text-[0.875rem] font-bold flex items-center gap-2">
              <span>Produk</span>
            </p>
          </FadeUp>
        </div>

        {/* Search Input  */}
        <div className="py-2">
          <FadeUp delay={0.3}>
            <InputText
              suffix={<Search size={12} />}
              value={searchName ?? ''}
              onChange={(e) => table?.setGlobalFilter(e)}
              placeholder="Cari barang"
              className={`text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg w-full sm:max-w-[60%] md:max-w-[40%]`}
            />
          </FadeUp>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Horizontal sync scroll */}
        <div className="overflow-x-auto flex-1 min-h-0">
          <div className="min-w-max flex flex-col h-full">
            {/* Header (fixed) */}
            <FadeUp delay={0.3}>
              <Table className="text-(--text-primary-color)">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b-[.004rem] border-white/30 hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(`text-(--text-primary-color) h-[60px]`, `${header?.column?.columnDef?.meta?.className}`)}
                        >
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
              </Table>
            </FadeUp>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <FadeUp delay={0.3}>
                <Table className="text-(--text-primary-color)">
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
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
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          Data yang anda cari tidak ada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </FadeUp>
            </div>
          </div>
        </div>

        {/* Pagination Container */}
        <div className="flex items-center space-x-2 py-2 justify-end">
          {/* Pagination Component */}
          <FadeUp delay={0.3}>
            <Pagination className={cn('flex justify-end w-auto mx-0 ', table?.getRowModel()?.rows?.length ? 'visible' : 'invisible')}>
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
                {pageNumber.map((pageNumber, index) => {
                  const isEllipsis = pageNumber === '...';
                  const pageIndex = isEllipsis ? -1 : (pageNumber as number) - 1;

                  if (isEllipsis) {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <span className="px-2 py-1 text-(--text-primary-color)/70">...</span>
                      </PaginationItem>
                    );
                  }

                  // Tampilkan Link Halaman
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
                        {pageNumber}
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
          </FadeUp>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default InventoryTable;
