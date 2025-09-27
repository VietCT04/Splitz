package com.example.viet.splitz.expense.impl;

import com.example.viet.splitz.expense.Expense;
import com.example.viet.splitz.expense.ExpenseRepository;
import com.example.viet.splitz.expense.ExpenseService;
import com.example.viet.splitz.expense.dtos.AddExpenseDto;
import com.example.viet.splitz.group.GroupRepository;
import com.example.viet.splitz.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, UserRepository userRepository, GroupRepository groupRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    @Override
    public Long createExpense(AddExpenseDto addExpenseDto) {
        Expense expense =  new Expense();
        expense.setDescription(addExpenseDto.description());
        expense.setAmount(addExpenseDto.amount());
        expense.setUser(userRepository.findById(addExpenseDto.paidBy()).orElseThrow());
        expense.setDate(addExpenseDto.date());
        expense.setGroup(groupRepository.findById(addExpenseDto.groupId()).orElseThrow());
        expenseRepository.save(expense);
        System.out.println(expense);
        return expense.getId();
    }
}
