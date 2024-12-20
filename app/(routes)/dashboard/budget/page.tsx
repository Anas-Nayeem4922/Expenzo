import { PrismaClient } from "@prisma/client/extension"
const client = new PrismaClient();
export default function Budget() {
    return <div>
        My Budgets
    </div>
}