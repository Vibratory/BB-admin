"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { CollectionType, Colltype } from "@/lib/types";


interface MultiSelectProps {
  placeholder: string;
  collections?: CollectionType[];
  colls?: Colltype[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  colls,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: CollectionType[];
  let selectedColls: Colltype[];

  if (collections){

  

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  const selectables = collections.filter((collection) => !selected.includes(collection)); 

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(collection._id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((collection) => (
              <CommandItem
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(collection._id);
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {collection.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );


  }else if(colls){
    


  if (value.length === 0) {
    selectedColls = [];
  } else  {
    selectedColls = value.map((id) =>
      colls.find((coll) => coll._id === id)
    ) as Colltype[];
  }

  const selectables = colls.filter((coll) => !selectedColls.includes(coll)); 

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selectedColls.map((coll) => (
          <Badge key={coll._id}>
            {coll.title}
            <button type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(coll._id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((coll) => (
              <CommandItem
                key={coll._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(coll._id);
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {coll.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
  }
};

export default MultiSelect;
