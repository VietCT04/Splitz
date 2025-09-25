package com.example.viet.splitz.membership;

import com.example.viet.splitz.group.Group;
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
}
