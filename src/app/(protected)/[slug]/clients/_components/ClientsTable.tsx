"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ellipsis, Triangle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";


interface Clients {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
  createdAt: string;
  createdBy: string;
};

const tableHeaders = [
  {
    id: "name",
    label: "Name",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    sortable: true,
  },
  {
    id: "phone",
    label: "Phone",
    sortable: false,
  },
  {
    id: "gstNumber",
    label: "GST Number",
    sortable: false,
  },
  {
    id: "createdAt",
    label: "Created At",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    sortable: false,
  },
];



export function ClientsTable() {
  const [ loading, setLoading ] = useState(false);
  const [clients, setClients] = useState<Clients[]>([])
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = (
          await api.get("/clients", {
            params: { page: 1, limit: 2 }
          })
        ).data;
        console.log("Clients res", res);
        const clientData = res.data.docs
        setClients(clientData);
        console.log("CLient Data", clientData)
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [])
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const rowsPerPage = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;

  const setRowsPerPage = (newRowsPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newRowsPerPage));
    params.set("page", "1"); // reset to first page when changing rows per page
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const setCurrentPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentSearchParams = new URLSearchParams(searchParams.toString());

  const renderPageNumbers = () => {
    const buildHref = (page: number, limit: number) => {
      const params = new URLSearchParams(
        currentSearchParams.toString(),
      );
      params.set("page", String(page));
      params.set("limit", String(limit));
      return `${pathname}?${params.toString()}`;
    };

    const totalPages = Math.max(
      1,
      Math.ceil(clients.length / rowsPerPage),
    );
    const prevPage = Math.max(1, currentPage - 1);
    const nextPage = Math.min(totalPages, currentPage + 1);

    // render previous
    const items = [
      <PaginationItem key="prev">
        <PaginationPrevious
          href={buildHref(prevPage, rowsPerPage)}
        />
      </PaginationItem>,
    ];

    // simple windowed page numbers
    const window = 2;
    const start = Math.max(1, currentPage - window);
    const end = Math.min(totalPages, currentPage + window);

    for (let p = start; p <= end; p++) {
      items.push(
        <PaginationItem key={p}>
          <PaginationLink isActive={currentPage === p} href={buildHref(p, rowsPerPage)}>
            {p}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPages) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href={buildHref(nextPage, rowsPerPage)}
        />
      </PaginationItem>,
    );

    return items;
  };

  useEffect(() => {
    console.log("current page", currentPage);
    console.log("rows per page", rowsPerPage);
  }, [currentPage, rowsPerPage])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Loading clients...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your recent clients.</TableCaption>
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header, idx) => (
            <TableHead className="p-4 text-xs text-left" key={idx}>
              <div className="flex items-center gap-3">
                <p>{header.label}</p>
                {header.sortable && (
                  <span className="flex items-center flex-col gap-0.5">
                    <Triangle fill="white" className="h-1.5 w-1.75" />
                    <Triangle
                      fill="white"
                      transform="rotate(180)"
                      className="h-1.5 w-1.75"
                    />
                  </span>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          clients.map((client) => (
            <TableRow key={client._id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell className="p-4 text-sm">{client.email}</TableCell>
              <TableCell className="p-4 text-sm">{client.phone}</TableCell>
              <TableCell className="p-4 text-sm">{client.gstNumber}</TableCell>
              <TableCell className="p-4 text-sm">
                {
                  new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  }).format(new Date(client.createdAt))
                }
              </TableCell>
              <TableCell className="p-4 text-sm">
                <Ellipsis />
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex items-center justify-between gap-4">
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">
                  Rows per page
                </FieldLabel>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => setRowsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  {renderPageNumbers()}
                </PaginationContent>
              </Pagination>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
