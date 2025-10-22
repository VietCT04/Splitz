package com.example.viet.splitz.group;

import com.example.viet.splitz.expense.ExpenseRepository;
import com.example.viet.splitz.membership.MembershipRepository;
import com.example.viet.splitz.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {
    @Mock GroupRepository groupRepository;
    @Mock UserRepository userRepository;
    @Mock ExpenseRepository expenseRepository;
    @Mock MembershipRepository membershipRepository;
    @InjectMocks GroupService groupService;
    @Test
    void createGroup_nameExisted_throws(){
        when(groupRepository.existsByName("group name")).thenReturn(Boolean.TRUE);
        Authentication authentication = mock(Authentication.class);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> groupService.create("group name", authentication));
        assertEquals("Group name already exists", exception.getMessage());
    }
}