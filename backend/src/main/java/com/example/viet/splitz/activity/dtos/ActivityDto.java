package com.example.viet.splitz.activity.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ActivityDto(String id, String type, Long entityId, String entityName, String who, String description,
                          BigDecimal amount, LocalDate date){}
