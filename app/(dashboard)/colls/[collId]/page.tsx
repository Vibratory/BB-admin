"use client"

import { useEffect, useState } from "react"
import { Colltype } from "@/lib/types"

import Loader from "@/components/custom ui/Loader"
import CollForm from "@/components/colls/CollForm"

const CollDetails = ({ params }: { params: { collId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [collDetails, setCollDetails] = useState<Colltype | null>(null)

  const getCollDetails = async () => {
    try { 
      const res = await fetch(`/api/colls/${params.collId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCollDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[collId_GET]", err)
    }
  }

  useEffect(() => {
    getCollDetails()
  }, [])

  return loading ? <Loader /> : (
    <div>
    <CollForm initialData={collDetails}/>
    <p>{JSON.stringify(collDetails)}</p>
    </div>
  )
}

export default CollDetails