package com.example.viet.splitz.settlement;

import com.example.viet.splitz.group.Group;
import com.example.viet.splitz.group.GroupRepository;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class SettlementService {
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public SettlementService(SettlementRepository settlementRepository, UserRepository userRepository, GroupRepository groupRepository) {
        this.settlementRepository = settlementRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    public void addSettlement(Authentication authentication, SettlementController.SettleReqDto settleReqDto){
        User payer = userRepository.findByName(authentication.getName()).orElseThrow();
        User receiver = userRepository.findById(settleReqDto.receiverId()).orElseThrow();
        Group group = groupRepository.findById(settleReqDto.groupId()).orElseThrow();
        Settlement settlement = new Settlement();
        settlement.setAmount(settleReqDto.amount());
        settlement.setDate(settleReqDto.date());
        settlement.setGroup(group);
        settlement.setPayer(payer);
        settlement.setReceiver(receiver);
        settlementRepository.save(settlement);
    }
}
