/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';

interface CSV {
  title: string;
  type: string;
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<any> {
    const file = await fs.readFileSync(filePath).toLocaleString();
    const CreateTransaction = new CreateTransactionService();

    let rows = file.split(/\r\n/);
    rows = rows.splice(1);

    const transactions = [];

    for (const x of rows) {
      if (x === '') break;

      const items = x.split(',');

      const transaction = {
        title: items[0],
        type: items[1].replace(' ', ''),
        value: parseInt(items[2].replace(' ', '')),
        category: items[3].replace(' ', ''),
      };

      transactions.push(transaction);
    }

    for (const y of transactions) {
      await CreateTransaction.execute({
        title: y.title,
        type: y.type,
        value: y.value,
        category: y.category,
      });
    }

    return transactions;
  }
}

export default ImportTransactionsService;
