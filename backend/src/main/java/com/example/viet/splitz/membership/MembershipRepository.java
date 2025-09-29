package com.example.viet.splitz.membership;

import com.example.viet.splitz.group.Group;
import com.example.viet.splitz.user.dtos.UserBalanceDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    @Query("""
            select m.group
            from Membership m
            where m.user.id = :userId
            """)
    List<Group> findGroupByUserId(Long userId);
    @Query("""
            select count(*)
            from Membership m
            where m.group.id = :groupId
            """)
    Long findNumberOfMembersByGroupId(Long groupId);

    @Query("""
            SELECT new com.example.viet.splitz.user.dtos.UserBalanceDto(
              u.id,
              u.name,
              SUM(
                - COALESCE( (SELECT SUM(e.amount) FROM Expense e
                          WHERE e.group = m.group AND e.user = u), 0)
                + (
                    (SELECT COALESCE(SUM(e2.amount), 0) FROM Expense e2
                     WHERE e2.group = m.group)
                    / (SELECT COUNT(m2) FROM Membership m2 WHERE m2.group = m.group)
                  )
                + COALESCE( (SELECT SUM(s.amount) FROM Settlement s
                            WHERE s.group = m.group AND s.receiver = u), 0)
                - COALESCE( (SELECT SUM(s2.amount) FROM Settlement s2
                            WHERE s2.group = m.group AND s2.payer = u), 0)
              )
            )
            FROM Membership m
            JOIN m.user u
            WHERE u.id = :userId
            GROUP BY u.id, u.name
            """)
    UserBalanceDto sumUserNetAcrossGroups(Long userId);
}
