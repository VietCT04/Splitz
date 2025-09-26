package com.example.viet.splitz.expense.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResDto(Long id, String description, BigDecimal amount, String paidBy, LocalDate date) {}
