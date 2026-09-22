import type { IPhoneIndexEntry } from "@/data/iphone-index";
import { iphonesDuo } from "@/data/iphone-duo";
import { wages } from "@/data/wages";

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

export const iphoneDuoIndex: IPhoneIndexEntry[] = iphonesDuo.map((phone) => {
  const wage = wageByCode.get(phone.countryCode);
  const hourlyWage = wage?.cnyEquivalent ?? 0;
  const hoursToBuy = wage
    ? Math.round((phone.cnyEquivalent / hourlyWage) * 10) / 10
    : null;
  return {
    country: phone.country,
    countryCode: phone.countryCode,
    hourlyWage,
    hoursToBuy,
    iphonePrice: phone.cnyEquivalent,
    iphoneSource: phone.source,
    iphoneSourceUrl: phone.sourceUrl,
    localCurrency: phone.localCurrency,
    localPrice: phone.localPrice,
    region: phone.region,
    taxNote: phone.taxNote,
    wageSource: wage?.source ?? "",
    wageSourceUrl: wage?.sourceUrl ?? "",
  };
});

export const sortedByHoursDuo = iphoneDuoIndex.toSorted((a, b) => {
  if (a.hoursToBuy === null && b.hoursToBuy === null) {
    return 0;
  }
  if (a.hoursToBuy === null) {
    return 1;
  }
  if (b.hoursToBuy === null) {
    return -1;
  }
  return a.hoursToBuy - b.hoursToBuy;
});
