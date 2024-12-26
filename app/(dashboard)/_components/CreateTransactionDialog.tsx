"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TransactionType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/schema/transaction'
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import CategoryPicker from './CategoryPicker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format, set } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateTransaction } from '../_actions/transactions'
import { toast } from 'sonner'
import { dateToUTC } from '@/lib/helpers'

interface Props {
    trigger : ReactNode,
    type : TransactionType
}

function CreateTransactionDialog({trigger, type} : Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver : zodResolver(CreateTransactionSchema),
        defaultValues : {
            type,
            date : new Date(),
        }
    })
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const handleCategoryChange = useCallback((value : string) => {
        form.setValue("category", value)
    }, [form]);
    const {mutate, isPending} = useMutation({
        mutationFn : CreateTransaction,
        onSuccess : () => {
            toast.success("Transaction created successfully 🎉", {
                id : "create-transaction"
            });
            form.reset({
                type,
                description : "",
                amount : 0,
                date : new Date(),
                category : undefined
            })
            queryClient.invalidateQueries({
                queryKey : ["overview"]
            })
            setOpen(x => !x)
        }
    })
    const onSubmit = useCallback((values : CreateTransactionSchemaType) => {
        toast.loading("Creating Transaction...", {
            id : "create-transaction"
        });
        mutate({
            ...values,
            //@ts-ignore
            date : dateToUTC(values.date)
        })
    }, [mutate])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new <span className={cn(
                        "m-1 ",
                        type === "income" ? "text-emerald-500" : "text-rose-500"
                    )}>{type}</span> transaction</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control} 
                        name="description" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Input defaultValue={""} {...field} />
                                </FormControl>
                                <FormDescription>Transaction description (Optional)</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control} 
                        name="amount" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Amount
                                </FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                                <FormDescription>Transaction amount</FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-6 pt-8">
                        <FormField
                            control={form.control} 
                            name="category" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Transaction category
                                    </FormLabel>
                                    <FormControl>
                                        <CategoryPicker type={type} onChange={handleCategoryChange}/>
                                    </FormControl>
                                    <FormDescription>Select a category</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control} 
                            name="date" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='mr-2'>
                                        Transaction date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}>{field.value ? (
                                                    format(field.value, "PPP")
                                                ) : <span>Pick a date</span>}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50'/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <Calendar mode='single' selected={field.value} onSelect={value => {
                                                if(!value) return;
                                                field.onChange(value)
                                            }} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>Select a date</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className='w-full font-bold mt-4'
                    >
                        {!isPending ? "Create" : <Loader2 className='animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionDialog