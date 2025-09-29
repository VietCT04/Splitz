package com.example.viet.splitz.activity;

import com.example.viet.splitz.activity.dtos.ActivityDto;
import com.example.viet.splitz.expense.ExpenseRepository;
import com.example.viet.splitz.settlement.SettlementRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ActivityService {
    private final ExpenseRepository expenseRepository;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;

    public ActivityService(ExpenseRepository expenseRepository, SettlementRepository settlementRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.settlementRepository = settlementRepository;
        this.userRepository = userRepository;
    }

    public List<ActivityDto> getActivities(Authentication authentication) {
        User user = userRepository.findByName(authentication.getName()).orElseThrow();
        List<ActivityDto> expenses = expenseRepository.findRecentExpenseActivitiesForUserGroups(user.getId());
        List<ActivityDto> settlements = settlementRepository.findRecentSettlementActivitiesForUser(user.getId());
        System.out.println(settlements);
        List<ActivityDto> response = Stream.concat(expenses.stream(), settlements.stream())
                .sorted(Comparator.comparing(ActivityDto::date))
                .limit(10)
                .toList();
        System.out.println(response);
        return response;
    }
}
