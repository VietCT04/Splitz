package com.example.viet.splitz.group;

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
    private final GroupRepository groups;
    private final UserRepository users;
    private final ExpenseRepository expenses;

    public GroupService(GroupRepository groups, UserRepository users, ExpenseRepository expenses) {
        this.groups = groups;
        this.users = users;
        this.expenses = expenses;
    }

    public Group create(String name) {
        if (groups.existsByName(name)) {
            throw new IllegalArgumentException("Group name already exists");
        }
        Group g = new Group();
        g.setName(name);
        return groups.save(g);
    }

    @Transactional(readOnly = true)
    public Group get(Long id) {
        return groups.findById(id).orElseThrow(() -> new IllegalArgumentException("Group not found"));
    }

    @Transactional(readOnly = true)
    public List<Group> list() {
        return groups.findAll();
    }

    public Group rename(Long id, String newName) {
        Group g = get(id);
        g.setName(newName);
        return g;
    }

    public void delete(Long id) {
        groups.deleteById(id);
    }

    public void addUser(Long groupId, Long userId) {
        Group g = get(groupId);
        User u = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!g.getUsersList().contains(u)) {
            g.getUsersList().add(u);
        }
    }

    public void removeUser(Long groupId, Long userId) {
        Group g = get(groupId);
        g.getUsersList().removeIf(u -> u.getId().equals(userId));
    }


    public Expense addExpense(Long groupId, Expense e) {
        Group g = get(groupId);
        e.setGroup(g);
        expenses.save(e);
        g.getExpensesList().add(e);
        return e;
    }
}
