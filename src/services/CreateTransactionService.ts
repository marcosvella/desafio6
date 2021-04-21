import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<any> {
    if (type !== 'income' && type !== 'outcome')
      throw new AppError('Type must be income/outcome', 400);

    const TransactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await TransactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total)
      throw new AppError('Outcome value is bigger than available value.');

    const categoriesRepository = getRepository(Category);
    const checkIfCategoryExists = await categoriesRepository.findOne({
      title: category,
    });

    if (!checkIfCategoryExists) {
      console.log(`Category ${category} does not exists`);
      const newCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);
    }

    const transactionCategory = await categoriesRepository.find({
      title: category,
    });

    const transactionsRepository = getRepository(Transaction);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory[0].id,
    });

    await transactionsRepository.save(transaction);
    return { id: transaction.id };
  }
}

export default CreateTransactionService;
