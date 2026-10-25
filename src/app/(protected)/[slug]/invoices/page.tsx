"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp, CircleChevronDown, CircleChevronUp, Ellipsis, Play, Triangle } from "lucide-react";
import { useEffect, useState } from "react"
import { InvoiceTable } from "./InvoiceTable";

const invoicesList = [
  {
    invoice: "INV-001",
    client: "Acme Corporation",
    createdAt: "2023-01-15",
    dueDate: "2023-02-15",
    totalAmount: "$1,000.00",
    status: "Paid",
  },
  {
    invoice: "INV-002",
    client: "Globex Corporation",
    createdAt: "2023-02-01",
    dueDate: "2023-03-01",
    totalAmount: "$2,500.00",
    status: "Unpaid",
  },
  {
    invoice: "INV-003",
    client: "Foobar Industries",
    createdAt: "2023-03-01",
    dueDate: "2023-04-01",
    totalAmount: "$5,000.00",
    status: "Pending",
  },
  {
    invoice: "INV-004",
    client: "Qux Corp",
    createdAt: "2023-04-01",
    dueDate: "2023-05-01",
    totalAmount: "$1,000.00",
    status: "Paid",
  },
  {
    invoice: "INV-005",
    client: "Initech",
    createdAt: "2023-05-01",
    dueDate: "2023-06-01",
    totalAmount: "$2,500.00",
    status: "Unpaid",
  },
  {
    invoice: "INV-006",
    client: "Umbrella Corporation",
    createdAt: "2023-06-01",
    dueDate: "2023-07-01",
    totalAmount: "$5,000.00",
    status: "Pending",
  },
  {
    invoice: "INV-007",
    client: "Wayne Enterprises",
    createdAt: "2023-07-01",
    dueDate: "2023-08-01",
    totalAmount: "$1,000.00",
    status: "Paid",
  },
  {
    invoice: "INV-008",
    client: "Stark Industries",
    createdAt: "2023-08-01",
    dueDate: "2023-09-01",
    totalAmount: "$2,500.00",
    status: "Unpaid",
  },
  {
    invoice: "INV-009",
    client: "Wayne Enterprises",
    createdAt: "2023-09-01",
    dueDate: "2023-10-01",
    totalAmount: "$1,000.00",
    status: "Paid",
  },
  {
    invoice: "INV-010",
    client: "Stark Industries",
    createdAt: "2023-10-01",
    dueDate: "2023-11-01",
    totalAmount: "$2,500.00",
    status: "Unpaid",
  },
  {
    invoice: "INV-011",
    client: "Acme Corporation",
    createdAt: "2023-11-01",
    dueDate: "2023-12-01",
    totalAmount: "$1,000.00",
    status: "Paid",
  },
  {
    invoice: "INV-012",
    client: "Globex Corporation",
    createdAt: "2023-12-01",
    dueDate: "2024-01-01",
    totalAmount: "$2,500.00",
    status: "Unpaid",
  },
]



export default function Invoices() {
  const [invoices, setInvoices] = useState(invoicesList)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    console.log("rows per page", rowsPerPage);
    console.log("curr PAge", currentPage)
  }, [rowsPerPage, currentPage])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-8">
          <InvoiceTable 
            invoices={invoices}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>

  )
}



