package com.example.viet.splitz.expense.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AddExpenseDto(String description, BigDecimal amount, Long paidBy, LocalDate date, Long groupId) {}
