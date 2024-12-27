import { Currency } from "./currency";

export function dateToUTC(date: Date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(), 
            date.getDate(),  
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    );
}

export function GetFormatterForCurrency(currency : string) {
    const locale = Currency.find((c) => c.value === currency)?.locale
    return new Intl.NumberFormat(locale, {
        style : "currency",
        currency
    })
}
