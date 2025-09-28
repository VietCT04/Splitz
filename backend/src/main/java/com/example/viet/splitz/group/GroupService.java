package com.example.viet.splitz.group;

import com.example.viet.splitz.expense.dtos.ExpenseResDto;
import com.example.viet.splitz.group.dtos.GroupIdResDto;
import com.example.viet.splitz.membership.Membership;
import com.example.viet.splitz.membership.MembershipRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import com.example.viet.splitz.expense.Expense;
import com.example.viet.splitz.expense.ExpenseRepository;
import com.example.viet.splitz.user.dtos.UserBalanceDto;
import com.example.viet.splitz.user.dtos.UserResDto;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final MembershipRepository membershipRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository, ExpenseRepository expenseRepository,
                        MembershipRepository membershipRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.membershipRepository = membershipRepository;
    }

    public Group create(String name, Authentication authentication) {
        if (groupRepository.existsByName(name)) {
            throw new IllegalArgumentException("Group name already exists");
        }
        Group g = new Group();
        g.setName(name);
        groupRepository.save(g);
        Membership membership = new Membership();
        membership.setGroup(g);
        membership.setUser(userRepository.findByName(authentication.getName()).orElseThrow());
        membership.setJoinedAt(Instant.now());
        membershipRepository.save(membership);
        return g;
    }

    @Transactional(readOnly = true)
    public GroupIdResDto get(Long id) {
        String groupName = groupRepository.findById(id).orElseThrow().getName();
        List<User> userList = userRepository.findUserByGroupId(id);
        List<UserResDto> userResDtoList = new ArrayList<>();
        for (int i = 0; i < userList.size(); i++){
            UserResDto userResDto = new UserResDto(
                    userList.get(i).getId(),
                    userList.get(i).getName()
            );
            userResDtoList.add(userResDto);
        }
        List<Expense> expenseList = expenseRepository.findByGroup_Id(id);
        List<ExpenseResDto> expenseResDtoList = new ArrayList<>();
        for (int i = 0; i < expenseList.size(); i++){
            ExpenseResDto expenseResDto = new ExpenseResDto(
                    expenseList.get(i).getId(),
                    expenseList.get(i).getDescription(),
                    expenseList.get(i).getAmount(),
                    expenseList.get(i).getUser().getName(),
                    expenseList.get(i).getDate()
            );
            expenseResDtoList.add(expenseResDto);
        }
        List<UserBalanceDto> userBalanceDtoList = userRepository.findUsersBalanceByGroupId(id);
        return new GroupIdResDto(id, groupName, userResDtoList, expenseResDtoList, userBalanceDtoList);
    }

    @Transactional(readOnly = true)
    public List<Group> list(String name) {
        Long userId = userRepository.findByName(name).orElseThrow().getId();
        return membershipRepository.findGroupByUserId(userId);
    }

    public void delete(Long id) {
        groupRepository.deleteById(id);
    }
}
