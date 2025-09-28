package com.example.viet.splitz.group.dtos;

import com.example.viet.splitz.expense.dtos.ExpenseResDto;
import com.example.viet.splitz.user.dtos.UserBalanceDto;
import com.example.viet.splitz.user.dtos.UserResDto;

import java.util.List;

public record GroupIdResDto(Long id, String name, List<UserResDto> members, List<ExpenseResDto> expenses, List<UserBalanceDto> balances){}
