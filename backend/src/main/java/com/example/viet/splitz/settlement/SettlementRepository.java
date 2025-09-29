package com.example.viet.splitz.settlement;

import com.example.viet.splitz.activity.dtos.ActivityDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    @Query("""
        SELECT new com.example.viet.splitz.activity.dtos.ActivityDto(
          CONCAT('settlement:', s.id), 'settlement', s.group.id, s.group.name, s.payer.name, s.receiver.name, 
          CASE WHEN s.payer.id = :userId THEN (0 - s.amount) ELSE s.amount END, s.date
        )
        FROM Settlement s
        WHERE s.group IN (
          SELECT m.group FROM Membership m WHERE m.user.id = :userId
        )
          AND (s.payer.id = :userId OR s.receiver.id = :userId)
        ORDER BY s.date DESC, s.id DESC
        """)
    List<ActivityDto> findRecentSettlementActivitiesForUser(Long userId);
}
