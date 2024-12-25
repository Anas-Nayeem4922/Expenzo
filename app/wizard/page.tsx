import { CurrencyBox } from "@/components/CurrencyBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
    const user = await currentUser();
    if(!user) {
        redirect("/sign-up");
    }
    return <div className="container flex flex-col max-w-2xl items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl text-center">
                Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋</span>
            </h1>
            <h2 className="mt-4 mb-6 text-center text-base text-muted-foreground">
                Let's get started by setting up your currency
            </h2>
        </div>
        <Separator/>
        <Card className="w-full">
            <CardHeader className="">
                <CardTitle>
                    Currency
                </CardTitle>
                <CardDescription>
                    <div className="mb-4">
                        Set your default currency for transactions
                    </div>
                </CardDescription>
                <CardContent>
                    <CurrencyBox/>
                </CardContent>
            </CardHeader>
        </Card>
        <Separator/>
        <Button className="w-full" asChild>
            <Link href={"/"}>I'm done, Take me to the dashboard</Link>
        </Button>
        <div className="mt-8 ">
            <Logo/>
        </div>
    </div>
}