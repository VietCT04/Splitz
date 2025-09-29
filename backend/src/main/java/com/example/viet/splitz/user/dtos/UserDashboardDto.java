package com.example.viet.splitz.user.dtos;

import com.example.viet.splitz.activity.dtos.ActivityDto;
import com.example.viet.splitz.group.Group;

import java.math.BigDecimal;
import java.util.List;

public record UserDashboardDto(List<ActivityDto> activity, List<String> groups, BigDecimal stats) {}
