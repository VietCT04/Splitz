package com.example.viet.splitz.expense;

import com.example.viet.splitz.expense.dtos.AddExpenseDto;
import com.example.viet.splitz.expense.dtos.ExpenseResDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    Long createExpense(@RequestBody AddExpenseDto addExpenseDto){
        return expenseService.createExpense(addExpenseDto);
    }
}
