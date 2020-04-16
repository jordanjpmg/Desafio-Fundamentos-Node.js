import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(type => type.type === 'income')
      .reduce((acc, cur) => acc + cur.value, 0);
    const outcome = this.transactions
      .filter(type => type.type === 'outcome')
      .reduce((acc, cur) => acc + cur.value, 0);
    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };
    if (outcome > total) {
      throw Error('Saldo insuficiente');
    } else {
      return balance;
    }
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    const balance = this.getBalance();

    if (balance.outcome > balance.total) {
      throw Error('Saldo insuficiente');
    } else {
      return transaction;
    }
  }
}

export default TransactionsRepository;
