package com.example.viet.splitz.group;

import com.example.viet.splitz.membership.Membership;
import com.example.viet.splitz.membership.MembershipRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import com.example.viet.splitz.expense.Expense;
import com.example.viet.splitz.expense.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenses;
    private final MembershipRepository membershipRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository, ExpenseRepository expenses, MembershipRepository membershipRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.expenses = expenses;
        this.membershipRepository = membershipRepository;
    }

    public Group create(String name) {
        if (groupRepository.existsByName(name)) {
            throw new IllegalArgumentException("Group name already exists");
        }
        Group g = new Group();
        g.setName(name);
        return groupRepository.save(g);
    }

    @Transactional(readOnly = true)
    public Group get(Long id) {
        return groupRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Group not found"));
    }

    @Transactional(readOnly = true)
    public List<Group> list(String name) {
        Long userId = userRepository.findByName(name).orElseThrow().getId();
        return membershipRepository.findGroupByUserId(userId);
    }

    public Group rename(Long id, String newName) {
        Group g = get(id);
        g.setName(newName);
        return g;
    }

    public void delete(Long id) {
        groupRepository.deleteById(id);
    }


    public Expense addExpense(Long groupId, Expense e) {
        Group g = get(groupId);
        e.setGroup(g);
        expenses.save(e);
        g.getExpensesList().add(e);
        return e;
    }
}
