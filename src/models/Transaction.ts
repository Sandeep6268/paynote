import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  personName: {
    type: String,
    required: [true, 'Please provide a person name'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [1, 'Amount must be greater than 0'],
    set: (val: number) => Math.floor(val), // Always floor the value to integer
  },
  purpose: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['given', 'received'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);