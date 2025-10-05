package com.example.viet.splitz.group;

import com.example.viet.splitz.expense.ExpenseRepository;
import com.example.viet.splitz.membership.Membership;
import com.example.viet.splitz.membership.MembershipRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GroupService.create")
class GroupServiceCreateTest {

    @Mock GroupRepository groupRepository;
    @Mock UserRepository userRepository;
    @Mock ExpenseRepository expenseRepository; // not used here, but required by ctor
    @Mock MembershipRepository membershipRepository;

    @Mock Authentication authentication;

    @InjectMocks GroupService groupService;

    @Captor ArgumentCaptor<Group> groupCaptor;
    @Captor ArgumentCaptor<Membership> membershipCaptor;

    @Test
    @DisplayName("saves a new group and adds the authenticated user as a member")
    void create_savesGroup_andMembership() {
        String groupName = "Trip to Bali";
        String authName = "alice";

        given(groupRepository.existsByName(groupName)).willReturn(false);
        given(authentication.getName()).willReturn(authName);
        given(userRepository.findByName(authName))
                .willReturn(Optional.of(user(101L, authName)));

        given(groupRepository.save(any(Group.class))).willAnswer(inv -> {
            Group g = inv.getArgument(0);
            g.setId(1L);
            return g;
        });
        willDoNothing().given(membershipRepository).save(any(Membership.class));

        Group result = groupService.create(groupName, authentication);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo(groupName);

        then(groupRepository).should().save(groupCaptor.capture());
        Group savedGroup = groupCaptor.getValue();
        assertThat(savedGroup.getId()).isNull();              // was new before repo assigned id
        assertThat(savedGroup.getName()).isEqualTo(groupName);

        then(membershipRepository).should().save(membershipCaptor.capture());
        Membership savedMembership = membershipCaptor.getValue();
        assertThat(savedMembership.getGroup().getId()).isEqualTo(1L);
        assertThat(savedMembership.getUser().getId()).isEqualTo(101L);
        assertThat(savedMembership.getJoinedAt())
                .isNotNull()
                .isBeforeOrEqualTo(Instant.now());
    }

    private static User user(Long id, String name) {
        User u = new User();
        u.setId(id);
        u.setName(name);
        return u;
    }
}
