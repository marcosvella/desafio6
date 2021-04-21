/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    let income = 0;
    let outcome = 0;

    for (const x in transactions) {
      if (transactions[x].type === 'income') income += transactions[x].value;
      if (transactions[x].type === 'outcome') outcome += transactions[x].value;
    }

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
