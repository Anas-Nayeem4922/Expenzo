"use server"

import prisma from "@/lib/prisma";
import { CreateCategorySchemaType } from "@/schema/categories";
import { CreateTransactionSchema } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form : CreateCategorySchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if(!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }
    const user = await currentUser();
    if(!user) {
        redirect("/sign-up");
    }
    const {amount, category, date, description, type} = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where : {
            userId : user.id,
            name : category
        }
    })
    if(!categoryRow) {
        throw new Error("Category not found");
    }
    await prisma.$transaction([
        prisma.transaction.create({
            data : {
                userId : user.id,
                amount,
                category : categoryRow.name,
                categoryIcon : categoryRow.icon,
                date,
                type,
                description : description || ""
            }
        })
    ])
    // Month aggregate
    await prisma.monthHistory.upsert({
        where : {
            day_month_year_userId : {
                userId : user.id,
                day : date.getUTCDate(),
                month : date.getUTCMonth(),
                year : date.getUTCFullYear(),
            }
        },
        create : {
            userId : user.id,
            day : date.getUTCDate(),
            month : date.getUTCMonth(),
            year : date.getUTCFullYear(),
            expense : type === "expense" ? amount : 0,
            income : type === "income" ? amount : 0
        },
        update : {
            expense : type === "expense" ? amount : 0,
            income : type === "income" ? amount : 0
        }
    })
    // Year aggregate
    await prisma.yearHistory.upsert({
        where : {
            month_year_userId : {
                userId : user.id,
                month : date.getUTCMonth(),
                year : date.getUTCFullYear(),
            }
        },
        create : {
            userId : user.id,
            month : date.getUTCMonth(),
            year : date.getUTCFullYear(),
            expense : type === "expense" ? amount : 0,
            income : type === "income" ? amount : 0
        },
        update : {
            expense : type === "expense" ? amount : 0,
            income : type === "income" ? amount : 0
        }
    })
}