package com.example.viet.splitz.user.impl;

import com.example.viet.splitz.activity.ActivityService;
import com.example.viet.splitz.activity.dtos.ActivityDto;
import com.example.viet.splitz.group.Group;
import com.example.viet.splitz.group.GroupRepository;
import com.example.viet.splitz.membership.Membership;
import com.example.viet.splitz.membership.MembershipRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import com.example.viet.splitz.user.UserService;
import com.example.viet.splitz.user.dtos.UserBalanceDto;
import com.example.viet.splitz.user.dtos.UserDashboardDto;
import jakarta.validation.constraints.Null;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final MembershipRepository membershipRepository;

    public UserServiceImpl(UserRepository userRepository, ActivityService activityService, MembershipRepository membershipRepository) {
        this.userRepository = userRepository;
        this.activityService = activityService;
        this.membershipRepository = membershipRepository;
    }

    @Override
    public void createNewUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id) {
        User user = userRepository.getReferenceById(id);
        userRepository.delete(user);
    }

    @Override
    public UserDashboardDto getUserDashboard(Authentication authentication) {
        User user = userRepository.findByName(authentication.getName()).orElseThrow();
        List<ActivityDto> activityDtoList = activityService.getActivities(authentication);
        List<Group> groupList = membershipRepository.findGroupByUserId(user.getId());
        BigDecimal userBalance = membershipRepository.sumUserNetAcrossGroups(user.getId()).map(UserBalanceDto::net).orElse(BigDecimal.ZERO);
        List<String> groupNames = groupList.stream().map(Group::getName).toList();
        return new UserDashboardDto(activityDtoList, groupNames, userBalance);
    }
}
