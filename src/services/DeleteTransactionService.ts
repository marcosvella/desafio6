import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne({ id });

    if (!transaction)
      throw new AppError(`Transaction with ID ${id} does not exist`);
    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
