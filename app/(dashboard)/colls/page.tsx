"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/colls/CollColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Colls = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [colls, setColls] = useState([]);

  const getColls = async () => {
    try {
      const res = await fetch("/api/colls", {
        method: "GET",
      });
      const data = await res.json();
      setColls(data);
      setLoading(false);
    } catch (err) {
      console.log("[colls_GET]", err);
    }
  };

  useEffect(() => {
    getColls();
  }, []);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Collections</p>
        <Button className="bg-blue-1 text-white" onClick={() => router.push("/colls/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Créer Collection
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={colls} searchKey="title" />
    </div>
  );
};

export default Colls;
