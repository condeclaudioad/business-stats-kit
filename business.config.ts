/** Server-side business scope. Never put secrets here. All IDs below are examples. */
export const business = {
  name: "Mi negocio",
  currency: "USD",
  timezone: "America/Argentina/Buenos_Aires",
  stripe: { productIds: [] as string[] },
  meta: {
    // Explicit campaign IDs prevent combining other businesses in a shared account.
    accounts: [] as { accountId: string; campaignIds: string[] }[],
  },
};
