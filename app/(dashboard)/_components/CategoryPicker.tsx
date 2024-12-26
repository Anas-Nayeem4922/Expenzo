"use client"
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TransactionType } from '@/lib/types'
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import CreateCategoryDialog from './CreateCategoryDialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function CategoryPicker({type, onChange} : {type : TransactionType, onChange : (value : string) => void}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        if(!value) {
            return
        }
        onChange(value);
    }, [onChange, value])
    const cateogoriesQuery = useQuery({
        queryKey : ["categories", type],
        queryFn : () => fetch(`/api/categories?type=${type}`).then(res => res.json())
    })
    const selectedCategory = cateogoriesQuery.data?.find((category : Category) => {
        return value == category.name
    })
    const successCallback = useCallback((category : Category) => {
        setValue(category.name);
        setOpen(x => !x);
    }, [setValue, setOpen])
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
                    {selectedCategory ? <CategoryRow category={selectedCategory}/> : ("Select a category")}
                    <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50 shrink-0'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command onSubmit={e => {
                    e.preventDefault();
                }}>
                    <CommandInput placeholder='Search category...'></CommandInput>
                    <CreateCategoryDialog type={type} successCallback={successCallback}/>
                    <CommandEmpty>
                        <p>Category not found</p>
                        <p className='text-xs text-muted-foreground'>
                            Tip: Create a new category
                        </p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {
                                cateogoriesQuery.data && cateogoriesQuery.data.map((category : Category) => (
                                    <CommandItem key={category.name} onSelect={value => {
                                        setValue(category.name)
                                        setOpen(x => !x)
                                    }}>
                                        <CategoryRow category={category}/>
                                        <Check className={cn(
                                            "mr-2 w-4 h-4 opacity-0",
                                            value === category.name && "opacity-100"
                                        )}/>
                                    </CommandItem>
                                ))
                            }
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function CategoryRow({category} : {category : Category}) {
    return <div className='flex items-center gap-2'>
        <span role='img'>{category.icon}</span>
        <span>{category.name}</span>
    </div>
}

export default CategoryPicker