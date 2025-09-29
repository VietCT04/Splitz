package com.example.viet.splitz.activity;

import com.example.viet.splitz.activity.dtos.ActivityDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }
    @GetMapping
    public List<ActivityDto> getActivities(Authentication authentication){
        return activityService.getActivities(authentication);
    }
}
