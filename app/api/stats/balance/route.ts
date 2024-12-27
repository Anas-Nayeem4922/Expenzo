import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    const user = await currentUser();
    if(!user) {
        redirect("/sign-up");
    }
    const {searchParams} = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const queryParams = OverviewQuerySchema.safeParse({from, to});
    if(!queryParams.success) {
        return NextResponse.json(queryParams.error.message, {status: 400});
    }
    const status = await getBalanceSheet(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    )
    return NextResponse.json(status);
}

export type GetBalanceStatsType = Awaited<ReturnType<typeof getBalanceSheet>>;

async function getBalanceSheet(userId : string, from : Date, to : Date) {
    const total = await prisma.transaction.groupBy({
        by : ["type"],
        where : {
            userId,
            date : {
                gte : from,
                lte : to
            }
        },
        _sum : {
            amount : true
        }
    })
    return {
        expense : total.find(t => t.type === "expense")?._sum.amount || 0,
        income : total.find(t => t.type === "income")?._sum.amount || 0,
    }
}