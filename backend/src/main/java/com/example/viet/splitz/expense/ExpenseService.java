package com.example.viet.splitz.expense;

import com.example.viet.splitz.expense.dtos.AddExpenseDto;

public interface ExpenseService {
    Long createExpense(AddExpenseDto addExpenseDto);
}
