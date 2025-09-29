package com.example.viet.splitz.user;

import com.example.viet.splitz.user.dtos.UserBalanceDto;
import com.example.viet.splitz.user.dtos.UserResDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    @Query("""
            select u
            from User u
            join Membership m on m.user = u
            where m.group.id = :groupId
          """)
    List<User> findUserByGroupId(Long groupId);
    @Query("""
            SELECT new com.example.viet.splitz.user.dtos.UserBalanceDto(
              m.user.id,
              m.user.name,
              (
                - COALESCE( (SELECT SUM(e.amount) FROM Expense e
                          WHERE e.group = m.group AND e.user = m.user), 0)
                + (
                    (SELECT COALESCE(SUM(e2.amount), 0) FROM Expense e2
                     WHERE e2.group = m.group)
                    / (SELECT COUNT(m2) FROM Membership m2 WHERE m2.group = m.group)
                  )
                - COALESCE( (SELECT SUM(s.amount) FROM Settlement s
                            WHERE s.group = m.group AND s.receiver = m.user), 0)
                + COALESCE( (SELECT SUM(s2.amount) FROM Settlement s2
                            WHERE s2.group = m.group AND s2.payer = m.user), 0)
              )
            )
            FROM Membership m
            WHERE m.group.id = :groupId
            ORDER BY m.user.name
            """)
    List<UserBalanceDto> findUsersBalanceByGroupId(Long groupId);

    @Query("""
            SELECT
              - COALESCE( (SELECT SUM(e.amount) FROM Expense e
                        WHERE e.group.id = :groupId AND e.user.id = :userId), 0)
              + (
                  (SELECT COALESCE(SUM(e2.amount), 0) FROM Expense e2
                   WHERE e2.group.id = :groupId)
                  / (SELECT COUNT(m2) FROM Membership m2 WHERE m2.group.id = :groupId)
                )
              - COALESCE( (SELECT SUM(s.amount) FROM Settlement s
                          WHERE s.group.id = :groupId AND s.receiver.id = :userId), 0)
              + COALESCE( (SELECT SUM(s2.amount) FROM Settlement s2
                          WHERE s2.group.id = :groupId AND s2.payer.id = :userId), 0)
            FROM User u
            WHERE u.id = :userId
            """)
    BigDecimal findUserBalanceByGroupIdAndUserId(Long groupId, Long userId);
}
