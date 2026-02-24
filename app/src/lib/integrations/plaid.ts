/**
 * Plaid integration service
 * Handles: link token creation, public token exchange, balance & transaction sync
 */
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

function getPlaidClient(): PlaidApi {
  const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments ?? "sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
        "PLAID-SECRET": process.env.PLAID_SECRET!,
      },
    },
  });
  return new PlaidApi(config);
}

export async function createLinkToken(userId: string) {
  const client = getPlaidClient();
  const response = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "HelmCFO",
    products: [Products.Transactions, Products.Auth],
    country_codes: [CountryCode.Us, CountryCode.Gb],
    language: "en",
  });
  return response.data.link_token;
}

export async function exchangePublicToken(publicToken: string) {
  const client = getPlaidClient();
  const response = await client.itemPublicTokenExchange({ public_token: publicToken });
  return {
    accessToken: response.data.access_token,
    itemId: response.data.item_id,
  };
}

export interface BankAccount {
  accountId: string;
  name: string;
  type: string;
  subtype: string | null;
  balanceCurrent: number | null;
  balanceAvailable: number | null;
  currency: string | null;
}

export async function getAccounts(accessToken: string): Promise<BankAccount[]> {
  const client = getPlaidClient();
  const response = await client.accountsGet({ access_token: accessToken });
  return response.data.accounts.map((a) => ({
    accountId: a.account_id,
    name: a.name,
    type: a.type,
    subtype: a.subtype ?? null,
    balanceCurrent: a.balances.current ?? null,
    balanceAvailable: a.balances.available ?? null,
    currency: a.balances.iso_currency_code ?? null,
  }));
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  date: string;
  amount: number;      // negative = credit/income, positive = debit/expense
  merchantName: string | null;
  category: string[];
  pending: boolean;
}

export async function getTransactions(
  accessToken: string,
  startDate: string,  // YYYY-MM-DD
  endDate: string
): Promise<Transaction[]> {
  const client = getPlaidClient();
  const response = await client.transactionsGet({
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
    options: { count: 500, offset: 0 },
  });
  return response.data.transactions.map((t) => ({
    transactionId: t.transaction_id,
    accountId: t.account_id,
    date: t.date,
    amount: t.amount,
    merchantName: t.merchant_name ?? null,
    category: t.category ?? [],
    pending: t.pending,
  }));
}

/** Summarise Plaid data into cash balance + monthly burn/income */
export async function getFinancialSummary(accessToken: string) {
  const accounts = await getAccounts(accessToken);

  // Total cash across all depository accounts
  const cashBalance = accounts
    .filter((a) => a.type === "depository")
    .reduce((sum, a) => sum + (a.balanceCurrent ?? 0), 0);

  // Last 60 days of transactions for burn calc
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 60);
  const transactions = await getTransactions(
    accessToken,
    start.toISOString().slice(0, 10),
    now.toISOString().slice(0, 10)
  );

  // Outflows only (positive amount = debit in Plaid convention)
  const totalOutflow = transactions
    .filter((t) => !t.pending && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyBurn = totalOutflow / 2; // avg over 2 months

  return { cashBalance, monthlyBurn, accounts };
}
