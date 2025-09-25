package com.example.viet.splitz.group;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.viet.splitz.expense.Expense;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService service;

    public GroupController(GroupService service) {
        this.service = service;
    }

    // DTOs
    public record CreateGroupReq(String name) {}
    public record RenameGroupReq(String name) {}
    public record ExpenseReq(String description, BigDecimal amount) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Group create(@RequestBody CreateGroupReq req, Authentication authentication) {
        return service.create(req.name(), authentication);
    }

    @GetMapping("/{id}")
    public Group get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping
    public List<Group> list(Authentication authentication) {
        return service.list(authentication.getName());
    }

    @PutMapping("/{id}")
    public Group rename(@PathVariable Long id, @RequestBody RenameGroupReq req) {
        return service.rename(id, req.name());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/expenses")
    public ResponseEntity<Expense> addExpense(@PathVariable Long id, @RequestBody ExpenseReq req) {
        Expense e = new Expense();
        e.setDescription(req.description());
        e.setAmount(req.amount());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addExpense(id, e));
    }
}

