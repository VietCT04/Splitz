package com.example.viet.splitz.settlement;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/settlement")
public class SettlementController {
    private final SettlementService settlementService;

    public record SettleReqDto(Long groupId, BigDecimal amount, LocalDate date, Long receiverId) {}

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @PostMapping
    public ResponseEntity<String> addSettlement(Authentication authentication, @RequestBody SettleReqDto settleReqDto){
        settlementService.addSettlement(authentication, settleReqDto);
        return ResponseEntity.ok("Success");
    }
}
