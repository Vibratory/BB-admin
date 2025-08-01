"use client"

import { DataTable } from "@/components/custom ui/DataTable"
import Loader from "@/components/custom ui/Loader"
import { columns } from "@/components/orders/OrderColumns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@radix-ui/themes"

import { useEffect, useState } from "react"


//ALL orders table not specific order

 
const Orders = () => {

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    try {
      const res = await fetch(`/api/orders`)
      const data = await res.json()
      setOrders(data)
      setLoading(false)
    } catch (err) {
      console.log("[orders_GET", err)
    }
  }

  
const orderswithstatus = orders.map((item: any) => ({
  ...item,
  status: item.status, // silently attach it
  
}));

  useEffect(() => {
    getOrders()
  }, [])

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Orders</p>
      <Separator className="bg-grey-1 my-5" />
      <DataTable columns={columns} data={orderswithstatus} searchKey="_id" />

    </div>
  )
}

export const dynamic = "force-dynamic";

export default Orders