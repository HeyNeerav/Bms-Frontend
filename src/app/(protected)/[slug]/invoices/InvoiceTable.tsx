import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Ellipsis, Triangle } from "lucide-react"

interface InvoiceTableProps {
  invoices: {
    invoice: string;
    client: string;
    createdAt: string;
    dueDate: string;
    totalAmount: string;
    status: string;
  }[];
  rowsPerPage: number;
  currentPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  setCurrentPage: (currentPage: number) => void;
}

const tableHeaders = [
  {
    id: "invoice",
    label: "Invoice",
    sortable: true,
  },
  {
    id: "client",
    label: "Client",
    sortable: true,
  },
  {
    id: "createdAt",
    label: "Created At",
    sortable: true,
  },
  {
    id: "dueDate",
    label: "Due Date",
    sortable: true,
  },
  {
    id: "status",
    label: "Status",
    sortable: false,
  },
  {
    id: "totalAmount",
    label: "Amount",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    sortable: false,
  }
]

export function InvoiceTable(
  { invoices, rowsPerPage, currentPage, setRowsPerPage, setCurrentPage }: InvoiceTableProps
) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          {
            tableHeaders.map((header, idx) => ( 
              <TableHead className="p-4 text-xs text-left" key={idx}>
                <div className="flex items-center gap-3">
                  <p>{header.label}</p>
                  {
                    header.sortable &&
                    <span className="flex items-center flex-col gap-0.5">
                      <Triangle fill="white" className="h-1.5 w-1.75"/>
                      <Triangle fill="white" transform="rotate(180)" className="h-1.5 w-1.75" />
                    </span>
                  }
                </div>
              </TableHead>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell className="p-4 text-sm">{invoice.client}</TableCell>
            <TableCell className="p-4 text-sm">{invoice.createdAt}</TableCell>
            <TableCell className="p-4 text-sm">{invoice.dueDate}</TableCell>
            <TableCell className="p-4 text-sm">{invoice.status}</TableCell>
            <TableCell className="p-4 text-sm">{invoice.totalAmount}</TableCell>
            <TableCell className="p-4 text-sm">
              <Ellipsis />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex items-center justify-between gap-4">
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
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
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
