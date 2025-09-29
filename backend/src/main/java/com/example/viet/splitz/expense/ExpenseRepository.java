package com.example.viet.splitz.expense;

import com.example.viet.splitz.activity.dtos.ActivityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroup_Id(Long groupId);
    @Query("""
            SELECT new com.example.viet.splitz.activity.dtos.ActivityDto(
              CONCAT('expense:', e.id), 'expense', e.group.id, e.group.name, e.user.name, e.description, -e.amount, e.date
            )
            FROM Expense e
            WHERE e.group IN (
              SELECT m.group FROM Membership m WHERE m.user.id = :userId
            )
            ORDER BY e.date DESC, e.id DESC
            LIMIT 10
            """)
    List<ActivityDto> findRecentExpenseActivitiesForUserGroups(Long userId);
}
