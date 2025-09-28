package com.example.viet.splitz.user.dtos;

import java.math.BigDecimal;

public record UserBalanceDto(Long userId, String name, BigDecimal net) {}
