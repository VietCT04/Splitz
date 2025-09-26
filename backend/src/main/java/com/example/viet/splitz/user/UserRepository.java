package com.example.viet.splitz.user;

import com.example.viet.splitz.user.dtos.UserResDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
