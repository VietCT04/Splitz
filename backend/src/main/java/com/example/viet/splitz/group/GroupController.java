package com.example.viet.splitz.group;

import com.example.viet.splitz.group.dtos.GroupIdResDto;
import org.apache.coyote.Response;
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

    private final GroupService groupService;

    public GroupController(GroupService service) {
        this.groupService = service;
    }

    // DTOs
    public record CreateGroupReq(String name) {}
    public record RenameGroupReq(String name) {}
    public record ExpenseReq(String description, BigDecimal amount) {}
    public record AddMemberReq(String name) {}


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Group create(@RequestBody CreateGroupReq req, Authentication authentication) {
        return groupService.create(req.name(), authentication);
    }

    @GetMapping("/{id}")
    public GroupIdResDto get(@PathVariable Long id) {
        return groupService.get(id);
    }

    @GetMapping
    public List<GroupService.GroupListDto> list(Authentication authentication) {
        return groupService.list(authentication.getName());
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Void> addMember(@PathVariable Long groupId, @RequestBody AddMemberReq userName){
        Boolean success = groupService.addMember(groupId, userName.name());
        if (!success) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        groupService.delete(id);
    }
}

