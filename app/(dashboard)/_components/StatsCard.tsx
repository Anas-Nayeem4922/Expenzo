"use client"
import { GetBalanceStatsType } from '@/app/api/stats/balance/route'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card } from '@/components/ui/card'
import { dateToUTC, GetFormatterForCurrency } from '@/lib/helpers'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import React, { ReactNode, useCallback, useMemo } from 'react'
import CountUp from "react-countup"

interface Props {
    from : Date,
    to : Date,
    userSettings : UserSettings
}

function StatsCard({from, to, userSettings} : Props) {
    const statsQuery = useQuery<GetBalanceStatsType>({
        queryKey : ["overview", "stats", from, to],
        queryFn : () => fetch(`/api/stats/balance?from=${dateToUTC(from)}&to=${dateToUTC(to)}`).then(res => res.json())
    })
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency]);
    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;
    const balance = income - expense
    return (
        <div className='relative flex justify-between items-center mt-4 w-full flex-wrap gap-2 md:flex-nowrap'>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard formatter={formatter} value={income} title="Income" icon={<TrendingUp className='h-12 w-12 items-center rounded-lg p-2 mr-4 text-emerald-500 bg-emerald-400/10'/>}/>
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard formatter={formatter} value={expense} title="Expense" icon={<TrendingDown className='h-12 w-12 items-center rounded-lg p-2 mr-4 text-rose-500 bg-rose-400/10'/>}/>
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatCard formatter={formatter} value={balance} title="Balance" icon={<Wallet className='h-12 w-12 items-center rounded-lg p-2 mr-4 text-violet-500 bg-violet-400/10'/>}/>
            </SkeletonWrapper>
        </div>
    )
}

function StatCard({formatter, value, title, icon} : {formatter : Intl.NumberFormat, value : number, title : string, icon : ReactNode}) {
    const formatFn = useCallback((value : number) => {
        return formatter.format(value)
    }, [formatter]);
    return <div>
        <Card className='flex h-24 w-full items-center gap-2 pr-20 pl-2'>
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className="text-muted-foreground">{title}</p>
                <CountUp preserveValue redraw={false} end={value} decimals={2} formattingFn={formatFn} className='text-2xl'/>
            </div>
        </Card>
    </div>
}

export default StatsCard